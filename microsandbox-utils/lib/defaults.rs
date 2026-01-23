//! Default values and constants used throughout the microsandbox project.
//!
//! This module provides default configuration values, paths, and other constants
//! that are used by various components of the microsandbox system.
//!
//! # Examples
//!
//! ```
//! use microsandbox_utils::defaults::{DEFAULT_NUM_VCPUS, DEFAULT_MEMORY_MIB};
//!
//! // Use default values for VM configuration
//! let vcpus = DEFAULT_NUM_VCPUS;
//! let memory = DEFAULT_MEMORY_MIB;
//! ```

use std::{fs, path::PathBuf, sync::LazyLock};

use crate::MICROSANDBOX_HOME_DIR;

//--------------------------------------------------------------------------------------------------
// Constants
//--------------------------------------------------------------------------------------------------

/// The default maximum log file size (10MB)
pub const DEFAULT_LOG_MAX_SIZE: u64 = 10 * 1024 * 1024;

/// The default number of vCPUs to use for the MicroVm (supports fractional values).
pub const DEFAULT_NUM_VCPUS: f32 = 1.0;

/// The default amount of memory in MiB to use for the MicroVm.
pub const DEFAULT_MEMORY_MIB: u32 = 1024;

/// The path where all microsandbox global data is stored.
pub static DEFAULT_MICROSANDBOX_HOME: LazyLock<PathBuf> =
    LazyLock::new(|| dirs::home_dir().unwrap().join(MICROSANDBOX_HOME_DIR));

/// The default OCI registry domain.
pub const DEFAULT_OCI_REGISTRY: &str = "docker.io";

/// The default OCI reference tag.
pub const DEFAULT_OCI_REFERENCE_TAG: &str = "latest";

/// The default OCI reference repository namespace.
pub const DEFAULT_OCI_REFERENCE_REPO_NAMESPACE: &str = "library";

/// The default configuration file content
pub const DEFAULT_CONFIG: &str = "# Sandbox configurations\nsandboxes:\n";

/// The default shell to use for the sandbox.
pub const DEFAULT_SHELL: &str = "/bin/sh";

/// The default path to the msbrun binary.
pub static DEFAULT_MSBRUN_EXE_PATH: LazyLock<PathBuf> = LazyLock::new(|| {
    let current_exe = std::env::current_exe().unwrap();
    let actual_exe = fs::canonicalize(current_exe).unwrap();
    actual_exe.parent().unwrap().join("msbrun")
});

/// The default path to the msbserver binary.
pub static DEFAULT_MSBSERVER_EXE_PATH: LazyLock<PathBuf> = LazyLock::new(|| {
    let current_exe = std::env::current_exe().unwrap();
    let actual_exe = fs::canonicalize(current_exe).unwrap();
    actual_exe.parent().unwrap().join("msbserver")
});

/// The default working directory for the sandbox.
pub const DEFAULT_WORKDIR: &str = "/";

/// The default namespace for the sandbox server.
pub const DEFAULT_SERVER_NAMESPACE: &str = "default";

/// The default localhost address.
pub const DEFAULT_SERVER_HOST: &str = "127.0.0.1";

/// The default microsandbox-server port.
pub const DEFAULT_SERVER_PORT: u16 = 5555;

/// The default microsandbox-portal port.
pub const DEFAULT_PORTAL_GUEST_PORT: u16 = 4444;

//--------------------------------------------------------------------------------------------------
// Tests
//--------------------------------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn default_num_vcpus_is_fractional_one() {
        assert_eq!(DEFAULT_NUM_VCPUS, 1.0f32);
    }

    #[test]
    fn default_memory_mib_is_1024() {
        assert_eq!(DEFAULT_MEMORY_MIB, 1024u32);
    }

    #[test]
    fn default_microsandbox_home_points_to_user_home_dir() {
        let home = dirs::home_dir().unwrap().join(MICROSANDBOX_HOME_DIR);
        assert_eq!(*DEFAULT_MICROSANDBOX_HOME, home);
    }

    #[test]
    fn default_config_has_sandboxes_section() {
        assert!(DEFAULT_CONFIG.contains("sandboxes:"));
    }

    #[test]
    fn default_shell_is_bin_sh() {
        assert_eq!(DEFAULT_SHELL, "/bin/sh");
    }

    #[test]
    fn default_server_namespace_is_default() {
        assert_eq!(DEFAULT_SERVER_NAMESPACE, "default");
    }

    #[test]
    fn default_server_host_and_port_match_expected() {
        assert_eq!(DEFAULT_SERVER_HOST, "127.0.0.1");
        assert_eq!(DEFAULT_SERVER_PORT, 5555u16);
    }

    #[test]
    fn default_portal_guest_port_is_4444() {
        assert_eq!(DEFAULT_PORTAL_GUEST_PORT, 4444u16);
    }

    #[test]
    fn default_msbrun_and_msbserver_paths_end_with_expected_binaries() {
        let msbrun = DEFAULT_MSBRUN_EXE_PATH
            .file_name()
            .unwrap()
            .to_string_lossy();
        let msbserver = DEFAULT_MSBSERVER_EXE_PATH
            .file_name()
            .unwrap()
            .to_string_lossy();
        assert_eq!(msbrun, "msbrun");
        assert_eq!(msbserver, "msbserver");
    }
}
