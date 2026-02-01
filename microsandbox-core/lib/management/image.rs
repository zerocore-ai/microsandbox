//! Container image management for Microsandbox.
//!
//! This module provides functionality for managing container images from various
//! registries. It supports pulling images from Docker and Sandboxes.io registries,
//! handling image layers, and managing the local image cache.

use crate::{
    MicrosandboxError, MicrosandboxResult,
    management::db::{self},
    oci::{GlobalLayerCache, GlobalLayerOps, Reference, Registry},
};
use futures::{StreamExt, future};
#[cfg(feature = "cli")]
use indicatif::{ProgressBar, ProgressStyle};
#[cfg(feature = "cli")]
use microsandbox_utils::term::{self, MULTI_PROGRESS};
use microsandbox_utils::{
    DockerAuthCredentials, StoredRegistryCredentials, load_docker_registry_credentials,
    load_stored_registry_credentials,
};
use microsandbox_utils::{EXTRACTED_LAYER_SUFFIX, LAYERS_SUBDIR, OCI_DB_FILENAME, env};
use oci_client::secrets::RegistryAuth;
use oci_spec::image::Platform;
#[cfg(feature = "cli")]
use pin_project_lite::pin_project;
use sqlx::{Pool, Sqlite};
#[cfg(feature = "cli")]
use std::task::Poll;
use std::{
    ffi::{CStr, CString},
    os::unix::fs::PermissionsExt,
    path::{Path, PathBuf},
};
use tempfile::tempdir;
#[cfg(feature = "cli")]
use tokio::io::ReadBuf;
use tokio::{
    fs::{self},
    io::AsyncRead,
};
use tokio_tar::Archive;

//--------------------------------------------------------------------------------------------------
// Constants
//--------------------------------------------------------------------------------------------------

#[cfg(feature = "cli")]
/// Spinner message used for extracting layers.
const EXTRACT_LAYERS_MSG: &str = "Extracting layers";

//--------------------------------------------------------------------------------------------------
// Functions
//--------------------------------------------------------------------------------------------------

/// Pulls an image using whatever registry is configured.
///
/// ## Arguments
///
/// * `image` - The reference to the image to pull
/// * `layer_output_dir` - The path to store the layer files
///
/// # Examples
///
/// ```no_run
/// use microsandbox_core::management::image;
/// use microsandbox_core::oci::Reference;
/// use std::path::PathBuf;
///
/// #[tokio::main]
/// async fn main() -> anyhow::Result<()> {
///     let layer_output_dir = Some(PathBuf::from("/custom/path"));
///
///     // Pull a single image from Docker registry
///     image::pull("docker.io/library/ubuntu:latest".parse().unwrap(), layer_output_dir.clone()).await?;
///
///     // Pull an image from the default registry (when no registry is specified in the reference)
///     image::pull("nginx:latest".parse().unwrap(), layer_output_dir.clone()).await?;
///
///     // You can set the OCI_REGISTRY_DOMAIN environment variable to specify your default registry
///     unsafe { std::env::set_var("OCI_REGISTRY_DOMAIN", "docker.io"); }
///     image::pull("alpine:latest".parse().unwrap(), layer_output_dir.clone()).await?;
///
///     // Pull an image from Docker registry and store the layers in a custom directory
///     image::pull("docker.io/library/ubuntu:latest".parse().unwrap(), layer_output_dir).await?;
///
///     Ok(())
/// }
/// ```
pub async fn pull(image: Reference, layer_output_dir: Option<PathBuf>) -> MicrosandboxResult<()> {
    let temp_download_dir = tempdir()?;
    let temp_download_dir = temp_download_dir.path().to_path_buf();
    tracing::info!(
        "temporary download directory: {}",
        temp_download_dir.display()
    );

    let layer = GlobalLayerCache::default();
    let microsandbox_home_path = env::get_microsandbox_home_path();
    let db_path = microsandbox_home_path.join(OCI_DB_FILENAME);
    let db = db::get_or_create_pool(&db_path, &db::OCI_DB_MIGRATOR).await?;
    let auth = resolve_registry_auth(&image)?;
    let registry = Registry::new(
        temp_download_dir,
        db.clone(),
        Platform::default(),
        layer,
        auth,
    )
    .await?;

    // Use custom layer_output_dir if specified, otherwise use default microsandbox layers directory
    let layers_dir = layer_output_dir.unwrap_or_else(|| microsandbox_home_path.join(LAYERS_SUBDIR));
    pull_image_and_extract(&registry, &db, &image, layers_dir).await
}

