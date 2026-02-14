use std::sync::Mutex;

use microsandbox_core::{oci::Reference, oci::resolve_auth};
use microsandbox_utils::{
    CredentialStore, StoredRegistryCredentials, env,
};
use tempfile::TempDir;

static ENV_LOCK: Mutex<()> = Mutex::new(());

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
    let _lock = ENV_LOCK.lock().unwrap();
    let _token = EnvGuard::remove(env::MSB_REGISTRY_TOKEN_ENV_VAR);
    let _user = EnvGuard::remove(env::MSB_REGISTRY_USERNAME_ENV_VAR);
    let _pass = EnvGuard::remove(env::MSB_REGISTRY_PASSWORD_ENV_VAR);

    let msb_home = TempDir::new().expect("temp msb home");
    let _msb_home = EnvGuard::set(env::MICROSANDBOX_HOME_ENV_VAR, msb_home.path());
    CredentialStore::clear_registry_credentials().expect("clear");
    CredentialStore::store_registry_credentials(
        "ghcr.io",
        StoredRegistryCredentials::Token {
            token: "stored-token".to_string(),
        },
    )
    .expect("store");

    let reference: Reference = "ghcr.io/org/app:1.0".parse().unwrap();
    let auth = resolve_auth(&reference).expect("resolve auth");
    assert!(matches!(auth, oci_client::secrets::RegistryAuth::Bearer(t) if t == "stored-token"));
}

#[test]
fn env_overrides_stored_credentials() {
    let _lock = ENV_LOCK.lock().unwrap();
    let _token = EnvGuard::set(env::MSB_REGISTRY_TOKEN_ENV_VAR, "env-token");
    let _user = EnvGuard::remove(env::MSB_REGISTRY_USERNAME_ENV_VAR);
    let _pass = EnvGuard::remove(env::MSB_REGISTRY_PASSWORD_ENV_VAR);

    let msb_home = TempDir::new().expect("temp msb home");
    let _msb_home = EnvGuard::set(env::MICROSANDBOX_HOME_ENV_VAR, msb_home.path());
    CredentialStore::clear_registry_credentials().expect("clear");
    CredentialStore::store_registry_credentials(
        "ghcr.io",
        StoredRegistryCredentials::Token {
            token: "stored-token".to_string(),
        },
    )
    .expect("store");

    let reference: Reference = "ghcr.io/org/app:1.0".parse().unwrap();
    let auth = resolve_auth(&reference).expect("resolve auth");
    assert!(matches!(auth, oci_client::secrets::RegistryAuth::Bearer(t) if t == "env-token"));
}
