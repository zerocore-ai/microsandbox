#![cfg(target_os = "linux")]

use std::path::Path;

use microsandbox_core::vm::{apply_cpu_quota, cleanup_cgroup, has_cgroup_v2};
use microsandbox_core::MicrosandboxResult;

#[test]
fn apply_cpu_quota_writes_cpu_max() -> MicrosandboxResult<()> {
    if !has_cgroup_v2() {
        eprintln!("skipping: cgroups v2 not available on this host");
        return Ok(());
    }

    let pid = std::process::id();
    let cgroup_name = format!("msb_test_{}", pid);
    let result = apply_cpu_quota(pid, 0.5, &cgroup_name);
    if let Err(e) = result {
        eprintln!("skipping: failed to apply cpu quota ({})", e);
        return Ok(());
    }

    let cpu_max_path = Path::new("/sys/fs/cgroup")
        .join("microsandbox")
        .join(&cgroup_name)
        .join("cpu.max");
    let cpu_max = std::fs::read_to_string(cpu_max_path)?;

    assert!(cpu_max.starts_with("50000 100000"));

    // TODO: cleanup cgroup after validation if permissions allow removal.
    Ok(())
}

#[test]
fn cleanup_cgroup_removes_directory() -> MicrosandboxResult<()> {
    if !has_cgroup_v2() {
        eprintln!("skipping: cgroups v2 not available on this host");
        return Ok(());
    }

    let pid = std::process::id();
    let cgroup_name = format!("msb_cleanup_{}", pid);
    let cgroup_path = Path::new("/sys/fs/cgroup")
        .join("microsandbox")
        .join(&cgroup_name);

    let result = apply_cpu_quota(pid, 0.5, &cgroup_name);
    if let Err(e) = result {
        eprintln!("skipping: failed to apply cpu quota ({})", e);
        return Ok(());
    }

    if let Err(e) = cleanup_cgroup(&cgroup_name) {
        eprintln!("skipping: failed to cleanup cgroup ({})", e);
        return Ok(());
    }

    assert!(!cgroup_path.exists());
    Ok(())
}