/// Pulls a single image from the registry.
///
/// ## Arguments
///
/// * `image` - The reference to the image to pull
/// * `download_dir` - The directory to download the image layers to
/// * `output_layers_dir` - The directory to store the pulled image layers
///
/// ## Errors
///
/// Returns an error if:
/// * Failed to create temporary directories
/// * Failed to initialize Docker registry client
/// * Failed to pull the image from Docker registry
async fn pull_image_and_extract<L>(
    registry: &Registry<L>,
    pool: &Pool<Sqlite>,
    image: &Reference,
    output_layers_dir: PathBuf,
) -> MicrosandboxResult<()>
where
    L: GlobalLayerOps + Send + Sync,
{
    // Create layers directory if it doesn't exist
    fs::create_dir_all(&output_layers_dir).await?;

    // Check if we need to pull the image
    if check_image_layers(pool, image, &output_layers_dir).await? {
        tracing::info!("image {} and all its layers exist, skipping pull", image);
        return Ok(());
    }

    // filter out only downloaded layers so that we can extract them
    // if a layer already exists in the global layer directory, it will be skipped
    // since it should be already extracted
    let layer_paths = registry
        .pull_image(image)
        .await?
        .into_iter()
        .filter_map(|layer| layer.download_path())
        .collect::<Vec<_>>();

    #[cfg(feature = "cli")]
    let extract_layers_sp = term::create_spinner(
        EXTRACT_LAYERS_MSG.to_string(),
        None,
        Some(layer_paths.len() as u64),
    );

    let extraction_futures: Vec<_> = layer_paths
        .into_iter()
        .map(|path| {
            let layers_dir = output_layers_dir.clone();
            #[cfg(feature = "cli")]
            let extract_layers_sp = extract_layers_sp.clone();
            async move {
                let result = extract_layer(path, &layers_dir).await;
                #[cfg(feature = "cli")]
                extract_layers_sp.inc(1);
                result
            }
        })
        .collect();

    // Wait for all extractions to complete
    for result in future::join_all(extraction_futures).await {
        result?;
    }

    #[cfg(feature = "cli")]
    extract_layers_sp.finish();

    Ok(())
}

//--------------------------------------------------------------------------------------------------
// Functions: Auth resolution
//--------------------------------------------------------------------------------------------------

/// Resolve registry authentication for a given image reference.
///
/// This uses the following precedence:
/// 1) Environment variables
/// 2) Stored credentials (msb login)
/// 3) Docker config (auths/cred helpers)
/// 4) Anonymous
pub fn resolve_registry_auth(reference: &Reference) -> MicrosandboxResult<RegistryAuth> {
    // TODO: Ensure msb server inherits auth sources (env, stored creds, Docker config) in its runtime.
    let registry = reference.registry();
    if let Some(auth) = resolve_env_auth()? {
        return Ok(auth);
    }

    match load_stored_registry_credentials(registry) {
        Ok(Some(creds)) => return Ok(convert_stored_credentials(creds)),
        Ok(None) => (),
        Err(err) => {
            tracing::warn!("failed to load stored registry auth: {}", err);
        }
    }

    match load_docker_registry_credentials(registry) {
        Ok(Some(creds)) => Ok(convert_docker_credentials(creds)),
        Ok(None) => Ok(RegistryAuth::Anonymous),
        Err(err) => {
            tracing::warn!("failed to load docker config auth: {}", err);
            Ok(RegistryAuth::Anonymous)
        }
    }
}

