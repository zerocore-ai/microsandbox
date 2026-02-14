use core::fmt;
use std::{ops::Deref, str::FromStr};

use serde;
use url::Url;

use crate::{MicrosandboxError, MicrosandboxResult};

//--------------------------------------------------------------------------------------------------
// Types
//--------------------------------------------------------------------------------------------------

/// Represents an OCI-compliant image reference.
#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
#[serde(try_from = "String")]
#[serde(into = "String")]
pub struct Reference {
    reference: oci_client::Reference,
}

impl Reference {
    /// Create an [`oci_client::Reference`] from [`Reference`].
    pub fn as_oci_reference(&self) -> oci_client::Reference {
        self.reference.clone()
    }

    pub(crate) fn as_db_key(&self) -> String {
        self.reference.to_string()
    }

    /// Resolve the registry URL for this image reference.
    ///
    /// This uses the parsed/normalized reference representation and returns an
    /// `https://` URL for the registry host.
    ///
    /// `index.docker.io` is preserved as-is (not rewritten to `docker.io`) so
    /// callers can verify possible `301` redirect behavior explicitly.
    pub fn registry(&self) -> MicrosandboxResult<Url> {
        let raw = self.to_string();
        let host = raw
            .split('/')
            .next()
            .ok_or_else(|| MicrosandboxError::InvalidArgument("invalid image reference".to_string()))?;

        let host = normalize_registry_host(host);
        Url::parse(&format!("https://{}", host))
            .map_err(|err| MicrosandboxError::InvalidArgument(err.to_string()))
    }
}

/// Normalize a registry host for consistent lookups.
///
/// This ensures we store and resolve credentials under the same key.
pub fn normalize_registry_host(host: &str) -> String {
    let mut normalized = host.trim().to_lowercase();

    if let Some(stripped) = normalized.strip_prefix("https://") {
        normalized = stripped.to_string();
    } else if let Some(stripped) = normalized.strip_prefix("http://") {
        normalized = stripped.to_string();
    }

    normalized = normalized.trim_end_matches('/').to_string();

    normalized
}

impl Deref for Reference {
    type Target = oci_client::Reference;

    fn deref(&self) -> &Self::Target {
        &self.reference
    }
}

impl FromStr for Reference {
    type Err = MicrosandboxError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(Reference {
            reference: oci_client::Reference::from_str(s)?,
        })
    }
}

impl From<Reference> for String {
    fn from(reference: Reference) -> Self {
        reference.reference.to_string()
    }
}

impl TryFrom<String> for Reference {
    type Error = MicrosandboxError;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        Ok(Reference {
            reference: oci_client::Reference::try_from(value)?,
        })
    }
}

impl fmt::Display for Reference {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.reference)
    }
}

//--------------------------------------------------------------------------------------------------
// Tests
//--------------------------------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn registry_uses_explicit_registry_host() {
        let reference: Reference = "ghcr.io/org/app:1.0".parse().unwrap();
        let url = reference.registry().unwrap();
        assert_eq!(url.host_str(), Some("ghcr.io"));
    }

    #[test]
    fn registry_uses_normalized_default_registry_when_host_missing() {
        let reference: Reference = "org/app:1.0".parse().unwrap();
        let url = reference.registry().unwrap();
        assert_eq!(url.host_str(), Some("docker.io"));
    }

    #[test]
    fn registry_reflects_upstream_normalization_for_index_docker_io() {
        let reference: Reference = "index.docker.io/library/nginx:latest".parse().unwrap();
        let url = reference.registry().unwrap();
        assert_eq!(url.host_str(), Some("docker.io"));
    }
}
