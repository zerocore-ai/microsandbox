use std::{str::FromStr, sync::Arc};

use bytes::Bytes;
use futures::{
    StreamExt,
    future::{self, try_join_all},
    stream::BoxStream,
};
use oci_client::{
    Client as OciClient,
    client::{BlobResponse, ClientConfig as OciClientConfig, Config as OciConfig, LayerDescriptor},
    config::ConfigFile as OciConfigFile,
    manifest::{ImageIndexEntry, OciImageManifest, OciManifest},
    secrets::RegistryAuth,
};
use oci_spec::image::{Digest, Platform};
use sqlx::{Pool, Sqlite};
use tokio::{
    fs::{self, OpenOptions},
    io::AsyncWriteExt,
};

use microsandbox_utils::{CredentialStore, StoredRegistryCredentials, env};

use crate::{
    MicrosandboxError, MicrosandboxResult,
    management::db,
    oci::{Reference, global_cache::GlobalCacheOps, image::Image, layer::LayerOps},
    utils,
};

#[cfg(feature = "cli")]
use indicatif::{ProgressBar, ProgressStyle};
#[cfg(feature = "cli")]
use microsandbox_utils::term::{self, MULTI_PROGRESS};

//--------------------------------------------------------------------------------------------------
// Constants
//--------------------------------------------------------------------------------------------------

#[cfg(feature = "cli")]
/// Spinner message used for fetching image details.
const FETCH_IMAGE_DETAILS_MSG: &str = "Fetch image details";

#[cfg(feature = "cli")]
/// Spinner message used for downloading layers.
const DOWNLOAD_LAYER_MSG: &str = "Download layers";

pub(crate) const DOCKER_REFERENCE_TYPE_ANNOTATION: &str = "vnd.docker.reference.type";

enum ParsedCredentials {
    Present(StoredRegistryCredentials),
    Missing,
    Incomplete,
}

fn parse_credential_inputs(
    input_username: Option<String>,
    input_password: Option<String>,
    input_token: Option<String>,
) -> MicrosandboxResult<ParsedCredentials> {
    if input_token.is_some() && (input_username.is_some() || input_password.is_some()) {
        return Err(MicrosandboxError::InvalidArgument(
            "token cannot be combined with username/password".to_string(),
        ));
    }

    if let Some(token) = input_token {
        return Ok(ParsedCredentials::Present(
            StoredRegistryCredentials::Token { token },
        ));
    }

    match (input_username, input_password) {
        (Some(username), Some(password)) => Ok(ParsedCredentials::Present(
            StoredRegistryCredentials::Basic { username, password },
        )),
        (None, None) => Ok(ParsedCredentials::Missing),
        _ => Ok(ParsedCredentials::Incomplete),
    }
}

/// Resolve explicit registry credentials from user-provided inputs only.
///
/// This function does not read environment variables nor stored credentials.
pub fn resolve_explicit_credentials(
    username: Option<String>,
    password: Option<String>,
    token: Option<String>,
) -> MicrosandboxResult<StoredRegistryCredentials> {
    match parse_credential_inputs(username, password, token)? {
        ParsedCredentials::Present(credentials) => Ok(credentials),
        ParsedCredentials::Missing => Err(MicrosandboxError::InvalidArgument(
            "no credentials provided; explicitly pass --token or --username with --password-stdin"
                .to_string(),
        )),
        ParsedCredentials::Incomplete => Err(MicrosandboxError::InvalidArgument(
            "both username and password are required".to_string(),
        )),
    }
}

/// Resolve registry auth for a given reference.
///
/// Priority:
/// 1) Environment variables
/// 2) Stored credentials (msb login)
/// 3) Anonymous
pub fn resolve_auth(reference: &Reference) -> MicrosandboxResult<RegistryAuth> {
    let registry = reference
        .registry()?
        .host_str()
        .ok_or_else(|| {
            MicrosandboxError::InvalidArgument("reference missing registry host".to_string())
        })?
        .to_string();

    match parse_credential_inputs(
        env::get_registry_username(),
        env::get_registry_password(),
        env::get_registry_token(),
    )? {
        ParsedCredentials::Present(credentials) => {
            return Ok(stored_to_registry_auth(credentials));
        }
        ParsedCredentials::Incomplete => {
            tracing::warn!(
                "registry credentials provided via env are incomplete; falling back to stored or anonymous"
            );
        }
        ParsedCredentials::Missing => {}
    }

    if let Some(stored) = CredentialStore::load_stored_registry_credentials(&registry)? {
        return Ok(stored_to_registry_auth(stored));
    }

    Ok(RegistryAuth::Anonymous)
}