fn resolve_env_auth() -> MicrosandboxResult<Option<RegistryAuth>> {
    let token = env::get_registry_token();
    let username = env::get_registry_username();
    let password = env::get_registry_password();

    if token.is_none() && username.is_none() && password.is_none() {
        return Ok(None);
    }

    if token.is_some() && (username.is_some() || password.is_some()) {
        return Err(MicrosandboxError::ConfigValidation(
            "registry token cannot be combined with username/password".to_string(),
        ));
    }

    if let Some(token) = token {
        return Ok(Some(RegistryAuth::Bearer(token)));
    }

    match (username, password) {
        (Some(username), Some(password)) => Ok(Some(RegistryAuth::Basic(username, password))),
        (None, None) => Ok(None),
        _ => Err(MicrosandboxError::ConfigValidation(
            "both registry username and password are required".to_string(),
        )),
    }
}

fn convert_docker_credentials(creds: DockerAuthCredentials) -> RegistryAuth {
    match creds {
        DockerAuthCredentials::Basic { username, password } => {
            RegistryAuth::Basic(username, password)
        }
        DockerAuthCredentials::Token { token } => RegistryAuth::Bearer(token),
    }
}

fn convert_stored_credentials(creds: StoredRegistryCredentials) -> RegistryAuth {
    match creds {
        StoredRegistryCredentials::Basic { username, password } => {
            RegistryAuth::Basic(username, password)
        }
        StoredRegistryCredentials::Token { token } => RegistryAuth::Bearer(token),
    }
}

