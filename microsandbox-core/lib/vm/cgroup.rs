//! cgroups v2 helpers for runtime resource controls.

use std::path::Path;

#[cfg(target_os = "linux")]
use std::path::PathBuf;

use crate::MicrosandboxResult;

/// Default cgroup v2 CPU period in microseconds.
pub const DEFAULT_CPU_PERIOD_US: u64 = 100_000;

/// Computed CPU quota values for cgroups v2.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct CpuQuota {
    /// The quota in microseconds.
    pub quota_us: u64,
    /// The period in microseconds.
    pub period_us: u64,
}

/// Computes the cgroup v2 CPU quota for a fractional CPU request.
pub fn compute_cpu_quota(cpus: f32, period_us: u64) -> CpuQuota {
    let quota = (period_us as f32 * cpus).round().max(1.0) as u64;
    CpuQuota {
        quota_us: quota,
        period_us,
    }
}

/// Returns true if cgroups v2 appears to be available on the host.
pub fn has_cgroup_v2() -> bool {
    Path::new("/sys/fs/cgroup/cgroup.controllers").exists()
}

/// Applies a CPU quota to the process PID using cgroups v2.
///
/// This creates a dedicated cgroup under `/sys/fs/cgroup/microsandbox/<cgroup_name>`,
/// writes the CPU limit to `cpu.max`, and moves the PID into `cgroup.procs`.
///
#[cfg(target_os = "linux")]
pub fn apply_cpu_quota(pid: u32, cpus: f32, cgroup_name: &str) -> MicrosandboxResult<CpuQuota> {
    let quota = compute_cpu_quota(cpus, DEFAULT_CPU_PERIOD_US);
    let cgroup_path = cgroup_dir_path(cgroup_name);

    std::fs::create_dir_all(&cgroup_path)?;
    std::fs::write(cgroup_path.join("cpu.max"), format!("{} {}", quota.quota_us, quota.period_us))?;
    std::fs::write(cgroup_path.join("cgroup.procs"), pid.to_string())?;

    Ok(quota)
}

/// Applies a CPU quota on non-Linux systems (no-op).
///
/// TODO: define a clearer contract for non-Linux CPU throttling if it ever becomes available.
#[cfg(not(target_os = "linux"))]
pub fn apply_cpu_quota(_pid: u32, _cpus: f32, _cgroup_name: &str) -> MicrosandboxResult<CpuQuota> {
    Ok(compute_cpu_quota(_cpus, DEFAULT_CPU_PERIOD_US))
}

#[cfg(target_os = "linux")]
fn cgroup_dir_path(cgroup_name: &str) -> PathBuf {
    Path::new("/sys/fs/cgroup")
        .join("microsandbox")
        .join(cgroup_name)
}

/// Removes the cgroup directory for a sandbox.
///
/// TODO: consider tolerating EBUSY by retrying after moving the process out.
#[cfg(target_os = "linux")]
pub fn cleanup_cgroup(cgroup_name: &str) -> MicrosandboxResult<()> {
    let cgroup_path = cgroup_dir_path(cgroup_name);
    if cgroup_path.exists() {
        std::fs::remove_dir_all(cgroup_path)?;
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn cpu_quota_rounds_to_nearest() {
        let quota = compute_cpu_quota(0.1, DEFAULT_CPU_PERIOD_US);
        assert_eq!(
            quota,
            CpuQuota {
                quota_us: 10_000,
                period_us: 100_000
            }
        );

        let quota = compute_cpu_quota(0.5, DEFAULT_CPU_PERIOD_US);
        assert_eq!(
            quota,
            CpuQuota {
                quota_us: 50_000,
                period_us: 100_000
            }
        );
    }

    #[test]
    #[cfg(not(target_os = "linux"))]
    fn apply_cpu_quota_is_noop_on_non_linux() {
        let pid = std::process::id();
        let cgroup_name = format!("msb_noop_{}", pid);
        let path = Path::new("/sys/fs/cgroup").join("microsandbox").join(&cgroup_name);
        if path.exists() {
            eprintln!("skipping: cgroup path exists on this host");
            return;
        }

        let quota = apply_cpu_quota(pid, 0.5, &cgroup_name).expect("no-op should succeed");
        assert_eq!(
            quota,
            CpuQuota {
                quota_us: 50_000,
                period_us: 100_000
            }
        );
        assert!(!path.exists());
    }
}