fn stored_to_registry_auth(stored: StoredRegistryCredentials) -> RegistryAuth {
    match stored {
        StoredRegistryCredentials::Basic { username, password } => {
            RegistryAuth::Basic(username, password)
        }
        StoredRegistryCredentials::Token { token } => RegistryAuth::Bearer(token),
    }
}

/// Registry is an abstraction over the logic for fetching images from a registry,
/// and storing them in a local cache.
///
/// For fetching image, it uses `oci_client` crate which implements the [OCI Distribution Spec].
///
/// [OCI Distribution Spec]: https://distribution.github.io/distribution/spec/manifest-v2-2/#image-manifest-version-2-schema-2
pub struct Registry<C: GlobalCacheOps> {
    client: OciClient,

    /// TODO (333): Support varying auth methods.
    auth: RegistryAuth,

    /// The database where image configurations, and manifests are stored.
    db: Pool<Sqlite>,

    /// Abstraction for interacting with the global microsandbox cache.
    global_cache: C,
}

impl<O> Registry<O>
where
    O: GlobalCacheOps + Send + Sync,
{
    /// Creates a new Docker Registry client with the specified image download path and OCI database path.
    ///
    /// ## Arguments
    ///
    /// * `db` - The database where image configurations, and manifests are stored
    /// * `platform` - The platform for which the image is being downloaded
    /// * `global_cache` - The global layer cache
    pub async fn new(
        db: Pool<Sqlite>,
        platform: Platform,
        global_cache: O,
        auth: RegistryAuth,
    ) -> MicrosandboxResult<Self> {
        let config = OciClientConfig {
            platform_resolver: Some(Box::new(move |manifests| {
                Self::resolve_digest_for_platform(platform.clone(), manifests)
            })),
            ..Default::default()
        };

        Ok(Self {
            client: OciClient::new(config),
            auth,
            db,
            global_cache,
        })
    }

    /// Returns the global layer cache.
    pub fn global_cache(&self) -> &O {
        &self.global_cache
    }

    /// Downloads a blob from the registry, supports download resumption if the file already partially exists.
    ///
    /// ## Arguments
    ///
    /// * `reference` - The reference to the repository and tag
    /// * `digest` - The digest of the layer to download
    /// * `expected_size` - The expected size of the layer to download
    ///
    /// # Returns
    ///
    /// Returns the layer abstraction over a fully downloaded layer.
    pub async fn download_image_blob(
        &self,
        reference: &Reference,
        digest: &Digest,
        expected_size: u64,
    ) -> MicrosandboxResult<Arc<dyn LayerOps>> {
        #[cfg(feature = "cli")]
        let progress_bar = {
            let pb = MULTI_PROGRESS.add(ProgressBar::new(expected_size));
            let style = ProgressStyle::with_template(
                "{prefix:.bold.dim} {bar:40.green/green.dim} {bytes:.bold} / {total_bytes:.dim}",
            )
            .unwrap()
            .progress_chars("=+-");

            pb.set_style(style);
            // first 8 chars of sha part
            let digest_short = digest.digest().get(..8).unwrap_or("");
            pb.set_prefix(digest_short.to_string());
            pb.clone()
        };

        let layer = self.global_cache.build_layer(digest).await;
        #[cfg(feature = "cli")]
        {
            // If we already have some bytes downloaded, reflect that on the progress bar.
            let downloaded_so_far = layer.get_tar_size().unwrap_or(0);
            progress_bar.set_position(downloaded_so_far);
        }

        // Ensure the destination directory exists
        let download_path = layer.tar_path();
        if let Some(parent) = download_path.parent() {
            fs::create_dir_all(parent).await?;
        }

        let (mut file, mut existing_size) = (OpenOptions::new(), 0);
        match layer.get_tar_size() {
            // If the layer was completely downloaded, skip re-download
            Some(size) if size == expected_size => {
                tracing::info!(?digest, "Layer already exists. Skipping download");
                return Ok(layer);
            }

            // Open the file for writing, create if it doesn't exist
            None | Some(0) => {
                tracing::info!(?digest, ?download_path, "Layer doesn't exist. Downloading");
                file.create(true).truncate(true).write(true)
            }

            Some(current_size) => {
                tracing::info!(
                    ?digest,
                    current_size,
                    expected_size,
                    ?download_path,
                    "Layer exists but is incomplete. Resuming download"
                );
                existing_size = current_size;
                file.append(true)
            }
        };

        let mut file = file.open(&download_path).await?;
        let mut stream = self
            .fetch_digest_blob(reference, digest, existing_size, None)
            .await?;

        // Write the stream to the file
        while let Some(chunk) = stream.next().await {
            let bytes = chunk?;
            file.write_all(&bytes).await?;
            #[cfg(feature = "cli")]
            progress_bar.inc(bytes.len() as u64);
        }

        #[cfg(feature = "cli")]
        progress_bar.finish_and_clear();

        // Verify the hash of the downloaded file
        let algorithm = digest.algorithm();
        let expected_hash = digest.digest();
        let actual_hash = hex::encode(utils::get_file_hash(&download_path, algorithm).await?);

        // Delete the already downloaded file if the hash does not match
        if actual_hash != expected_hash {
            fs::remove_file(&download_path).await?;
            return Err(MicrosandboxError::ImageLayerDownloadFailed(format!(
                "({reference}:{digest}) file hash {actual_hash} does not match expected hash {expected_hash}",
            )));
        }

        let layer = self
            .global_cache
            .get_downloaded_layer(digest)
            .await
            .expect("layer should be present in cache after download");

        tracing::info!(?digest, "layer downloaded and cached successfully");
        Ok(layer)
    }

    /// Filters through all image index manifests and returns the digest of the
    /// manifest that matches the platform specified.
    ///
    /// ## Arguments
    ///
    /// * `platform` - The platform for which the image is being downloaded
    /// * `manifests` - The list of manifests for the image index
    fn resolve_digest_for_platform(
        platform: Platform,
        manifests: &[ImageIndexEntry],
    ) -> Option<String> {
        manifests
            .iter()
            // First priority: match both OS and architecture
            .find(|m| {
                m.platform.as_ref().is_some_and(|p| {
                    p.os == *platform.os()    &&
                    p.architecture == *platform.architecture() &&
                    // Skip attestation manifests
                    !m.annotations.as_ref().is_some_and(|a| a.contains_key(DOCKER_REFERENCE_TYPE_ANNOTATION))
                })
            })
            // Second priority: match architecture only, if no Linux match found
            .or_else(|| {
                manifests.iter().find(|m| {
                    m.platform.as_ref().is_some_and(|p| {
                        p.architecture == *platform.architecture() &&
                        !m.annotations.as_ref().is_some_and(|a| a.contains_key(DOCKER_REFERENCE_TYPE_ANNOTATION))
                    })
                })
            })
            .map(|m| m.digest.clone())
    }

    /// Pulls an OCI image from the specified repository, and This includes downloading
    /// the image manifest, fetching the image configuration, and downloading the image layers.
    ///
    /// The image can be selected either by tag or digest using the [`ReferenceSelector`] enum.
    pub(crate) async fn pull_image(&self, reference: &Reference) -> MicrosandboxResult<()> {
        // Check if all layers are extracted before proceeding to fetch and extract
        if self.global_cache().all_layers_extracted(reference).await? {
            tracing::info!(?reference, "Image was already extracted");
            return Ok(());
        }

        // Calculate total size and save image record
        #[cfg(feature = "cli")]
        let fetch_details_sp =
            term::create_spinner(FETCH_IMAGE_DETAILS_MSG.to_string(), None, None);

        let index = self.fetch_index(reference).await?;
        let size = match index {
            OciManifest::Image(m) => m.config.size,
            OciManifest::ImageIndex(m) => m.manifests.iter().map(|m| m.size).sum(),
        };
        let image_id = db::save_or_update_image(&self.db, &reference.as_db_key(), size).await?;

        // Fetch and save manifest
        let (manifest, config) = self.fetch_manifest_and_config(reference).await?;
        let manifest_id = db::save_manifest(&self.db, image_id, &manifest).await?;
        db::save_config(&self.db, manifest_id, &config).await?;

        // First, write the layer info to disk. This guarantees that we
        let diffs = config.rootfs.diff_ids.iter();
        let layer_to_zip = manifest.layers.iter().zip(diffs);
        let db_ops = layer_to_zip
            .clone()
            .map(|(layer, diff_id)| {
                db::create_or_update_manifest_layer(&self.db, layer, diff_id, manifest_id)
            })
            .collect::<Vec<_>>();
        try_join_all(db_ops).await?;

        #[cfg(feature = "cli")]
        fetch_details_sp.finish();

        #[cfg(feature = "cli")]
        let download_layers_sp = term::create_spinner(
            DOWNLOAD_LAYER_MSG.to_string(),
            None,
            Some(manifest.layers.len() as u64),
        );

        // Download layers concurrently and save to database
        let layer_futures: Vec<_> = layer_to_zip
            .into_iter()
            .map(|(layer, _diff_id)| async {
                #[cfg(feature = "cli")]
                download_layers_sp.inc(1);
                let digest = Digest::from_str(&layer.digest)?;
                let blob = self
                    .download_image_blob(reference, &digest, layer.size as u64)
                    .await?;

                Ok::<_, MicrosandboxError>(blob)
            })
            .collect();

        // Wait for all layers to be downloaded
        let layers = future::join_all(layer_futures)
            .await
            .into_iter()
            .collect::<Result<Vec<_>, _>>()?;

        #[cfg(feature = "cli")]
        download_layers_sp.finish();

        Image::new(layers).extract_all().await
    }

    /// Fetches all available multi-platform manifests for the given reference.
    ///
    /// ## Argumebts
    ///
    /// * `reference` - The reference to the repository and tag
    ///
    /// ## Returns
    /// If the image reference has multi-platform support, [`OciManifest::ImageIndex`] is
    /// returned, otherwise, [`OciManifest::Image`].
    pub(crate) async fn fetch_index(
        &self,
        reference: &Reference,
    ) -> MicrosandboxResult<OciManifest> {
        let (index, _) = self.client.pull_manifest(reference, &self.auth).await?;
        Ok(index)
    }

    /// Fetches an single image manifest and config by its digest.
    ///
    /// ## Argumebts
    ///
    /// * `reference` - The reference to the repository and tag
    pub(crate) async fn fetch_manifest_and_config(
        &self,
        reference: &Reference,
    ) -> MicrosandboxResult<(OciImageManifest, OciConfigFile)> {
        let (manifest, _, config) = self
            .client
            .pull_manifest_and_config(reference, &self.auth)
            .await?;

        let config = OciConfig::oci_v1(config.as_bytes().to_vec(), manifest.annotations.clone());
        let config = OciConfigFile::try_from(config)?;
        Ok((manifest, config))
    }

    /// Fetches a image blob from the registry by its digest.
    ///
    /// ## Argumebts
    ///
    /// * `reference` - The reference to the repository and tag
    /// * `digest` - The digest of the layer to download
    /// * `offset` - The position in the entire blob to resume from.
    ///   If `0` is provided, reading would commence from first byte in the blob.
    /// * `length` - The number of bytes to fetch from the `offset`.
    ///   If `None`, it'd be read to the end.
    ///
    /// ## Returns
    /// Returns a stream of the blob for efficient processing.
    pub(crate) async fn fetch_digest_blob(
        &self,
        reference: &Reference,
        digest: &Digest,
        offset: u64,
        length: Option<u64>,
    ) -> MicrosandboxResult<BoxStream<'static, MicrosandboxResult<Bytes>>> {
        tracing::info!(
            "fetching blob: {digest} {offset}-{}",
            length.map(|l| l.to_string()).unwrap_or("end".to_string())
        );

        let layer = LayerDescriptor {
            digest: digest.as_ref(),
            urls: &None,
        };

        let stream = self
            .client
            .pull_blob_stream_partial(reference, &layer, offset, length)
            .await?;

        let stream = match stream {
            BlobResponse::Full(s) => s,
            BlobResponse::Partial(s) => s,
        };

        Ok(stream.stream.map(|r| r.map_err(Into::into)).boxed())
    }
}