//--------------------------------------------------------------------------------------------------
// Tests
//--------------------------------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::Mutex;
    use std::{env as std_env, fs};
    use tempfile::TempDir;

    static ENV_LOCK: Mutex<()> = Mutex::new(());

    struct EnvGuard {
        key: &'static str,
        prev: Option<std::ffi::OsString>,
    }

    impl EnvGuard {
        fn set(key: &'static str, value: impl Into<std::ffi::OsString>) -> Self {
            let prev = std_env::var_os(key);
            let value: std::ffi::OsString = value.into();
            unsafe { std_env::set_var(key, &value) };
            Self { key, prev }
        }

        fn remove(key: &'static str) -> Self {
            let prev = std_env::var_os(key);
            unsafe { std_env::remove_var(key) };
            Self { key, prev }
        }
    }

    impl Drop for EnvGuard {
        fn drop(&mut self) {
            if let Some(value) = self.prev.take() {
                unsafe { std_env::set_var(self.key, value) };
            } else {
                unsafe { std_env::remove_var(self.key) };
            }
        }
    }

    fn write_docker_config(temp_dir: &TempDir, contents: &str) -> std::path::PathBuf {
        let path = temp_dir.path().join("config.json");
        fs::write(&path, contents).expect("write docker config");
        path
    }

    #[test]
    fn env_token_resolves() {
        let _lock = ENV_LOCK.lock().unwrap();
        let _host = EnvGuard::remove(env::MSB_REGISTRY_HOST_ENV_VAR);
        let _user = EnvGuard::remove(env::MSB_REGISTRY_USERNAME_ENV_VAR);
        let _pass = EnvGuard::remove(env::MSB_REGISTRY_PASSWORD_ENV_VAR);
        let _token = EnvGuard::set(env::MSB_REGISTRY_TOKEN_ENV_VAR, "token-abc");

        let auth = resolve_env_auth().expect("resolve env").expect("auth");
        assert!(matches!(auth, RegistryAuth::Bearer(t) if t == "token-abc"));
    }

    #[test]
    fn env_basic_requires_both_fields() {
        let _lock = ENV_LOCK.lock().unwrap();
        let _host = EnvGuard::remove(env::MSB_REGISTRY_HOST_ENV_VAR);
        let _token = EnvGuard::remove(env::MSB_REGISTRY_TOKEN_ENV_VAR);
        let _user = EnvGuard::set(env::MSB_REGISTRY_USERNAME_ENV_VAR, "user");
        let _pass = EnvGuard::remove(env::MSB_REGISTRY_PASSWORD_ENV_VAR);

        let err = resolve_env_auth().expect_err("missing password should error");
        assert!(matches!(err, MicrosandboxError::ConfigValidation(_)));
    }

    #[test]
    fn resolve_registry_auth_prefers_env() {
        let _lock = ENV_LOCK.lock().unwrap();
        let _host = EnvGuard::remove(env::MSB_REGISTRY_HOST_ENV_VAR);
        let _user = EnvGuard::remove(env::MSB_REGISTRY_USERNAME_ENV_VAR);
        let _pass = EnvGuard::remove(env::MSB_REGISTRY_PASSWORD_ENV_VAR);
        let _token = EnvGuard::set(env::MSB_REGISTRY_TOKEN_ENV_VAR, "token-xyz");
        let msb_home = TempDir::new().expect("temp msb home");
        let _msb_home = EnvGuard::set(env::MICROSANDBOX_HOME_ENV_VAR, msb_home.path());

        let temp = TempDir::new().expect("temp dir");
        let config = r#"{
  "auths": {
    "registry.example.com": { "username": "user", "password": "pass" }
  }
}"#;
        let path = write_docker_config(&temp, config);
        let _docker_config = EnvGuard::set("DOCKER_CONFIG", path.to_string_lossy().to_string());

        let reference: Reference = "registry.example.com/repo:latest".parse().unwrap();
        let auth = resolve_registry_auth(&reference).expect("resolve auth");
        assert!(matches!(auth, RegistryAuth::Bearer(t) if t == "token-xyz"));
    }

    #[test]
    fn resolve_registry_auth_from_docker_config() {
        let _lock = ENV_LOCK.lock().unwrap();
        let _host = EnvGuard::remove(env::MSB_REGISTRY_HOST_ENV_VAR);
        let _token = EnvGuard::remove(env::MSB_REGISTRY_TOKEN_ENV_VAR);
        let _user = EnvGuard::remove(env::MSB_REGISTRY_USERNAME_ENV_VAR);
        let _pass = EnvGuard::remove(env::MSB_REGISTRY_PASSWORD_ENV_VAR);
        let msb_home = TempDir::new().expect("temp msb home");
        let _msb_home = EnvGuard::set(env::MICROSANDBOX_HOME_ENV_VAR, msb_home.path());

        let temp = TempDir::new().expect("temp dir");
        let config = r#"{
  "auths": {
    "registry.example.com": { "username": "user", "password": "pass" }
  }
}"#;
        let path = write_docker_config(&temp, config);
        let _docker_config = EnvGuard::set("DOCKER_CONFIG", path.to_string_lossy().to_string());

        let reference: Reference = "registry.example.com/repo:latest".parse().unwrap();
        let auth = resolve_registry_auth(&reference).expect("resolve auth");
        assert!(matches!(auth, RegistryAuth::Basic(u, p) if u == "user" && p == "pass"));
    }

    #[test]
    fn resolve_registry_auth_defaults_anonymous_when_no_config() {
        let _lock = ENV_LOCK.lock().unwrap();
        let _host = EnvGuard::remove(env::MSB_REGISTRY_HOST_ENV_VAR);
        let _token = EnvGuard::remove(env::MSB_REGISTRY_TOKEN_ENV_VAR);
        let _user = EnvGuard::remove(env::MSB_REGISTRY_USERNAME_ENV_VAR);
        let _pass = EnvGuard::remove(env::MSB_REGISTRY_PASSWORD_ENV_VAR);
        let msb_home = TempDir::new().expect("temp msb home");
        let _msb_home = EnvGuard::set(env::MICROSANDBOX_HOME_ENV_VAR, msb_home.path());

        let temp = TempDir::new().expect("temp dir");
        let _docker_config =
            EnvGuard::set("DOCKER_CONFIG", temp.path().to_string_lossy().to_string());

        let reference: Reference = "registry.example.com/repo:latest".parse().unwrap();
        let auth = resolve_registry_auth(&reference).expect("resolve auth");
        assert!(matches!(auth, RegistryAuth::Anonymous));
    }
}

