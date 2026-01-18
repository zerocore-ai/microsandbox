//! Utility functions for working with environment variables.

use std::path::PathBuf;

use crate::{DEFAULT_MICROSANDBOX_HOME, DEFAULT_OCI_REGISTRY};

//--------------------------------------------------------------------------------------------------
// Constants
//--------------------------------------------------------------------------------------------------

/// Environment variable for the microsandbox home directory
pub const MICROSANDBOX_HOME_ENV_VAR: &str = "MICROSANDBOX_HOME";

/// Environment variable for the OCI registry domain
pub const OCI_REGISTRY_ENV_VAR: &str = "OCI_REGISTRY_DOMAIN";

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
/// If the OCI_REGISTRY_DOMAIN environment variable is set, returns that value.
/// Otherwise, returns the default OCI registry domain.
pub fn get_oci_registry() -> String {
    if let Ok(oci_registry_domain) = std::env::var(OCI_REGISTRY_ENV_VAR) {
        oci_registry_domain
    } else {
        DEFAULT_OCI_REGISTRY.to_string()
    }
}

/// Returns the port range for sandbox port allocation.
/// If both MICROSANDBOX_PORT_MIN and MICROSANDBOX_PORT_MAX are set,
/// returns Some((min, max)). Otherwise, returns None for dynamic allocation.
pub fn get_sandbox_port_range() -> Option<(u16, u16)> {
    let min = std::env::var(MICROSANDBOX_PORT_MIN_ENV_VAR)
        .ok()
        .and_then(|v| v.parse::<u16>().ok());
    let max = std::env::var(MICROSANDBOX_PORT_MAX_ENV_VAR)
        .ok()
        .and_then(|v| v.parse::<u16>().ok());

    match (min, max) {
        (Some(min_val), Some(max_val)) if min_val <= max_val => Some((min_val, max_val)),
        _ => None,
    }
}