//--------------------------------------------------------------------------------------------------
// Tests
//--------------------------------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;
    use crate::oci::normalize_registry_host;
    use std::sync::Mutex;

    use microsandbox_utils::{CredentialStore, StoredRegistryCredentials};
    use tempfile::TempDir;

    static ENV_LOCK: Mutex<()> = Mutex::new(());

    fn lock_env() -> std::sync::MutexGuard<'static, ()> {
        ENV_LOCK.lock().unwrap_or_else(|err| err.into_inner())
    }

    fn keyring_roundtrip_available() -> bool {
        let probe = StoredRegistryCredentials::Token {
            token: "probe-token".to_string(),
        };
        if CredentialStore::store_registry_credentials("ghcr.io", probe.clone()).is_err() {
            return false;
        }
        match CredentialStore::load_stored_registry_credentials("ghcr.io") {
            Ok(Some(StoredRegistryCredentials::Token { token })) => token == "probe-token",
            _ => false,
        }
    }

    struct EnvGuard {
        key: &'static str,
        prev: Option<std::ffi::OsString>,
    }

    impl EnvGuard {
        fn set(key: &'static str, value: impl Into<std::ffi::OsString>) -> Self {
            let prev = std::env::var_os(key);
            let value: std::ffi::OsString = value.into();
            unsafe { std::env::set_var(key, &value) };
            Self { key, prev }
        }

        fn remove(key: &'static str) -> Self {
            let prev = std::env::var_os(key);
            unsafe { std::env::remove_var(key) };
            Self { key, prev }
        }
    }

    impl Drop for EnvGuard {
        fn drop(&mut self) {
            if let Some(value) = self.prev.take() {
                unsafe { std::env::set_var(self.key, value) };
            } else {
                unsafe { std::env::remove_var(self.key) };
            }
        }
    }

    #[test]
    fn normalize_registry_host_preserves_index_docker_io() {
        assert_eq!(
            normalize_registry_host("index.docker.io"),
            "index.docker.io"
        );
    }

    #[test]
    fn normalize_registry_host_strips_scheme_and_slash() {
        assert_eq!(normalize_registry_host("https://Docker.IO/"), "docker.io");
    }

    #[test]
    fn resolve_explicit_credentials_prefers_token() {
        let auth = resolve_explicit_credentials(None, None, Some("token-123".to_string())).unwrap();
        assert!(matches!(
            auth,
            StoredRegistryCredentials::Token { token } if token == "token-123"
        ));
    }

    #[test]
    fn resolve_explicit_credentials_accepts_basic() {
        let auth =
            resolve_explicit_credentials(Some("user".to_string()), Some("pass".to_string()), None)
                .unwrap();
        assert!(matches!(
            auth,
            StoredRegistryCredentials::Basic { username, password }
                if username == "user" && password == "pass"
        ));
    }

    #[test]
    fn resolve_auth_prefers_env_token() {
        let _lock = lock_env();
        let _token = EnvGuard::set(env::MSB_REGISTRY_TOKEN_ENV_VAR, "env-token");
        let _user = EnvGuard::remove(env::MSB_REGISTRY_USERNAME_ENV_VAR);
        let _pass = EnvGuard::remove(env::MSB_REGISTRY_PASSWORD_ENV_VAR);

        let msb_home = TempDir::new().expect("temp msb home");
        let _msb_home = EnvGuard::set(env::MICROSANDBOX_HOME_ENV_VAR, msb_home.path());
        CredentialStore::clear_registry_credentials().expect("clear");
        CredentialStore::store_registry_credentials(
            "ghcr.io",
            StoredRegistryCredentials::Token {
                token: "stored-token".to_string(),
            },
        )
        .expect("store");

        let reference: Reference = "ghcr.io/org/app:1.0".parse().unwrap();
        let auth = resolve_auth(&reference).expect("resolve auth");
        assert!(matches!(auth, RegistryAuth::Bearer(t) if t == "env-token"));
    }

    #[test]
    fn resolve_auth_prefers_env_basic() {
        let _lock = lock_env();
        let _token = EnvGuard::remove(env::MSB_REGISTRY_TOKEN_ENV_VAR);
        let _user = EnvGuard::set(env::MSB_REGISTRY_USERNAME_ENV_VAR, "env-user");
        let _pass = EnvGuard::set(env::MSB_REGISTRY_PASSWORD_ENV_VAR, "env-pass");

        let msb_home = TempDir::new().expect("temp msb home");
        let _msb_home = EnvGuard::set(env::MICROSANDBOX_HOME_ENV_VAR, msb_home.path());
        CredentialStore::clear_registry_credentials().expect("clear");
        CredentialStore::store_registry_credentials(
            "ghcr.io",
            StoredRegistryCredentials::Token {
                token: "stored-token".to_string(),
            },
        )
        .expect("store");

        let reference: Reference = "ghcr.io/org/app:1.0".parse().unwrap();
        let auth = resolve_auth(&reference).expect("resolve auth");
        assert!(matches!(auth, RegistryAuth::Basic(u, p) if u == "env-user" && p == "env-pass"));
    }

    #[test]
    fn resolve_auth_uses_stored_credentials_when_env_missing() {
        let _lock = lock_env();
        let _token = EnvGuard::remove(env::MSB_REGISTRY_TOKEN_ENV_VAR);
        let _user = EnvGuard::remove(env::MSB_REGISTRY_USERNAME_ENV_VAR);
        let _pass = EnvGuard::remove(env::MSB_REGISTRY_PASSWORD_ENV_VAR);

        let msb_home = TempDir::new().expect("temp msb home");
        let _msb_home = EnvGuard::set(env::MICROSANDBOX_HOME_ENV_VAR, msb_home.path());
        CredentialStore::clear_registry_credentials().expect("clear");
        if !keyring_roundtrip_available() {
            eprintln!("skipping: keyring backend does not support roundtrip in this environment");
            return;
        }
        CredentialStore::store_registry_credentials(
            "ghcr.io",
            StoredRegistryCredentials::Token {
                token: "stored-token".to_string(),
            },
        )
        .expect("store");

        let reference: Reference = "ghcr.io/org/app:1.0".parse().unwrap();
        let auth = resolve_auth(&reference).expect("resolve auth");
        assert!(matches!(auth, RegistryAuth::Bearer(t) if t == "stored-token"));
    }

    #[test]
    fn resolve_auth_falls_back_to_stored_when_env_is_incomplete() {
        let _lock = lock_env();
        let _token = EnvGuard::remove(env::MSB_REGISTRY_TOKEN_ENV_VAR);
        let _user = EnvGuard::set(env::MSB_REGISTRY_USERNAME_ENV_VAR, "env-user");
        let _pass = EnvGuard::remove(env::MSB_REGISTRY_PASSWORD_ENV_VAR);

        let msb_home = TempDir::new().expect("temp msb home");
        let _msb_home = EnvGuard::set(env::MICROSANDBOX_HOME_ENV_VAR, msb_home.path());
        CredentialStore::clear_registry_credentials().expect("clear");
        if !keyring_roundtrip_available() {
            eprintln!("skipping: keyring backend does not support roundtrip in this environment");
            return;
        }
        CredentialStore::store_registry_credentials(
            "ghcr.io",
            StoredRegistryCredentials::Token {
                token: "stored-token".to_string(),
            },
        )
        .expect("store");

        let reference: Reference = "ghcr.io/org/app:1.0".parse().unwrap();
        let auth = resolve_auth(&reference).expect("resolve auth");
        assert!(matches!(auth, RegistryAuth::Bearer(t) if t == "stored-token"));
    }

    #[test]
    fn resolve_auth_returns_anonymous_when_missing() {
        let _lock = lock_env();
        let _token = EnvGuard::remove(env::MSB_REGISTRY_TOKEN_ENV_VAR);
        let _user = EnvGuard::remove(env::MSB_REGISTRY_USERNAME_ENV_VAR);
        let _pass = EnvGuard::remove(env::MSB_REGISTRY_PASSWORD_ENV_VAR);

        let msb_home = TempDir::new().expect("temp msb home");
        let _msb_home = EnvGuard::set(env::MICROSANDBOX_HOME_ENV_VAR, msb_home.path());
        CredentialStore::clear_registry_credentials().expect("clear");

        let reference: Reference = "ghcr.io/org/app:1.0".parse().unwrap();
        let auth = resolve_auth(&reference).expect("resolve auth");
        assert!(matches!(auth, RegistryAuth::Anonymous));
    }

    #[test]
    fn resolve_auth_errors_on_token_and_basic() {
        let _lock = lock_env();
        let _token = EnvGuard::set(env::MSB_REGISTRY_TOKEN_ENV_VAR, "env-token");
        let _user = EnvGuard::set(env::MSB_REGISTRY_USERNAME_ENV_VAR, "env-user");
        let _pass = EnvGuard::set(env::MSB_REGISTRY_PASSWORD_ENV_VAR, "env-pass");

        let msb_home = TempDir::new().expect("temp msb home");
        let _msb_home = EnvGuard::set(env::MICROSANDBOX_HOME_ENV_VAR, msb_home.path());
        CredentialStore::clear_registry_credentials().expect("clear");

        let reference: Reference = "ghcr.io/org/app:1.0".parse().unwrap();
        let err = resolve_auth(&reference).expect_err("expected error");
        assert!(matches!(err, crate::MicrosandboxError::InvalidArgument(_)));
    }
}