//--------------------------------------------------------------------------------------------------
// Functions: Helpers
//--------------------------------------------------------------------------------------------------

/// Checks if all layers for an image exist in both the database and the layers directory.
///
/// ## Arguments
///
/// * `pool` - The database connection pool
/// * `image` - The reference to the image to check
/// * `layers_dir` - The directory where layers should be stored
///
/// ## Returns
///
/// Returns Ok(true) if all layers exist and are valid, Ok(false) if any layers are missing
/// or invalid. Any errors during the check process will return Ok(false) with a warning log.
async fn check_image_layers(
    pool: &Pool<Sqlite>,
    image: &Reference,
    layers_dir: impl AsRef<Path>,
) -> MicrosandboxResult<bool> {
    let layers_dir = layers_dir.as_ref();

    // Check if the image exists in the database
    match db::image_exists(pool, &image.to_string()).await {
        Ok(true) => {
            // Image exists, get all layer digests for this image
            match db::get_image_layer_digests(pool, &image.to_string()).await {
                Ok(layer_digests) => {
                    tracing::info!("layer_digests: {:?}", layer_digests);
                    if layer_digests.is_empty() {
                        tracing::warn!("no layers found for image {}", image);
                        return Ok(false);
                    }

                    // Check if all layers exist in the layers directory
                    for digest in &layer_digests {
                        let layer_path =
                            layers_dir.join(format!("{}.{}", digest, EXTRACTED_LAYER_SUFFIX));
                        if !layer_path.exists() {
                            tracing::warn!("layer {} not found in layers directory", digest);
                            return Ok(false);
                        }

                        // Also check that the layer directory actually has content
                        let mut read_dir = fs::read_dir(&layer_path).await?;
                        let dir_empty = read_dir.next_entry().await?.is_none();
                        if dir_empty {
                            tracing::warn!("layer {} exists but is empty", digest);
                        }

                        tracing::info!("layer {} found in layers directory", digest);
                    }

                    // Get the layers from database to verify database records exist for all digests
                    let db_layers = db::get_layers_by_digest(pool, &layer_digests).await?;

                    if db_layers.len() < layer_digests.len() {
                        tracing::warn!(
                            "some layers for image {} exist on disk but missing in db",
                            image
                        );
                        return Ok(false);
                    }

                    tracing::info!("all layers for image {} exist and are valid", image);
                    Ok(true)
                }
                Err(e) => {
                    tracing::warn!("error checking layer digests: {}, will pull image", e);
                    Ok(false)
                }
            }
        }
        Ok(false) => {
            tracing::warn!("image {} does not exist in db, will pull image", image);
            Ok(false)
        }
        Err(e) => {
            tracing::warn!("error checking image existence: {}, will pull image", e);
            Ok(false)
        }
    }
}

/// Helper function to get full mode with file type bits
fn get_full_mode(entry_type: &tokio_tar::EntryType, permission_bits: u32) -> u32 {
    let file_type_bits = if entry_type.is_file() {
        libc::S_IFREG
    } else if entry_type.is_dir() {
        libc::S_IFDIR
    } else if entry_type.is_symlink() {
        libc::S_IFLNK
    } else if entry_type.is_block_special() {
        libc::S_IFBLK
    } else if entry_type.is_character_special() {
        libc::S_IFCHR
    } else if entry_type.is_fifo() {
        libc::S_IFIFO
    } else {
        0 // Unknown type
    };

    #[cfg(target_os = "macos")]
    let file_type_bits = file_type_bits as u32;

    file_type_bits | permission_bits
}

