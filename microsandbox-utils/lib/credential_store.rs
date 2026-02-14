//! Registry auth persistence helpers.
//!
//! Credentials are persisted in the platform secure credential store via `keyring`.
//! A local metadata file is used only to track registry hosts for lifecycle operations.
//!
//! # Examples
//! ```no_run
//! use microsandbox_utils::{CredentialStore, StoredRegistryCredentials};
//!
//! CredentialStore::store_registry_credentials(
//!     "ghcr.io",
//!     StoredRegistryCredentials::Token {
//!         token: "token-123".to_string(),
//!     },
//! )?;
//!
//! let creds = CredentialStore::load_stored_registry_credentials("ghcr.io")?
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
//!
//! # Keyring Backend Availability (Tests/CI)
//! ```no_run
//! use microsandbox_utils::{CredentialStore, StoredRegistryCredentials};
//!
//! let probe = StoredRegistryCredentials::Token {
//!     token: "probe-token".to_string(),
//! };
//!
//! // Persist to the platform secure store.
//! CredentialStore::store_registry_credentials("ghcr.io", probe)?;
//!
//! // Some sandboxed/CI environments do not provide a fully functional keyring backend.
//! // In those cases, reads may return None even after a successful store.
//! let roundtrip_ok = matches!(
//!     CredentialStore::load_stored_registry_credentials("ghcr.io")?,
//!     Some(StoredRegistryCredentials::Token { ref token }) if token == "probe-token"
//! );
//!
//! if !roundtrip_ok {
//!     // Treat as environment limitation (skip/inconclusive), not legacy-file fallback.
//! }
//! # Ok::<(), microsandbox_utils::MicrosandboxUtilsError>(())
//! ```

use std::{
    collections::HashSet,
    fs,
    path::{Path, PathBuf},
};

use keyring::Entry;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::{MicrosandboxUtilsResult, env};

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
struct RegistryAuthIndex {
    hosts: HashSet<String>,
}

/// Persistence API for registry credentials.
#[derive(Debug, Clone, Copy, Default)]
pub struct CredentialStore;

//--------------------------------------------------------------------------------------------------
// Functions
//--------------------------------------------------------------------------------------------------

impl CredentialStore {
    /// Load stored registry credentials for a host, if present.
    ///
    /// Returns `Ok(None)` when no credential exists in the platform secure store.
    pub fn load_stored_registry_credentials(
        host: &str,
    ) -> MicrosandboxUtilsResult<Option<StoredRegistryCredentials>> {
        let entry = Self::entry(host)?;
        match entry.get_password() {
            Ok(raw) => Ok(Some(serde_json::from_str(&raw)?)),
            Err(keyring::Error::NoEntry) => Ok(None),
            Err(err) => Err(err.into()),
        }
    }

    /// Store registry credentials for a host (overwrites existing entry).
    ///
    /// Returns an error if the secure store backend rejects persistence or retrieval.
    pub fn store_registry_credentials(
        host: &str,
        credentials: StoredRegistryCredentials,
    ) -> MicrosandboxUtilsResult<()> {
        let entry = Self::entry(host)?;
        let serialized = serde_json::to_string(&credentials)?;
        entry.set_password(&serialized)?;
        // Ensure credentials were persisted and are retrievable from secure storage.
        match entry.get_password() {
            Ok(_) => {}
            Err(err) => return Err(err.into()),
        }
        Self::upsert_host(host)?;
        Ok(())
    }

    /// Remove stored registry credentials for a host.
    ///
    /// Returns `Ok(false)` when there is no credential entry for `host`.
    pub fn remove_registry_credentials(host: &str) -> MicrosandboxUtilsResult<bool> {
        let entry = Self::entry(host)?;
        let removed = match entry.delete_credential() {
            Ok(()) => true,
            Err(keyring::Error::NoEntry) => false,
            Err(err) => return Err(err.into()),
        };

        Self::remove_host(host)?;
        Ok(removed)
    }

    /// Remove all stored registry credentials.
    pub fn clear_registry_credentials() -> MicrosandboxUtilsResult<()> {
        let path = Self::registry_auth_index_path();
        if !path.exists() {
            return Ok(());
        }

        let data = fs::read_to_string(&path)?;
        let index: RegistryAuthIndex = serde_json::from_str(&data)?;
        for host in &index.hosts {
            let entry = Self::entry(host)?;
            match entry.delete_credential() {
                Ok(()) | Err(keyring::Error::NoEntry) => {}
                Err(err) => return Err(err.into()),
            }
        }

        fs::remove_file(path)?;
        Ok(())
    }

    /// Persist a registry host in the local index used for lifecycle operations.
    fn upsert_host(host: &str) -> MicrosandboxUtilsResult<()> {
        let path = Self::registry_auth_index_path();
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent)?;
        }

        let mut auth_file = if path.exists() {
            let data = fs::read_to_string(&path)?;
            serde_json::from_str::<RegistryAuthIndex>(&data)?
        } else {
            RegistryAuthIndex::default()
        };

        auth_file.hosts.insert(host.to_string());
        let json = serde_json::to_string_pretty(&auth_file)?;
        fs::write(&path, json)?;
        Self::set_permissions_restrictive(&path)?;
        Ok(())
    }

    /// Remove a registry host from the local lifecycle index.
    fn remove_host(host: &str) -> MicrosandboxUtilsResult<()> {
        let path = Self::registry_auth_index_path();
        if !path.exists() {
            return Ok(());
        }

        let data = fs::read_to_string(&path)?;
        let mut auth_file: RegistryAuthIndex = serde_json::from_str(&data)?;
        auth_file.hosts.remove(host);

        if auth_file.hosts.is_empty() {
            fs::remove_file(path)?;
        } else {
            let json = serde_json::to_string_pretty(&auth_file)?;
            fs::write(&path, json)?;
            Self::set_permissions_restrictive(&path)?;
        }

        Ok(())
    }

    /// Build the platform keyring entry for a registry host.
    fn entry(host: &str) -> MicrosandboxUtilsResult<Entry> {
        let service = Self::service_name();
        Entry::new(&service, &format!("registry-{}", host)).map_err(Into::into)
    }

    /// Return the path to the registry host index file.
    fn registry_auth_index_path() -> PathBuf {
        env::get_microsandbox_home_path().join("registry_auth_index.json")
    }

    /// Apply owner-only permissions to files holding local metadata.
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

    /// Compute a deterministic keyring service name scoped to `MICROSANDBOX_HOME`.
    fn service_name() -> String {
        // Namespace the secure store by microsandbox home while keeping service keys short.
        let home = env::get_microsandbox_home_path();
        let digest = Sha256::digest(home.to_string_lossy().as_bytes());
        format!("microsandbox:{:x}", digest)
    }
}
