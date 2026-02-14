//! Utility functions for working with environment variables.

use std::{ops::RangeInclusive, path::PathBuf};

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

/// Environment variable for the sandbox port range (`<lower:u16>..[=]<upper:u16>`)
pub const MSB_PORT_RANGE_ENV_VAR: &str = "MSB_PORT_RANGE";

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
/// If MSB_PORT_RANGE is set and matches `<lower:u16>..[=]<upper:u16>`,
/// returns `Some(lower..=upper)`. Otherwise, returns None for dynamic allocation.
pub fn get_sandbox_port_range() -> Option<RangeInclusive<u16>> {
    let range = std::env::var(MSB_PORT_RANGE_ENV_VAR).ok()?;
    parse_sandbox_port_range(&range)
}

fn parse_sandbox_port_range(range: &str) -> Option<RangeInclusive<u16>> {
    let (lower_raw, upper_raw) = range.split_once("..")?;
    let lower = lower_raw.parse::<u16>().ok()?;
    let upper_part = upper_raw.strip_prefix('=').unwrap_or(upper_raw);
    let upper = upper_part.parse::<u16>().ok()?;

    (lower <= upper).then_some(lower..=upper)
}

#[cfg(test)]
mod tests {
    use super::parse_sandbox_port_range;

    #[test]
    fn test_parse_sandbox_port_range_with_exclusive_syntax() {
        assert_eq!(parse_sandbox_port_range("3000..4000"), Some(3000..=4000));
    }

    #[test]
    fn test_parse_sandbox_port_range_with_inclusive_syntax() {
        assert_eq!(parse_sandbox_port_range("3000..=4000"), Some(3000..=4000));
    }

    #[test]
    fn test_parse_sandbox_port_range_with_missing_lower_is_invalid() {
        assert_eq!(parse_sandbox_port_range("..=4000"), None);
    }

    #[test]
    fn test_parse_sandbox_port_range_with_invalid_order_is_invalid() {
        assert_eq!(parse_sandbox_port_range("4000..3000"), None);
    }

    #[test]
    fn test_parse_sandbox_port_range_requested_cases() {
        // Includes '=' and lower < upper
        assert_eq!(parse_sandbox_port_range("1000..=2000"), Some(1000..=2000));
        // Only upper exists (missing lower) should be invalid
        assert_eq!(parse_sandbox_port_range("..2000"), None);
        // Does not include '=' and lower < upper
        assert_eq!(parse_sandbox_port_range("1000..2000"), Some(1000..=2000));
    }
}
