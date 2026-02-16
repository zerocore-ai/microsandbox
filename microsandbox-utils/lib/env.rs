//! Utility functions for working with environment variables.

use std::path::PathBuf;

use crate::{DEFAULT_MICROSANDBOX_HOME, DEFAULT_OCI_REGISTRY};

//--------------------------------------------------------------------------------------------------
// Constants
//--------------------------------------------------------------------------------------------------

/// Environment variable for the microsandbox home directory
pub const MICROSANDBOX_HOME_ENV_VAR: &str = "MICROSANDBOX_HOME";

/// Environment variable for registry host (CLI fallback)
pub const MSB_REGISTRY_HOST_ENV_VAR: &str = "MSB_REGISTRY_HOST";

/// Environment variable for registry username
pub const MSB_REGISTRY_USERNAME_ENV_VAR: &str = "MSB_REGISTRY_USERNAME";

/// Environment variable for registry password
pub const MSB_REGISTRY_PASSWORD_ENV_VAR: &str = "MSB_REGISTRY_PASSWORD";

/// Environment variable for registry token
pub const MSB_REGISTRY_TOKEN_ENV_VAR: &str = "MSB_REGISTRY_TOKEN";

/// Environment variable for the msbrun binary path
pub const MSBRUN_EXE_ENV_VAR: &str = "MSBRUN_EXE";

/// Environment variable for the msbserver binary path
pub const MSBSERVER_EXE_ENV_VAR: &str = "MSBSERVER_EXE";

/// Environment variable for the minimum port in the sandbox port range
pub const MICROSANDBOX_PORT_MIN_ENV_VAR: &str = "MICROSANDBOX_PORT_MIN";

/// Environment variable for the maximum port in the sandbox port range
pub const MICROSANDBOX_PORT_MAX_ENV_VAR: &str = "MICROSANDBOX_PORT_MAX";

//--------------------------------------------------------------------------------------------------
// Functions
//--------------------------------------------------------------------------------------------------

/// Returns the path to the microsandbox home directory.
/// If the MICROSANDBOX_HOME environment variable is set, returns that path.
/// Otherwise, returns the default microsandbox home path.
pub fn get_microsandbox_home_path() -> PathBuf {
    if let Ok(microsandbox_home) = std::env::var(MICROSANDBOX_HOME_ENV_VAR) {
        PathBuf::from(microsandbox_home)
    } else {
        DEFAULT_MICROSANDBOX_HOME.to_owned()
    }
}

/// Returns the domain for the OCI registry.
/// If the MSB_REGISTRY_HOST_ENV_VAR environment variable is set, returns that value.
/// Otherwise, returns the default OCI registry domain.
pub fn get_oci_registry() -> String {
    if let Ok(oci_registry_domain) = std::env::var(MSB_REGISTRY_HOST_ENV_VAR) {
        oci_registry_domain
    } else {
        DEFAULT_OCI_REGISTRY.to_string()
    }
}

/// Returns the registry username from environment, if set.
pub fn get_registry_username() -> Option<String> {
    std::env::var(MSB_REGISTRY_USERNAME_ENV_VAR).ok()
}

/// Returns the registry password from environment, if set.
pub fn get_registry_password() -> Option<String> {
    std::env::var(MSB_REGISTRY_PASSWORD_ENV_VAR).ok()
}

/// Returns the registry token from environment, if set.
pub fn get_registry_token() -> Option<String> {
    std::env::var(MSB_REGISTRY_TOKEN_ENV_VAR).ok()
}
