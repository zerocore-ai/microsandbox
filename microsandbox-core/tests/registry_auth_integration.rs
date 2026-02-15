use std::sync::Mutex;

use microsandbox_core::oci::{Reference, resolve_auth};
use microsandbox_utils::{CredentialStore, MsbRegistryAuth, env};
use tempfile::TempDir;

static ENV_LOCK: Mutex<()> = Mutex::new(());

fn lock_env() -> std::sync::MutexGuard<'static, ()> {
    ENV_LOCK.lock().unwrap_or_else(|err| err.into_inner())
}

fn keyring_roundtrip_available() -> bool {
    let probe = MsbRegistryAuth::Token {
        token: "probe-token".to_string(),
    };
    if CredentialStore::store_registry_credentials("registry.test.invalid", probe.clone()).is_err() {
        return false;
    }
    match CredentialStore::load_registry_credentials("registry.test.invalid") {
        Ok(Some(MsbRegistryAuth::Token { token })) => token == "probe-token",
        _ => false,
    }
}

struct EnvGuard {
    key: &'static str,
    prev: Option<std::ffi::OsString>,
}

impl EnvGuard {
    fn set(key: &'static str, value: impl Into<std::ffi::OsString>) -> Self {
        let prev = std::env::var_os(key);
        let value: std::ffi::OsString = value.into();
        unsafe { std::env::set_var(key, &value) };
        Self { key, prev }
    }

    fn remove(key: &'static str) -> Self {
        let prev = std::env::var_os(key);
        unsafe { std::env::remove_var(key) };
        Self { key, prev }
    }
}

impl Drop for EnvGuard {
    fn drop(&mut self) {
        if let Some(value) = self.prev.take() {
            unsafe { std::env::set_var(self.key, value) };
        } else {
            unsafe { std::env::remove_var(self.key) };
        }
    }
}

#[test]
fn resolves_stored_credentials_when_env_missing() {
    let _lock = lock_env();
    let _token = EnvGuard::remove(env::MSB_REGISTRY_TOKEN_ENV_VAR);
    let _user = EnvGuard::remove(env::MSB_REGISTRY_USERNAME_ENV_VAR);
    let _pass = EnvGuard::remove(env::MSB_REGISTRY_PASSWORD_ENV_VAR);

    let msb_home = TempDir::new().expect("temp msb home");
    let _msb_home = EnvGuard::set(env::MICROSANDBOX_HOME_ENV_VAR, msb_home.path());
    let _ = CredentialStore::remove_registry_credentials("registry.test.invalid");
    if !keyring_roundtrip_available() {
        eprintln!("skipping: keyring backend does not support roundtrip in this environment");
        return;
    }
    CredentialStore::store_registry_credentials(
        "registry.test.invalid",
        MsbRegistryAuth::Token {
            token: "stored-token".to_string(),
        },
    )
    .expect("store");

    let reference: Reference = "registry.test.invalid/org/app:1.0".parse().unwrap();
    let auth = resolve_auth(&reference, &CredentialStore).expect("resolve auth");
    assert!(matches!(auth, oci_client::secrets::RegistryAuth::Bearer(t) if t == "stored-token"));
}

#[test]
fn env_overrides_with_token_when_present() {
    let _lock = lock_env();
    let _token = EnvGuard::set(env::MSB_REGISTRY_TOKEN_ENV_VAR, "env-token");
    let _user = EnvGuard::remove(env::MSB_REGISTRY_USERNAME_ENV_VAR);
    let _pass = EnvGuard::remove(env::MSB_REGISTRY_PASSWORD_ENV_VAR);

    let msb_home = TempDir::new().expect("temp msb home");
    let _msb_home = EnvGuard::set(env::MICROSANDBOX_HOME_ENV_VAR, msb_home.path());
    let _ = CredentialStore::remove_registry_credentials("registry.test.invalid");

    let reference: Reference = "registry.test.invalid/org/app:1.0".parse().unwrap();
    let auth = resolve_auth(&reference, &CredentialStore).expect("resolve auth");
    assert!(matches!(auth, oci_client::secrets::RegistryAuth::Bearer(t) if t == "env-token"));
}

#[test]
fn incomplete_env_falls_back_to_stored_credentials() {
    let _lock = lock_env();
    let _token = EnvGuard::remove(env::MSB_REGISTRY_TOKEN_ENV_VAR);
    let _user = EnvGuard::set(env::MSB_REGISTRY_USERNAME_ENV_VAR, "env-user");
    let _pass = EnvGuard::remove(env::MSB_REGISTRY_PASSWORD_ENV_VAR);

    let msb_home = TempDir::new().expect("temp msb home");
    let _msb_home = EnvGuard::set(env::MICROSANDBOX_HOME_ENV_VAR, msb_home.path());
    let _ = CredentialStore::remove_registry_credentials("registry.test.invalid");
    if !keyring_roundtrip_available() {
        eprintln!("skipping: keyring backend does not support roundtrip in this environment");
        return;
    }
    CredentialStore::store_registry_credentials(
        "registry.test.invalid",
        MsbRegistryAuth::Token {
            token: "stored-token".to_string(),
        },
    )
    .expect("store");

    let reference: Reference = "registry.test.invalid/org/app:1.0".parse().unwrap();
    let auth = resolve_auth(&reference, &CredentialStore).expect("resolve auth");
    assert!(matches!(auth, oci_client::secrets::RegistryAuth::Bearer(t) if t == "stored-token"));
}
