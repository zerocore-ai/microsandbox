//! Registry auth persistence helpers.
//!
//! Credentials are persisted in the platform secure credential store via `keyring`.
//!
//! # Examples
//! ```no_run
//! use microsandbox_utils::{CredentialStore, MsbRegistryAuth};
//!
//! CredentialStore::store_registry_credentials(
//!     "ghcr.io",
//!     MsbRegistryAuth::Token {
//!         token: "token-123".to_string(),
//!     },
//! )?;
//!
//! let creds = CredentialStore::load_registry_credentials("ghcr.io")?
//!     .expect("missing credentials");
//!
//! match creds {
//!     MsbRegistryAuth::Token { token } => {
//!         assert_eq!(token, "token-123");
//!     }
//!     _ => unreachable!("expected token credentials"),
//! }
//! # Ok::<(), microsandbox_utils::MicrosandboxUtilsError>(())
//! ```
//!
//! # Keyring Backend Availability (Tests/CI)
//! ```no_run
//! use microsandbox_utils::{CredentialStore, MsbRegistryAuth};
//!
//! let probe = MsbRegistryAuth::Token {
//!     token: "probe-token".to_string(),
//! };
//!
//! // Persist to the platform secure store.
//! CredentialStore::store_registry_credentials("ghcr.io", probe)?;
//!
//! // Some sandboxed/CI environments do not provide a fully functional keyring backend.
//! // In those cases, reads may return None even after a successful store.
//! let roundtrip_ok = matches!(
//!     CredentialStore::load_registry_credentials("ghcr.io")?,
//!     Some(MsbRegistryAuth::Token { ref token }) if token == "probe-token"
//! );
//!
//! if !roundtrip_ok {
//!     // Treat as environment limitation (skip/inconclusive), not legacy-file fallback.
//! }
//! # Ok::<(), microsandbox_utils::MicrosandboxUtilsError>(())
//! ```

use keyring::Entry;
use oci_client::secrets::RegistryAuth;
use serde::{Deserialize, Serialize};

use crate::MicrosandboxUtilsResult;

//--------------------------------------------------------------------------------------------------
// Types
//--------------------------------------------------------------------------------------------------

/// Stored credentials for a registry host.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum MsbRegistryAuth {
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

impl From<MsbRegistryAuth> for RegistryAuth {
    fn from(value: MsbRegistryAuth) -> Self {
        match value {
            MsbRegistryAuth::Basic { username, password } => {
                RegistryAuth::Basic(username, password)
            }
            MsbRegistryAuth::Token { token } => RegistryAuth::Bearer(token),
        }
    }
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
    pub fn load_registry_credentials(
        host: &str,
    ) -> MicrosandboxUtilsResult<Option<MsbRegistryAuth>> {
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
        credentials: MsbRegistryAuth,
    ) -> MicrosandboxUtilsResult<()> {
        let entry = Self::entry(host)?;
        let serialized = serde_json::to_string(&credentials)?;
        entry.set_password(&serialized)?;
        // Ensure credentials were persisted and are retrievable from secure storage.
        match entry.get_password() {
            Ok(_) => {}
            Err(err) => return Err(err.into()),
        }
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
        Ok(removed)
    }

    /// Build the platform keyring entry for a registry host.
    fn entry(host: &str) -> MicrosandboxUtilsResult<Entry> {
        Entry::new(&format!("microsandbox:{}", host), "registry-auth").map_err(Into::into)
    }
}