/// Helper function to set xattr with stat information
fn set_stat_xattr(
    path: &Path,
    xattr_name: &CStr,
    uid: u64,
    gid: u64,
    mode: u32,
) -> Result<(), MicrosandboxError> {
    use std::ffi::CString;

    let stat_data = format!("{}:{}:0{:o}", uid, gid, mode);
    let path_cstring = CString::new(path.as_os_str().as_encoded_bytes())
        .map_err(|e| MicrosandboxError::LayerExtraction(format!("Invalid path: {:?}", e)))?;

    let result = unsafe {
        #[cfg(target_os = "macos")]
        {
            libc::setxattr(
                path_cstring.as_ptr(),
                xattr_name.as_ptr(),
                stat_data.as_ptr() as *const libc::c_void,
                stat_data.len(),
                0, // position parameter for macOS
                0, // options
            )
        }
        #[cfg(target_os = "linux")]
        {
            libc::setxattr(
                path_cstring.as_ptr(),
                xattr_name.as_ptr(),
                stat_data.as_ptr() as *const libc::c_void,
                stat_data.len(),
                0, // flags
            )
        }
    };

    if result != 0 {
        let errno = std::io::Error::last_os_error();
        if errno.raw_os_error() == Some(libc::ENOTSUP) {
            tracing::warn!(
                "Filesystem does not support xattrs for {}, continuing without stat shadowing",
                path.display()
            );
        } else {
            return Err(MicrosandboxError::LayerExtraction(format!(
                "Failed to set xattr on {}: {}",
                path.display(),
                errno
            )));
        }
    }
    Ok(())
}

