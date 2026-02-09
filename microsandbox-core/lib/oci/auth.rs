use oci_client::secrets::RegistryAuth;

use microsandbox_utils::{
    StoredRegistryCredentials, env, load_stored_registry_credentials,
};

use crate::{MicrosandboxError, MicrosandboxResult, oci::Reference};

//--------------------------------------------------------------------------------------------------
// Functions
//--------------------------------------------------------------------------------------------------

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

    if normalized == "index.docker.io" {
        "docker.io".to_string()
    } else {
        normalized
    }
}

/// Resolve the registry host for an image reference.
pub fn registry_host_for_reference(reference: &Reference) -> String {
    let raw = reference.to_string();
    let mut parts = raw.split('/');
    let first = parts.next().unwrap_or("");

    let host = if first.contains('.') || first.contains(':') || first == "localhost" {
        first.to_string()
    } else {
        env::get_oci_registry()
    };

    normalize_registry_host(&host)
}

/// Resolve registry auth for a given reference.
///
/// Priority:
/// 1) Environment variables
/// 2) Stored credentials (msb login)
/// 3) Anonymous
pub fn resolve_registry_auth(reference: &Reference) -> MicrosandboxResult<RegistryAuth> {
    let registry = registry_host_for_reference(reference);

    let env_token = env::get_registry_token();
    let env_username = env::get_registry_username();
    let env_password = env::get_registry_password();

    if env_token.is_some() && (env_username.is_some() || env_password.is_some()) {
        return Err(MicrosandboxError::InvalidArgument(
            "token cannot be combined with username/password".to_string(),
        ));
    }

    if let Some(token) = env_token {
        return Ok(RegistryAuth::Bearer(token));
    }

    match (env_username, env_password) {
        (Some(username), Some(password)) => {
            return Ok(RegistryAuth::Basic(username, password));
        }
        (Some(_), None) | (None, Some(_)) => {
            tracing::warn!(
                "registry credentials provided via env are incomplete; falling back to stored or anonymous"
            );
        }
        (None, None) => {}
    }

    if let Some(stored) = load_stored_registry_credentials(&registry)? {
        return Ok(match stored {
            StoredRegistryCredentials::Basic { username, password } => {
                RegistryAuth::Basic(username, password)
            }
            StoredRegistryCredentials::Token { token } => RegistryAuth::Bearer(token),
        });
    }

    Ok(RegistryAuth::Anonymous)
}

