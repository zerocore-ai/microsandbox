use core::fmt;
use std::{ops::Deref, str::FromStr};

use serde;

use crate::MicrosandboxError;

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

    /// Resolve the effective registry host for this image reference.
    pub fn resolve_registry(&self) -> &str {
        self.reference.resolve_registry()
    }
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
    fn resolve_registry_uses_explicit_registry_host() {
        let reference: Reference = "ghcr.io/org/app:1.0".parse().unwrap();
        assert_eq!(reference.resolve_registry(), "ghcr.io");
    }

    #[test]
    fn resolve_registry_uses_index_docker_io_when_host_missing() {
        let reference: Reference = "org/app:1.0".parse().unwrap();
        assert_eq!(reference.resolve_registry(), "index.docker.io");
    }

    #[test]
    fn resolve_registry_reflects_upstream_normalization_for_index_docker_io() {
        let reference: Reference = "index.docker.io/library/nginx:latest".parse().unwrap();
        assert_eq!(reference.resolve_registry(), "index.docker.io");
    }
}
