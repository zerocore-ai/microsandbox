//! Docker config reader utilities for registry authentication.
//!
//! # Examples
//! ```no_run
//! use microsandbox_utils::load_docker_registry_credentials;
//!
//! let creds = load_docker_registry_credentials("ghcr.io")
//!     .map_err(|err| microsandbox_utils::MicrosandboxUtilsError::custom(err))?;
//! if let Some(creds) = creds {
//!     println!("loaded docker credentials: {:?}", creds);
//! }
//! # Ok::<(), microsandbox_utils::MicrosandboxUtilsError>(())
//! ```

use std::{
    collections::HashMap,
    io::Write,
    path::{Path, PathBuf},
    process::{Command, Stdio},
};

use base64::{Engine as _, engine::general_purpose::STANDARD as BASE64_STANDARD};
use serde::Deserialize;

//--------------------------------------------------------------------------------------------------
// Constants
//--------------------------------------------------------------------------------------------------

const DOCKER_CONFIG_ENV_VAR: &str = "DOCKER_CONFIG";
const DOCKER_CONFIG_FILENAME: &str = "config.json";
const DOCKER_IO_LEGACY_KEY: &str = "https://index.docker.io/v1/";

//--------------------------------------------------------------------------------------------------
// Types
//--------------------------------------------------------------------------------------------------

/// Credentials loaded from Docker config.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum DockerAuthCredentials {
    /// Basic auth using username + password.
    Basic {
        /// Registry username.
        username: String,
        /// Registry password.
        password: String,
    },
    /// Token-based auth (identity token).
    Token {
        /// Registry token.
        token: String,
    },
}