/// Extracts a layer from the downloaded tar.gz file into an extracted directory.
/// The extracted directory will be named as <layer-name>.extracted
/// Custom extraction function that modifies file ownership during extraction
async fn extract_tar_with_ownership_override<R>(
    archive: &mut Archive<R>,
    extract_dir: &Path,
) -> MicrosandboxResult<()>
where
    R: AsyncRead + Unpin,
{
    // Cache the xattr name to avoid repeated allocations
    let xattr_name = CString::new("user.containers.override_stat")
        .map_err(|e| MicrosandboxError::LayerExtraction(format!("Invalid attr name: {:?}", e)))?;

    // Structure to store hard link information
    struct HardLinkInfo {
        link_path: PathBuf,
        target_path: PathBuf,
        uid: u64,
        gid: u64,
        mode: u32,
    }

    // Store hard links to process after all regular files are extracted
    let mut hard_links = Vec::new();
    let mut entries = archive.entries()?;

    while let Some(entry) = entries.next().await {
        let mut entry =
            entry.map_err(|e| MicrosandboxError::LayerExtraction(format!("{:?}", e)))?;
        let path = entry
            .path()
            .map_err(|e| MicrosandboxError::LayerExtraction(format!("{:?}", e)))?
            .to_path_buf();
        let full_path = extract_dir.join(&path);

        // Get the original metadata from the tar entry
        let original_uid = entry.header().uid()?;
        let original_gid = entry.header().gid()?;
        let permission_bits = entry.header().mode()?;

        // Check the entry type
        let entry_type = entry.header().entry_type();
        let is_symlink = entry_type.is_symlink();
        let is_hard_link = entry_type.is_hard_link();

        // Calculate the full mode with file type bits
        let original_mode = get_full_mode(&entry_type, permission_bits);

        // Handle hard links separately - collect them for processing after all files are extracted
        if is_hard_link {
            if let Ok(Some(link_name)) = entry.link_name() {
                hard_links.push(HardLinkInfo {
                    link_path: full_path.clone(),
                    target_path: extract_dir.join(link_name.as_ref()),
                    uid: original_uid,
                    gid: original_gid,
                    mode: original_mode,
                });
            }
            continue; // Skip to next entry
        }

        // Extract the entry (regular files, directories, symlinks)
        entry
            .unpack(&full_path)
            .await
            .map_err(|e| MicrosandboxError::LayerExtraction(format!("{:?}", e)))?;

        // Skip all operations for symlinks
        if is_symlink {
            tracing::trace!(
                "Extracted symlink {} with original uid:gid:mode {}:{}:{:o}",
                full_path.display(),
                original_uid,
                original_gid,
                original_mode
            );
            continue;
        }

        // For regular files and directories, handle permissions and xattrs
        let metadata = std::fs::metadata(&full_path)?;
        let is_dir = metadata.is_dir();
        let current_mode = metadata.permissions().mode();
        let current_permission_bits = current_mode & 0o7777; // Extract only permission bits

        // Calculate the final desired permissions
        let desired_permission_bits = if is_dir {
            // For directories, ensure at least u+rwx (0o700)
            current_permission_bits | 0o700
        } else {
            // For files, ensure at least u+rw (0o600)
            current_permission_bits | 0o600
        };

        // If we need to modify permissions, do it once
        if current_permission_bits != desired_permission_bits {
            let mut permissions = metadata.permissions();
            permissions.set_mode(desired_permission_bits);
            std::fs::set_permissions(&full_path, permissions)?;
        }

        // Store original uid/gid/mode in xattrs
        set_stat_xattr(
            &full_path,
            &xattr_name,
            original_uid,
            original_gid,
            original_mode,
        )?;

        tracing::trace!(
            "Extracted {} with original uid:gid:mode {}:{}:{:o}, stored in xattr",
            full_path.display(),
            original_uid,
            original_gid,
            original_mode
        );
    }

    // Second pass: process hard links after all regular files are extracted
    for link_info in hard_links {
        // Create the hard link
        match std::fs::hard_link(&link_info.target_path, &link_info.link_path) {
            Ok(_) => {
                // Hard link created successfully, now handle xattrs
                // Get metadata and ensure proper permissions
                let metadata = match std::fs::metadata(&link_info.link_path) {
                    Ok(m) => m,
                    Err(e) => {
                        tracing::warn!(
                            "Failed to get metadata for hard link {}: {}",
                            link_info.link_path.display(),
                            e
                        );
                        continue;
                    }
                };

                let current_mode = metadata.permissions().mode();
                let current_permission_bits = current_mode & 0o7777; // Extract only permission bits
                let desired_permission_bits = current_permission_bits | 0o600; // Ensure at least u+rw

                // Set permissions if needed
                if current_permission_bits != desired_permission_bits {
                    let mut permissions = metadata.permissions();
                    permissions.set_mode(desired_permission_bits);
                    if let Err(e) = std::fs::set_permissions(&link_info.link_path, permissions) {
                        tracing::warn!(
                            "Failed to set permissions for hard link {}: {}",
                            link_info.link_path.display(),
                            e
                        );
                        continue;
                    }
                }

                // Store original uid/gid/mode in xattrs
                if let Err(e) = set_stat_xattr(
                    &link_info.link_path,
                    &xattr_name,
                    link_info.uid,
                    link_info.gid,
                    link_info.mode,
                ) {
                    // For hard links, we just warn on xattr errors instead of failing
                    tracing::warn!(
                        "Failed to set xattr on hard link {}: {}",
                        link_info.link_path.display(),
                        e
                    );
                }

                tracing::trace!(
                    "Created hard link {} -> {} with original uid:gid:mode {}:{}:{:o}",
                    link_info.link_path.display(),
                    link_info.target_path.display(),
                    link_info.uid,
                    link_info.gid,
                    link_info.mode
                );
            }
            Err(e) => {
                tracing::warn!(
                    "Failed to create hard link {} -> {}: {}",
                    link_info.link_path.display(),
                    link_info.target_path.display(),
                    e
                );
            }
        }
    }

    Ok(())
}