//--------------------------------------------------------------------------------------------------
// Tests
//--------------------------------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::Mutex;

    use microsandbox_utils::{StoredRegistryCredentials, clear_registry_credentials, store_registry_credentials};
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
    fn normalize_registry_host_maps_index_docker_io() {
        assert_eq!(normalize_registry_host("index.docker.io"), "docker.io");
    }

    #[test]
    fn normalize_registry_host_strips_scheme_and_slash() {
        assert_eq!(normalize_registry_host("https://Docker.IO/"), "docker.io");
    }

    #[test]
    fn resolve_registry_auth_prefers_env_token() {
        let _lock = ENV_LOCK.lock().unwrap();
        let _token = EnvGuard::set(env::MSB_REGISTRY_TOKEN_ENV_VAR, "env-token");
        let _user = EnvGuard::remove(env::MSB_REGISTRY_USERNAME_ENV_VAR);
        let _pass = EnvGuard::remove(env::MSB_REGISTRY_PASSWORD_ENV_VAR);

        let msb_home = TempDir::new().expect("temp msb home");
        let _msb_home = EnvGuard::set(env::MICROSANDBOX_HOME_ENV_VAR, msb_home.path());
        clear_registry_credentials().expect("clear");
        store_registry_credentials(
            "ghcr.io",
            StoredRegistryCredentials::Token {
                token: "stored-token".to_string(),
            },
        )
        .expect("store");

        let reference: Reference = "ghcr.io/org/app:1.0".parse().unwrap();
        let auth = resolve_registry_auth(&reference).expect("resolve auth");
        assert!(matches!(auth, RegistryAuth::Bearer(t) if t == "env-token"));
    }

    #[test]
    fn resolve_registry_auth_prefers_env_basic() {
        let _lock = ENV_LOCK.lock().unwrap();
        let _token = EnvGuard::remove(env::MSB_REGISTRY_TOKEN_ENV_VAR);
        let _user = EnvGuard::set(env::MSB_REGISTRY_USERNAME_ENV_VAR, "env-user");
        let _pass = EnvGuard::set(env::MSB_REGISTRY_PASSWORD_ENV_VAR, "env-pass");

        let msb_home = TempDir::new().expect("temp msb home");
        let _msb_home = EnvGuard::set(env::MICROSANDBOX_HOME_ENV_VAR, msb_home.path());
        clear_registry_credentials().expect("clear");
        store_registry_credentials(
            "ghcr.io",
            StoredRegistryCredentials::Token {
                token: "stored-token".to_string(),
            },
        )
        .expect("store");

        let reference: Reference = "ghcr.io/org/app:1.0".parse().unwrap();
        let auth = resolve_registry_auth(&reference).expect("resolve auth");
        assert!(matches!(auth, RegistryAuth::Basic(u, p) if u == "env-user" && p == "env-pass"));
    }

    #[test]
    fn resolve_registry_auth_falls_back_to_stored() {
        let _lock = ENV_LOCK.lock().unwrap();
        let _token = EnvGuard::remove(env::MSB_REGISTRY_TOKEN_ENV_VAR);
        let _user = EnvGuard::remove(env::MSB_REGISTRY_USERNAME_ENV_VAR);
        let _pass = EnvGuard::remove(env::MSB_REGISTRY_PASSWORD_ENV_VAR);

        let msb_home = TempDir::new().expect("temp msb home");
        let _msb_home = EnvGuard::set(env::MICROSANDBOX_HOME_ENV_VAR, msb_home.path());
        clear_registry_credentials().expect("clear");
        store_registry_credentials(
            "ghcr.io",
            StoredRegistryCredentials::Token {
                token: "stored-token".to_string(),
            },
        )
        .expect("store");

        let reference: Reference = "ghcr.io/org/app:1.0".parse().unwrap();
        let auth = resolve_registry_auth(&reference).expect("resolve auth");
        assert!(matches!(auth, RegistryAuth::Bearer(t) if t == "stored-token"));
    }

    #[test]
    fn resolve_registry_auth_returns_anonymous_when_missing() {
        let _lock = ENV_LOCK.lock().unwrap();
        let _token = EnvGuard::remove(env::MSB_REGISTRY_TOKEN_ENV_VAR);
        let _user = EnvGuard::remove(env::MSB_REGISTRY_USERNAME_ENV_VAR);
        let _pass = EnvGuard::remove(env::MSB_REGISTRY_PASSWORD_ENV_VAR);

        let msb_home = TempDir::new().expect("temp msb home");
        let _msb_home = EnvGuard::set(env::MICROSANDBOX_HOME_ENV_VAR, msb_home.path());
        clear_registry_credentials().expect("clear");

        let reference: Reference = "ghcr.io/org/app:1.0".parse().unwrap();
        let auth = resolve_registry_auth(&reference).expect("resolve auth");
        assert!(matches!(auth, RegistryAuth::Anonymous));
    }

    #[test]
    fn resolve_registry_auth_errors_on_token_and_basic() {
        let _lock = ENV_LOCK.lock().unwrap();
        let _token = EnvGuard::set(env::MSB_REGISTRY_TOKEN_ENV_VAR, "env-token");
        let _user = EnvGuard::set(env::MSB_REGISTRY_USERNAME_ENV_VAR, "env-user");
        let _pass = EnvGuard::set(env::MSB_REGISTRY_PASSWORD_ENV_VAR, "env-pass");

        let msb_home = TempDir::new().expect("temp msb home");
        let _msb_home = EnvGuard::set(env::MICROSANDBOX_HOME_ENV_VAR, msb_home.path());
        clear_registry_credentials().expect("clear");

        let reference: Reference = "ghcr.io/org/app:1.0".parse().unwrap();
        let err = resolve_registry_auth(&reference).expect_err("expected error");
        assert!(matches!(err, MicrosandboxError::InvalidArgument(_)));
    }
}