/// Errors that can occur while reading Docker config.
#[derive(Debug, thiserror::Error)]
pub enum DockerConfigError {
    /// IO error while reading config file.
    #[error("io error: {0}")]
    Io(#[from] std::io::Error),
    /// JSON parse error.
    #[error("json error: {0}")]
    Json(#[from] serde_json::Error),
    /// Base64 decode error.
    #[error("base64 error: {0}")]
    Base64(#[from] base64::DecodeError),
    /// Invalid auth entry.
    #[error("invalid auth entry: {0}")]
    InvalidAuth(String),
}

#[derive(Debug, Deserialize)]
struct DockerConfig {
    auths: Option<HashMap<String, DockerAuthEntry>>,
    #[allow(dead_code)]
    #[serde(rename = "credsStore")]
    creds_store: Option<String>,
    #[allow(dead_code)]
    #[serde(rename = "credHelpers")]
    cred_helpers: Option<HashMap<String, String>>,
}

#[derive(Debug, Deserialize)]
struct DockerAuthEntry {
    auth: Option<String>,
    identitytoken: Option<String>,
    username: Option<String>,
    password: Option<String>,
}

//--------------------------------------------------------------------------------------------------
// Functions
//--------------------------------------------------------------------------------------------------

/// Loads credentials for a registry host from Docker config if present.
///
/// TODO: Support credsStore / credHelpers by invoking docker-credential helpers.
pub fn load_docker_registry_credentials(
    host: &str,
) -> Result<Option<DockerAuthCredentials>, DockerConfigError> {
    let config_path = match docker_config_path() {
        Some(path) => path,
        None => return Ok(None),
    };
    if !config_path.exists() {
        return Ok(None);
    }

    let config = read_config(&config_path)?;
    if let Some(creds) = load_from_helpers(host, &config)? {
        return Ok(Some(creds));
    }

    if let Some(auths) = config.auths {
        for key in candidate_registry_keys(host) {
            if let Some(entry) = auths.get(key) {
                return parse_auth_entry(entry).map(Some);
            }
        }
    }

    Ok(None)
}

fn docker_config_path() -> Option<PathBuf> {
    if let Ok(path) = std::env::var(DOCKER_CONFIG_ENV_VAR) {
        let path = PathBuf::from(path);
        return Some(if path.is_dir() {
            path.join(DOCKER_CONFIG_FILENAME)
        } else {
            path
        });
    }

    let home = dirs::home_dir()?;
    Some(home.join(".docker").join(DOCKER_CONFIG_FILENAME))
}

fn read_config(path: &Path) -> Result<DockerConfig, DockerConfigError> {
    let contents = std::fs::read_to_string(path)?;
    Ok(serde_json::from_str::<DockerConfig>(&contents)?)
}

fn candidate_registry_keys(host: &str) -> Vec<&str> {
    if host == "docker.io" {
        vec![host, DOCKER_IO_LEGACY_KEY]
    } else {
        vec![host]
    }
}

fn parse_auth_entry(entry: &DockerAuthEntry) -> Result<DockerAuthCredentials, DockerConfigError> {
    if let Some(token) = entry.identitytoken.as_ref() {
        if token.is_empty() {
            return Err(DockerConfigError::InvalidAuth(
                "identitytoken is empty".to_string(),
            ));
        }
        return Ok(DockerAuthCredentials::Token {
            token: token.to_string(),
        });
    }

    if let (Some(username), Some(password)) = (entry.username.as_ref(), entry.password.as_ref()) {
        if username.is_empty() || password.is_empty() {
            return Err(DockerConfigError::InvalidAuth(
                "username/password is empty".to_string(),
            ));
        }
        return Ok(DockerAuthCredentials::Basic {
            username: username.to_string(),
            password: password.to_string(),
        });
    }

    if let Some(encoded) = entry.auth.as_ref() {
        if encoded.is_empty() {
            return Err(DockerConfigError::InvalidAuth(
                "auth is empty".to_string(),
            ));
        }
        let decoded = BASE64_STANDARD.decode(encoded)?;
        let decoded = String::from_utf8_lossy(&decoded);
        let (username, password) = decoded
            .split_once(':')
            .ok_or_else(|| DockerConfigError::InvalidAuth("auth missing ':'".to_string()))?;
        if username.is_empty() || password.is_empty() {
            return Err(DockerConfigError::InvalidAuth(
                "auth username/password is empty".to_string(),
            ));
        }
        return Ok(DockerAuthCredentials::Basic {
            username: username.to_string(),
            password: password.to_string(),
        });
    }

    Err(DockerConfigError::InvalidAuth(
        "no supported auth fields".to_string(),
    ))
}

fn load_from_helpers(
    host: &str,
    config: &DockerConfig,
) -> Result<Option<DockerAuthCredentials>, DockerConfigError> {
    let helper = match select_credential_helper(host, config) {
        Some(helper) => helper,
        None => return Ok(None),
    };

    for key in candidate_registry_keys(host) {
        if let Some(creds) = run_credential_helper(&helper, key)? {
            return Ok(Some(creds));
        }
    }

    Ok(None)
}

fn select_credential_helper(host: &str, config: &DockerConfig) -> Option<String> {
    if let Some(helpers) = config.cred_helpers.as_ref() {
        if let Some(helper) = helpers.get(host) {
            return Some(helper.to_string());
        }
    }

    config.creds_store.as_ref().map(|v| v.to_string())
}

fn run_credential_helper(
    helper: &str,
    server_url: &str,
) -> Result<Option<DockerAuthCredentials>, DockerConfigError> {
    let helper_bin = format!("docker-credential-{}", helper);
    let mut child = match Command::new(&helper_bin)
        .arg("get")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
    {
        Ok(child) => child,
        Err(err) if err.kind() == std::io::ErrorKind::NotFound => return Ok(None),
        Err(err) => return Err(DockerConfigError::Io(err)),
    };

    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(server_url.as_bytes())?;
        stdin.write_all(b"\n")?;
    }

    let output = child.wait_with_output()?;
    if !output.status.success() {
        return Ok(None);
    }

    let creds = parse_credential_helper_output(&output.stdout)?;
    Ok(Some(creds))
}

fn parse_credential_helper_output(
    raw: &[u8],
) -> Result<DockerAuthCredentials, DockerConfigError> {
    #[derive(Deserialize)]
    struct HelperOutput {
        #[allow(dead_code)]
        #[serde(rename = "ServerURL")]
        server_url: Option<String>,
        #[serde(rename = "Username")]
        username: String,
        #[serde(rename = "Secret")]
        secret: String,
    }

    let output: HelperOutput = serde_json::from_slice(raw)?;
    if output.secret.is_empty() {
        return Err(DockerConfigError::InvalidAuth(
            "credential helper secret is empty".to_string(),
        ));
    }

    if output.username.is_empty() {
        return Ok(DockerAuthCredentials::Token {
            token: output.secret,
        });
    }

    Ok(DockerAuthCredentials::Basic {
        username: output.username,
        password: output.secret,
    })
}

//--------------------------------------------------------------------------------------------------
// Tests
//--------------------------------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::TempDir;

    struct EnvGuard {
        key: &'static str,
        prev: Option<std::ffi::OsString>,
    }

    impl EnvGuard {
        fn set(key: &'static str, value: String) -> Self {
            let prev = std::env::var_os(key);
            unsafe { std::env::set_var(key, value) };
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

    fn write_config(temp_dir: &TempDir, contents: &str) -> PathBuf {
        let path = temp_dir.path().join("config.json");
        fs::write(&path, contents).expect("write config");
        path
    }

    #[test]
    fn load_auth_from_basic_auth_field() {
        let dir = TempDir::new().expect("temp dir");
        let encoded = BASE64_STANDARD.encode("user:pass");
        let config = format!(
            r#"{{
  "auths": {{
    "registry.example.com": {{ "auth": "{}" }}
  }}
}}"#,
            encoded
        );
        let path = write_config(&dir, &config);
        let _guard = EnvGuard::set(DOCKER_CONFIG_ENV_VAR, path.to_string_lossy().to_string());

        let creds = load_docker_registry_credentials("registry.example.com")
            .expect("load creds")
            .expect("creds");

        assert_eq!(
            creds,
            DockerAuthCredentials::Basic {
                username: "user".to_string(),
                password: "pass".to_string()
            }
        );
    }

    #[test]
    fn load_auth_from_identity_token() {
        let dir = TempDir::new().expect("temp dir");
        let config = r#"{
  "auths": {
    "registry.example.com": { "identitytoken": "token-123" }
  }
}"#;
        let path = write_config(&dir, config);
        let _guard = EnvGuard::set(DOCKER_CONFIG_ENV_VAR, path.to_string_lossy().to_string());

        let creds = load_docker_registry_credentials("registry.example.com")
            .expect("load creds")
            .expect("creds");

        assert_eq!(
            creds,
            DockerAuthCredentials::Token {
                token: "token-123".to_string()
            }
        );
    }

    #[test]
    fn parse_helper_output_basic() {
        let raw = br#"{"ServerURL":"ghcr.io","Username":"user","Secret":"pat"}"#;
        let creds = parse_credential_helper_output(raw).expect("parse helper output");
        assert_eq!(
            creds,
            DockerAuthCredentials::Basic {
                username: "user".to_string(),
                password: "pat".to_string()
            }
        );
    }

    #[test]
    fn parse_helper_output_token() {
        let raw = br#"{"ServerURL":"ghcr.io","Username":"","Secret":"token"}"#;
        let creds = parse_credential_helper_output(raw).expect("parse helper output");
        assert_eq!(
            creds,
            DockerAuthCredentials::Token {
                token: "token".to_string()
            }
        );
    }
}
