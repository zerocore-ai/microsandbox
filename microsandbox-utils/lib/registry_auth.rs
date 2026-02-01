//! Registry auth persistence helpers.
//!
//! # Examples
//! ```no_run
//! use microsandbox_utils::{store_registry_credentials, load_stored_registry_credentials, StoredRegistryCredentials};
//!
//! store_registry_credentials(
//!     "ghcr.io",
//!     StoredRegistryCredentials::Token {
//!         token: "token-123".to_string(),
//!     },
//! )?;
//!
//! let creds = load_stored_registry_credentials("ghcr.io")?
//!     .expect("missing credentials");
//!
//! match creds {
//!     StoredRegistryCredentials::Token { token } => {
//!         assert_eq!(token, "token-123");
//!     }
//!     _ => unreachable!("expected token credentials"),
//! }
//! # Ok::<(), microsandbox_utils::MicrosandboxUtilsError>(())
//! ```

use std::{
    collections::HashMap,
    fs,
    path::{Path, PathBuf},
};

use serde::{Deserialize, Serialize};

use crate::{env, MicrosandboxUtilsResult};

//--------------------------------------------------------------------------------------------------
// Types
//--------------------------------------------------------------------------------------------------

/// Stored credentials for a registry host.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum StoredRegistryCredentials {
    /// Basic auth using username + password.
    #[serde(rename = "basic")]
    Basic {
        /// Registry username.
        username: String,
        /// Registry password.
        password: String,
    },
    /// Bearer token.
    #[serde(rename = "token")]
    Token {
        /// Registry token.
        token: String,
    },
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
struct RegistryAuthFile {
    auths: HashMap<String, StoredRegistryCredentials>,
}

//--------------------------------------------------------------------------------------------------
// Functions
//--------------------------------------------------------------------------------------------------

/// Load stored registry credentials for a host, if present.
pub fn load_stored_registry_credentials(
    host: &str,
) -> MicrosandboxUtilsResult<Option<StoredRegistryCredentials>> {
    let path = registry_auth_path();
    if !path.exists() {
        return Ok(None);
    }

    let data = fs::read_to_string(&path)?;
    let auth_file: RegistryAuthFile = serde_json::from_str(&data)?;
    Ok(auth_file.auths.get(host).cloned())
}

/// Store registry credentials for a host (overwrites existing entry).
pub fn store_registry_credentials(
    host: &str,
    credentials: StoredRegistryCredentials,
) -> MicrosandboxUtilsResult<()> {
    let path = registry_auth_path();
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)?;
    }

    let mut auth_file = if path.exists() {
        let data = fs::read_to_string(&path)?;
        serde_json::from_str::<RegistryAuthFile>(&data)?
    } else {
        RegistryAuthFile::default()
    };

    auth_file.auths.insert(host.to_string(), credentials);
    let json = serde_json::to_string_pretty(&auth_file)?;
    fs::write(&path, json)?;

    set_permissions_restrictive(&path)?;
    Ok(())
}

/// Remove stored registry credentials for a host.
pub fn remove_registry_credentials(host: &str) -> MicrosandboxUtilsResult<bool> {
    let path = registry_auth_path();
    if !path.exists() {
        return Ok(false);
    }

    let data = fs::read_to_string(&path)?;
    let mut auth_file: RegistryAuthFile = serde_json::from_str(&data)?;
    let removed = auth_file.auths.remove(host).is_some();

    let json = serde_json::to_string_pretty(&auth_file)?;
    fs::write(&path, json)?;
    set_permissions_restrictive(&path)?;

    Ok(removed)
}

/// Remove all stored registry credentials.
pub fn clear_registry_credentials() -> MicrosandboxUtilsResult<()> {
    let path = registry_auth_path();
    if path.exists() {
        fs::remove_file(path)?;
    }
    Ok(())
}

fn registry_auth_path() -> PathBuf {
    env::get_microsandbox_home_path().join("registry_auth.json")
}

fn set_permissions_restrictive(path: &Path) -> MicrosandboxUtilsResult<()> {
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let metadata = fs::metadata(path)?;
        let mut perms = metadata.permissions();
        perms.set_mode(0o600);
        fs::set_permissions(path, perms)?;
    }
    Ok(())
}