async fn extract_layer(
    layer_path: impl AsRef<Path>,
    extract_base_dir: impl AsRef<Path>,
) -> MicrosandboxResult<()> {
    let layer_path = layer_path.as_ref();
    let file_name = layer_path
        .file_name()
        .and_then(|n| n.to_str())
        .ok_or_else(|| MicrosandboxError::LayerHandling {
            source: std::io::Error::new(std::io::ErrorKind::NotFound, "invalid layer file name"),
            layer: layer_path.display().to_string(),
        })?;

    // Create the extraction directory with name <layer-name>.extracted
    let extract_dir = extract_base_dir
        .as_ref()
        .join(format!("{}.{}", file_name, EXTRACTED_LAYER_SUFFIX));

    // Check if the layer is already extracted
    if extract_dir.exists() {
        // Check if the directory has content (not empty)
        let mut read_dir =
            fs::read_dir(&extract_dir)
                .await
                .map_err(|e| MicrosandboxError::LayerHandling {
                    source: e,
                    layer: file_name.to_string(),
                })?;

        if read_dir.next_entry().await?.is_some() {
            tracing::info!(
                "layer {} already extracted at {}, skipping extraction",
                file_name,
                extract_dir.display()
            );
            return Ok(());
        }
    }

    fs::create_dir_all(&extract_dir)
        .await
        .map_err(|e| MicrosandboxError::LayerHandling {
            source: e,
            layer: file_name.to_string(),
        })?;

    tracing::info!(
        "extracting layer {} to {}",
        file_name,
        extract_dir.display()
    );

    #[cfg(feature = "cli")]
    pin_project! {
        struct ProgressReader<R> {
            #[pin]
            inner: R,
            bar: ProgressBar,
        }
    }

    #[cfg(feature = "cli")]
    impl<R: AsyncRead> AsyncRead for ProgressReader<R> {
        fn poll_read(
            self: std::pin::Pin<&mut Self>,
            cx: &mut std::task::Context<'_>,
            buf: &mut ReadBuf<'_>,
        ) -> Poll<std::io::Result<()>> {
            let p = self.project();
            match p.inner.poll_read(cx, buf)? {
                Poll::Ready(()) => {
                    let n = buf.filled().len();
                    if n > 0 {
                        p.bar.inc(n as u64);
                    }
                    Poll::Ready(Ok(()))
                }
                Poll::Pending => Poll::Pending,
            }
        }
    }

    #[cfg(feature = "cli")]
    {
        let total_bytes = fs::metadata(layer_path).await?.len();
        let pb = MULTI_PROGRESS.add(ProgressBar::new(total_bytes));
        pb.set_style(
            ProgressStyle::with_template(
                "{prefix:.bold.dim} {bar:40.green/green.dim} {bytes:.bold}/{total_bytes:.dim}",
            )
            .unwrap()
            .progress_chars("=+-"),
        );
        let digest_short = if let Some(rest) = file_name.strip_prefix("sha256:") {
            &rest[..8.min(rest.len())]
        } else {
            &file_name[..8.min(file_name.len())]
        };
        pb.set_prefix(digest_short.to_string());

        let layer_path_clone = layer_path.to_path_buf();
        let extract_dir_clone = extract_dir.clone();
        let pb_clone = pb.clone();

        use async_compression::tokio::bufread::GzipDecoder;
        use tokio::io::BufReader;
        use tokio_tar::Archive;

        let file = tokio::fs::File::open(&layer_path_clone).await?;
        let reader = ProgressReader {
            inner: file,
            bar: pb_clone.clone(),
        };

        let decoder = GzipDecoder::new(BufReader::new(reader));
        let mut archive = Archive::new(decoder);
        extract_tar_with_ownership_override(&mut archive, &extract_dir_clone)
            .await
            .map_err(|e| MicrosandboxError::LayerExtraction(format!("{:?}", e)))?;

        pb.finish_and_clear();
    }

    #[cfg(not(feature = "cli"))]
    {
        use async_compression::tokio::bufread::GzipDecoder;
        use tokio::{fs::File, io::BufReader};

        let file = File::open(layer_path)
            .await
            .map_err(|e| MicrosandboxError::LayerHandling {
                source: e,
                layer: file_name.to_string(),
            })?;
        let decoder = GzipDecoder::new(BufReader::new(file));
        let mut archive = Archive::new(decoder);
        extract_tar_with_ownership_override(&mut archive, &extract_dir).await?;
    }

    tracing::info!(
        "successfully extracted layer {} to {}",
        file_name,
        extract_dir.display()
    );
    Ok(())
}
