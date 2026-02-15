use clap::{CommandFactory, error::ErrorKind};
use microsandbox_cli::{
    AnsiStyles, MicrosandboxArgs, MicrosandboxCliError, MicrosandboxCliResult, SelfAction,
};
use microsandbox_core::{
    config::START_SCRIPT_NAME,
    management::{
        config::{self, Component, ComponentType, SandboxConfig},
        home, menv, orchestra, sandbox, toolchain,
    },
    oci::{Reference, resolve_explicit_credentials},
};
use microsandbox_server::MicrosandboxServerResult;
use microsandbox_utils::{
    CredentialStore, PROJECTS_SUBDIR, MsbRegistryAuth, env,
};
use std::{collections::HashMap, path::PathBuf};
use tokio::io::{self, AsyncRead, AsyncReadExt};
use typed_path::Utf8UnixPathBuf;

//--------------------------------------------------------------------------------------------------
// Constants
//--------------------------------------------------------------------------------------------------

const SANDBOX_SCRIPT_SEPARATOR: char = '~';

//--------------------------------------------------------------------------------------------------
// Functions: Handlers
//--------------------------------------------------------------------------------------------------

/// Set the log level based on the command line arguments
pub fn log_level(args: &MicrosandboxArgs) {
    let level = if args.trace {
        Some("trace")
    } else if args.debug {
        Some("debug")
    } else if args.info {
        Some("info")
    } else if args.warn {
        Some("warn")
    } else if args.error {
        Some("error")
    } else {
        None
    };

    // Set RUST_LOG environment variable only if a level is specified
    if let Some(level) = level {
        unsafe { std::env::set_var("RUST_LOG", format!("microsandbox={},msb={}", level, level)) };
    }
}

#[allow(clippy::too_many_arguments)]
pub async fn add_subcommand(
    sandbox: bool,
    build: bool,
    names: Vec<String>,
    image: String,
    memory: Option<u32>,
    cpus: Option<u32>,
    volumes: Vec<String>,
    ports: Vec<String>,
    envs: Vec<String>,
    env_file: Option<Utf8UnixPathBuf>,
    depends_on: Vec<String>,
    workdir: Option<Utf8UnixPathBuf>,
    shell: Option<String>,
    scripts: Vec<(String, String)>,
    start: Option<String>,
    imports: Vec<(String, String)>,
    exports: Vec<(String, String)>,
    scope: Option<String>,
    path: Option<PathBuf>,
    config: Option<String>,
) -> MicrosandboxCliResult<()> {
    validate_build_sandbox_conflict(build, sandbox, "add", Some("[NAMES]"), None);
    unsupported_build_error(build, "add", Some("[NAMES]"));

    let mut scripts = scripts.into_iter().collect::<HashMap<String, String>>();

    if let Some(start) = start {
        scripts.insert(START_SCRIPT_NAME.to_string(), start);
    }

    let component = Component::Sandbox(Box::new(SandboxConfig {
        image,
        memory,
        cpus,
        volumes,
        ports,
        envs,
        env_file,
        depends_on,
        workdir,
        shell,
        scripts,
        imports: imports.into_iter().map(|(k, v)| (k, v.into())).collect(),
        exports: exports.into_iter().map(|(k, v)| (k, v.into())).collect(),
        scope,
    }));

    config::add(&names, &component, path.as_deref(), config.as_deref()).await?;

    Ok(())
}

pub async fn remove_subcommand(
    sandbox: bool,
    build: bool,
    names: Vec<String>,
    file: Option<PathBuf>,
) -> MicrosandboxCliResult<()> {
    validate_build_sandbox_conflict(build, sandbox, "remove", Some("[NAMES]"), None);
    unsupported_build_error(build, "remove", Some("[NAMES]"));

    let (path, config) = parse_file_path(file);
    config::remove(
        ComponentType::Sandbox,
        &names,
        path.as_deref(),
        config.as_deref(),
    )
    .await?;

    Ok(())
}

pub async fn list_subcommand(
    sandbox: bool,
    build: bool,
    file: Option<PathBuf>,
) -> MicrosandboxCliResult<()> {
    validate_build_sandbox_conflict(build, sandbox, "list", None, None);
    unsupported_build_error(build, "list", None);

    let (path, config) = parse_file_path(file);
    let (config, _, _) = config::load_config(path.as_deref(), config.as_deref()).await?;

    // Use the new show_list function to display sandboxes
    menv::show_list(config.get_sandboxes());

    Ok(())
}

pub async fn init_subcommand(path: Option<PathBuf>) -> MicrosandboxCliResult<()> {
    menv::initialize(path).await?;
    Ok(())
}

pub async fn run_subcommand(
    sandbox: bool,
    build: bool,
    name: String,
    file: Option<PathBuf>,
    detach: bool,
    exec: Option<String>,
    args: Vec<String>,
) -> MicrosandboxCliResult<()> {
    validate_build_sandbox_conflict(build, sandbox, "run", Some("[NAME]"), Some("<ARGS>"));

    unsupported_build_error(build, "run", Some("[NAME]"));

    let (sandbox, script) = parse_name_and_script(&name);
    if matches!((script, &exec), (Some(_), Some(_))) {
        MicrosandboxArgs::command()
            .override_usage(usage("run", Some("[NAME[~SCRIPT]]"), Some("<ARGS>")))
            .error(
                ErrorKind::ArgumentConflict,
                format!(
                    "cannot specify both a script and an `{}` option.",
                    "--exec".placeholder()
                ),
            )
            .exit();
    }

    let (path, config) = parse_file_path(file);
    sandbox::run(
        sandbox,
        script,
        path.as_deref(),
        config.as_deref(),
        args,
        detach,
        exec.as_deref(),
        true,
    )
    .await?;

    Ok(())
}

pub async fn script_run_subcommand(
    sandbox: bool,
    build: bool,
    name: String,
    script: String,
    file: Option<PathBuf>,
    detach: bool,
    args: Vec<String>,
) -> MicrosandboxCliResult<()> {
    validate_build_sandbox_conflict(build, sandbox, &script, Some("[NAME]"), Some("<ARGS>"));

    unsupported_build_error(build, &script, Some("[NAME]"));

    let (path, config) = parse_file_path(file);
    sandbox::run(
        &name,
        Some(&script),
        path.as_deref(),
        config.as_deref(),
        args,
        detach,
        None,
        true,
    )
    .await?;

    Ok(())
}

#[allow(clippy::too_many_arguments)]
pub async fn exe_subcommand(
    name: String,
    cpus: Option<u8>,
    memory: Option<u32>,
    volumes: Vec<String>,
    ports: Vec<String>,
    envs: Vec<String>,
    workdir: Option<Utf8UnixPathBuf>,
    scope: Option<String>,
    exec: Option<String>,
    args: Vec<String>,
) -> MicrosandboxCliResult<()> {
    let (image, script) = parse_name_and_script(&name);
    let image = image.parse::<Reference>()?;

    if matches!((script, &exec), (Some(_), Some(_))) {
        MicrosandboxArgs::command()
            .override_usage(usage("exe", Some("[NAME[~SCRIPT]]"), Some("<ARGS>")))
            .error(
                ErrorKind::ArgumentConflict,
                format!(
                    "cannot specify both a script and an `{}` option.",
                    "--exec".placeholder()
                ),
            )
            .exit();
    }

    sandbox::run_temp(
        &image,
        script,
        cpus,
        memory,
        volumes,
        ports,
        envs,
        workdir,
        scope,
        exec.as_deref(),
        args,
        true,
    )
    .await?;

    Ok(())
}

pub async fn up_subcommand(
    sandbox: bool,
    build: bool,
    names: Vec<String>,
    file: Option<PathBuf>,
    detach: bool,
) -> MicrosandboxCliResult<()> {
    validate_build_sandbox_conflict(build, sandbox, "up", Some("[NAMES]"), None);
    unsupported_build_error(build, "up", Some("[NAMES]"));

    let (path, config) = parse_file_path(file);
    orchestra::up(names, path.as_deref(), config.as_deref(), detach).await?;

    Ok(())
}

pub async fn down_subcommand(
    sandbox: bool,
    build: bool,
    names: Vec<String>,
    file: Option<PathBuf>,
) -> MicrosandboxCliResult<()> {
    validate_build_sandbox_conflict(build, sandbox, "down", Some("[NAMES]"), None);
    unsupported_build_error(build, "down", Some("[NAMES]"));

    let (path, config) = parse_file_path(file);
    orchestra::down(names, path.as_deref(), config.as_deref()).await?;

    Ok(())
}

/// Handle the status subcommand to show resource usage stats for specified sandboxes
pub async fn status_subcommand(
    sandbox: bool,
    build: bool,
    names: Vec<String>,
    file: Option<PathBuf>,
) -> MicrosandboxCliResult<()> {
    validate_build_sandbox_conflict(build, sandbox, "status", Some("[NAMES]"), None);
    unsupported_build_error(build, "status", Some("[NAMES]"));

    let (path, config) = parse_file_path(file);
    orchestra::show_status(&names, path.as_deref(), config.as_deref()).await?;

    Ok(())
}

/// Handle the `log` subcommand to show logs for a specific sandbox
pub async fn log_subcommand(
    sandbox: bool,
    build: bool,
    name: String,
    file: Option<PathBuf>,
    follow: bool,
    tail: Option<usize>,
) -> MicrosandboxCliResult<()> {
    validate_build_sandbox_conflict(build, sandbox, "log", Some("[NAME]"), None);
    unsupported_build_error(build, "log", Some("[NAME]"));

    // Check if tail command exists when follow mode is requested
    if follow {
        let tail_exists = which::which("tail").is_ok();
        if !tail_exists {
            MicrosandboxArgs::command()
                .override_usage(usage("log", Some("[NAME]"), None))
                .error(
                    ErrorKind::InvalidValue,
                    "'tail' command not found. Please install it to use the follow (-f) option.",
                )
                .exit();
        }
    }

    let (project_dir, config_file) = parse_file_path(file);
    menv::show_log(
        project_dir.as_ref(),
        config_file.as_deref(),
        &name,
        follow,
        tail,
    )
    .await?;

    Ok(())
}

/// Handles the clean subcommand, which removes the .menv directory from a project
pub async fn clean_subcommand(
    _sandbox: bool,
    name: Option<String>,
    user: bool,
    all: bool,
    file: Option<PathBuf>,
    force: bool,
) -> MicrosandboxCliResult<()> {
    if user || all {
        // User-level cleanup - clean the microsandbox home directory
        home::clean(force).await?;
        tracing::info!("user microsandbox home directory cleaned");

        // User-level cleanup - clean the user scripts (MSB-ALIAS)
        if force {
            toolchain::clean().await?;
        }

        tracing::info!("user microsandbox scripts cleaned");
    }

    if !user || all {
        // Local project cleanup
        if let Some(sandbox_name) = name {
            // Clean specific sandbox if sandbox name is provided
            tracing::info!("cleaning sandbox: {}", sandbox_name);
            let (path, config) = parse_file_path(file);
            menv::clean(path, config.as_deref(), Some(&sandbox_name), force).await?;
        } else {
            // Clean the entire .menv directory if no sandbox is specified
            tracing::info!("cleaning entire project environment");
            let (path, config) = parse_file_path(file);
            menv::clean(path, config.as_deref(), None, force).await?;
        }
    }

    Ok(())
}

pub async fn server_start_subcommand(
    host: Option<String>,
    port: Option<u16>,
    project_dir: Option<PathBuf>,
    dev_mode: bool,
    key: Option<String>,
    detach: bool,
    reset_key: bool,
) -> MicrosandboxCliResult<()> {
    microsandbox_server::start(key, host, port, project_dir, dev_mode, detach, reset_key).await?;
    Ok(())
}

pub async fn server_stop_subcommand() -> MicrosandboxServerResult<()> {
    microsandbox_server::stop().await?;
    Ok(())
}

pub async fn server_keygen_subcommand(expire: Option<String>) -> MicrosandboxCliResult<()> {
    // Convert the string duration to chrono::Duration
    let duration = if let Some(expire_str) = expire {
        Some(parse_duration_string(&expire_str)?)
    } else {
        None
    };

    microsandbox_server::keygen(duration).await?;

    Ok(())
}

/// Handles the server ssh subcommand, which spawns a new SSH session into a sandbox
pub async fn server_ssh_subcommand(_sandbox: bool, _name: String) -> MicrosandboxCliResult<()> {
    MicrosandboxArgs::command()
        .override_usage(usage("ssh", Some("[NAME]"), None))
        .error(
            ErrorKind::InvalidValue,
            "SSH functionality is not yet implemented",
        )
        .exit();
}

/// Handle the self subcommand, which manages microsandbox itself
pub async fn self_subcommand(action: SelfAction) -> MicrosandboxCliResult<()> {
    match action {
        SelfAction::Upgrade => {
            tracing::error!("upgrade functionality is not yet implemented");
            return Ok(());
        }
        SelfAction::Uninstall => {
            // Clean the home directory first
            home::clean(true).await?;

            // Clean user scripts
            toolchain::clean().await?;

            // Then uninstall the binaries and libraries
            toolchain::uninstall().await?;
        }
    }

    Ok(())
}

/// Handles the install subcommand for installing sandbox scripts from images
#[allow(clippy::too_many_arguments)]
pub async fn install_subcommand(
    name: String,
    alias: Option<String>,
    cpus: Option<u8>,
    memory: Option<u32>,
    volumes: Vec<String>,
    ports: Vec<String>,
    envs: Vec<String>,
    workdir: Option<Utf8UnixPathBuf>,
    scope: Option<String>,
    exec: Option<String>,
    args: Vec<String>,
) -> MicrosandboxCliResult<()> {
    let (image, script) = parse_name_and_script(&name);
    let image = image.parse::<Reference>()?;

    if matches!((script, &exec), (Some(_), Some(_))) {
        MicrosandboxArgs::command()
            .override_usage(usage(
                "install",
                Some("[NAME[~SCRIPT]] [ALIAS]"),
                Some("<ARGS>"),
            ))
            .error(
                ErrorKind::ArgumentConflict,
                format!(
                    "cannot specify both a script and an `{}` option.",
                    "--exec".placeholder()
                ),
            )
            .exit();
    }

    // If extra args are provided, show a warning as they will be ignored during install
    if !args.is_empty() {
        tracing::warn!(
            "Extra arguments will be ignored during install. They will be passed to the sandbox when the alias is used."
        );
    }

    home::install(
        &image,
        script,
        alias.as_deref(),
        cpus,
        memory,
        volumes,
        ports,
        envs,
        workdir,
        scope,
        exec.as_deref(),
        args,
        true,
    )
    .await?;

    Ok(())
}

/// Handles the uninstall subcommand for removing installed script aliases
pub async fn uninstall_subcommand(script: Option<String>) -> MicrosandboxCliResult<()> {
    match script {
        Some(script_name) => {
            // Uninstall the specified script
            home::uninstall(&script_name).await?;
            tracing::info!("Successfully uninstalled script: {}", script_name);
        }
        None => {
            // No script specified, print error message
            MicrosandboxArgs::command()
                .override_usage(usage("uninstall", Some("[SCRIPT]"), None))
                .error(
                    ErrorKind::InvalidValue,
                    "Please specify the name of the script to uninstall.",
                )
                .exit();
        }
    }

    Ok(())
}

pub async fn server_log_subcommand(
    _sandbox: bool,
    name: String,
    follow: bool,
    tail: Option<usize>,
) -> MicrosandboxCliResult<()> {
    // Use the project directory
    let project_path = env::get_microsandbox_home_path().join(PROJECTS_SUBDIR);

    if !project_path.exists() {
        return Err(MicrosandboxCliError::NotFound(
            "Project directory not found".to_string(),
        ));
    }

    // Reuse the same log viewing functionality
    menv::show_log(Some(project_path), None, &name, follow, tail).await?;

    Ok(())
}

pub async fn server_list_subcommand() -> MicrosandboxCliResult<()> {
    // Get the project directory
    let microsandbox_home_path = env::get_microsandbox_home_path();
    let project_path = microsandbox_home_path.join(PROJECTS_SUBDIR);

    if !project_path.exists() {
        return Err(MicrosandboxCliError::NotFound(
            "Project directory not found".to_string(),
        ));
    }

    // Load configuration from the project directory
    let config_result = config::load_config(Some(project_path.as_path()), None).await;
    match config_result {
        Ok((config, _, _)) => {
            // Use the common show_list function to display sandboxes
            menv::show_list(config.get_sandboxes());
        }
        Err(err) => {
            return Err(MicrosandboxCliError::ConfigError(format!(
                "Failed to load configuration: {}",
                err
            )));
        }
    }

    Ok(())
}

pub async fn server_status_subcommand(
    _sandbox: bool,
    names: Vec<String>,
) -> MicrosandboxCliResult<()> {
    // Get the project directory
    let microsandbox_home_path = env::get_microsandbox_home_path();
    let project_path = microsandbox_home_path.join(PROJECTS_SUBDIR);

    if !project_path.exists() {
        return Err(MicrosandboxCliError::NotFound(
            "Project directory not found".to_string(),
        ));
    }

    orchestra::show_status(&names, Some(project_path.as_path()), None).await?;

    Ok(())
}

/// Handle `msb login` by resolving credentials and persisting them for a registry.
///
/// The registry is resolved from CLI input first, then environment defaults.
/// Credentials can come from CLI flags or environment variables and are stored
/// without remote validation.
pub async fn login_subcommand(
    registry: Option<String>,
    username: Option<String>,
    password_stdin: bool,
    token: Option<String>,
) -> MicrosandboxCliResult<()> {
    let registry = resolve_registry_host(registry);
    let cli_password = if password_stdin {
        Some(read_password_from_stdin().await?)
    } else {
        None
    };
    let stored_credentials = resolve_explicit_credentials(username, cli_password, token)?;
    let saved_message = match &stored_credentials {
        MsbRegistryAuth::Basic { .. } => "credentials",
        MsbRegistryAuth::Token { .. } => "token",
    };

    CredentialStore::store_registry_credentials(&registry, stored_credentials)
        .map_err(|err| MicrosandboxCliError::ConfigError(err.to_string()))?;
    tracing::info!(
        "{} saved for registry {} (not validated)",
        saved_message,
        registry
    );

    Ok(())
}

/// Handle `msb logout` by removing stored registry credentials.
///
/// Only credentials for the resolved registry host are deleted.
pub async fn logout_subcommand(registry: Option<String>) -> MicrosandboxCliResult<()> {
    let registry = resolve_registry_host(registry);
    let removed = CredentialStore::remove_registry_credentials(&registry)
        .map_err(|err| MicrosandboxCliError::ConfigError(err.to_string()))?;
    if removed {
        tracing::info!("removed stored credentials for registry {}", registry);
    } else {
        tracing::info!("no stored credentials found for registry {}", registry);
    }

    Ok(())
}

pub async fn push_subcommand(_image: bool, _name: String) -> MicrosandboxCliResult<()> {
    tracing::error!("push functionality is not yet implemented");
    Ok(())
}

//--------------------------------------------------------------------------------------------------
// Functions: Common Errors
//--------------------------------------------------------------------------------------------------

fn unsupported_build_error(build: bool, command: &str, positional_placeholder: Option<&str>) {
    if build {
        MicrosandboxArgs::command()
            .override_usage(usage(command, positional_placeholder, None))
            .error(
                ErrorKind::ArgumentConflict,
                format!(
                    "`{}` and `{}` flags are not yet supported.",
                    "--build".literal(),
                    "-b".literal()
                ),
            )
            .exit();
    }
}

//--------------------------------------------------------------------------------------------------
// Functions: Helpers
//--------------------------------------------------------------------------------------------------

fn usage(command: &str, positional_placeholder: Option<&str>, varargs: Option<&str>) -> String {
    let mut usage = format!(
        "{} {} {} {}",
        "msb".literal(),
        command.literal(),
        "[OPTIONS]".placeholder(),
        positional_placeholder.unwrap_or("").placeholder()
    );

    if let Some(varargs) = varargs {
        usage.push_str(&format!(
            " {} {} {}",
            "[--".literal(),
            format!("{}...", varargs).placeholder(),
            "]".literal()
        ));
    }

    usage
}

fn parse_name_and_script(name_and_script: &str) -> (&str, Option<&str>) {
    let (name, script) = match name_and_script.split_once(SANDBOX_SCRIPT_SEPARATOR) {
        Some((name, script)) => (name, Some(script)),
        None => (name_and_script, None),
    };

    (name, script)
}

//--------------------------------------------------------------------------------------------------
// Functions: Login Helpers
//--------------------------------------------------------------------------------------------------

/// Resolve the effective registry host from CLI and environment configuration.
///
/// Resolution order is: explicit `registry` argument, `MSB_REGISTRY_HOST`,
/// then the default OCI registry. The returned host is normalized.
fn resolve_registry_host(registry: Option<String>) -> String {
    let host = registry.unwrap_or_else(env::get_oci_registry);
    normalize_registry_host(&host)
}

/// Normalize a given host url string
///
/// This for avoiding common user input issues like including protocol or trailing slashes.
pub fn normalize_registry_host(host: &str) -> String {
    let mut normalized = host.trim().to_lowercase();

    if let Some(stripped) = normalized.strip_prefix("https://") {
        normalized = stripped.to_string();
    } else if let Some(stripped) = normalized.strip_prefix("http://") {
        normalized = stripped.to_string();
    }

    return normalized.trim_end_matches('/').to_string();
}

/// Read a password from stdin and trim trailing newlines.
///
/// Returns an error when stdin is empty after trimming.
async fn read_password_from_stdin() -> MicrosandboxCliResult<String> {
    let mut stdin = io::stdin();
    read_password_from_reader(&mut stdin).await
}

/// Read a password from any async reader and trim trailing newlines.
async fn read_password_from_reader<R>(reader: &mut R) -> MicrosandboxCliResult<String>
where
    R: AsyncRead + Unpin,
{
    let mut input = String::new();
    reader.read_to_string(&mut input).await?;
    let password = input.trim_end_matches(&['\n', '\r'][..]).to_string();
    if password.is_empty() {
        return Err(MicrosandboxCliError::InvalidArgument(
            "password provided via stdin is empty".to_string(),
        ));
    }
    Ok(password)
}

/// Parse a file path into project path and config file name.
///
/// If the file path is a directory, it is treated as the project path.
/// If the file path is a file, its parent directory is treated as the project path
/// and its name is treated as the config file.
/// If the file has no parent directory (e.g., a simple filename like "config.yaml")
/// or its parent is an empty string, the current directory is used as the project path.
///
/// # Arguments
///
/// * `file` - Optional file path that could be either a directory or a file
///
/// # Returns
///
/// Tuple of (Option<PathBuf>, Option<String>) for project path and config file name
pub fn parse_file_path(file: Option<PathBuf>) -> (Option<PathBuf>, Option<String>) {
    let (project_path, config_name) = match file {
        Some(file_path) => {
            if file_path.is_dir() {
                tracing::debug!("File path is a directory: {:?}", file_path);
                // If it's a directory, it's the project path
                (Some(file_path), None)
            } else {
                // Get the config file name
                let config_name = file_path
                    .file_name()
                    .and_then(|name| name.to_str())
                    .map(String::from);

                // Get the parent directory
                let parent = file_path.parent();

                // Handle the cases:
                // 1. No parent (None)
                // 2. Empty parent (Some(""))
                // 3. Valid parent directory
                let project_path = match parent {
                    Some(p) if p.as_os_str().is_empty() => {
                        // Parent is empty string, use current directory
                        Some(PathBuf::from("."))
                    }
                    Some(p) => {
                        // Valid parent directory
                        Some(PathBuf::from(p))
                    }
                    None => {
                        // No parent, use current directory
                        Some(PathBuf::from("."))
                    }
                };

                (project_path, config_name)
            }
        }
        None => (None, None),
    };

    (project_path, config_name)
}

/// Parse a duration string like "1s", "1m", "3h", "2d" into a chrono::Duration
fn parse_duration_string(duration_str: &str) -> MicrosandboxCliResult<chrono::Duration> {
    let duration_str = duration_str.trim();

    if duration_str.is_empty() {
        return Err(MicrosandboxCliError::InvalidArgument(
            "Empty duration string".to_string(),
        ));
    }

    // Extract the numeric value and unit
    let (value_str, unit) = duration_str.split_at(
        duration_str
            .chars()
            .position(|c| !c.is_ascii_digit())
            .unwrap_or(duration_str.len()),
    );

    if value_str.is_empty() {
        return Err(MicrosandboxCliError::InvalidArgument(format!(
            "Invalid duration: {}. No numeric value found.",
            duration_str
        )));
    }

    let value: i64 = value_str.parse().map_err(|_| {
        MicrosandboxCliError::InvalidArgument(format!(
            "Invalid numeric value in duration: {}",
            value_str
        ))
    })?;

    match unit {
        "s" => Ok(chrono::Duration::seconds(value)),
        "m" => Ok(chrono::Duration::minutes(value)),
        "h" => Ok(chrono::Duration::hours(value)),
        "d" => Ok(chrono::Duration::days(value)),
        "w" => Ok(chrono::Duration::weeks(value)),
        "mo" => Ok(chrono::Duration::days(value * 30)), // Approximate
        "y" => Ok(chrono::Duration::days(value * 365)), // Approximate
        "" => Ok(chrono::Duration::hours(value)),       // Default to hours if no unit specified
        _ => Err(MicrosandboxCliError::InvalidArgument(format!(
            "Invalid duration unit: {}. Expected one of: s, m, h, d, w, mo, y",
            unit
        ))),
    }
}

/// Validate that both `--build` and `--sandbox` flags are not specified together.
///
/// # Arguments
///
/// * `build` - Whether the --build flag is set
/// * `sandbox` - Whether the --sandbox flag is set
/// * `command` - The command name for the error message
/// * `positional_placeholder` - Optional positional arguments placeholder for usage
/// * `varargs` - Optional varargs placeholder for usage
fn validate_build_sandbox_conflict(
    build: bool,
    sandbox: bool,
    command: &str,
    positional_placeholder: Option<&str>,
    varargs: Option<&str>,
) {
    if build && sandbox {
        MicrosandboxArgs::command()
            .override_usage(usage(command, positional_placeholder, varargs))
            .error(
                ErrorKind::ArgumentConflict,
                format!(
                    "cannot specify both `{}` and `{}` flags",
                    "--sandbox".literal(),
                    "--build".literal()
                ),
            )
            .exit();
    }
}

//--------------------------------------------------------------------------------------------------
// Tests
//--------------------------------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::Mutex;
    use tokio::io::AsyncWriteExt;

    static ENV_LOCK: Mutex<()> = Mutex::new(());

    fn lock_env() -> std::sync::MutexGuard<'static, ()> {
        ENV_LOCK.lock().unwrap_or_else(|err| err.into_inner())
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
    fn resolve_registry_host_prefers_cli_value() {
        let _lock = lock_env();
        let _host = EnvGuard::set(env::MSB_REGISTRY_HOST_ENV_VAR, "env.example.com");
        let resolved = resolve_registry_host(Some("cli.example.com".to_string()));
        assert_eq!(resolved, "cli.example.com");
    }

    #[test]
    fn resolve_registry_host_uses_env_when_cli_missing() {
        let _lock = lock_env();
        let _host = EnvGuard::set(env::MSB_REGISTRY_HOST_ENV_VAR, "https://Env.Example.com/");
        let resolved = resolve_registry_host(None);
        assert_eq!(resolved, "env.example.com");
    }

    #[test]
    fn resolve_explicit_auth_prefers_token() {
        let creds = resolve_explicit_credentials(None, None, Some("cli-token".to_string()))
            .expect("resolve creds");
        assert!(matches!(
            creds,
            MsbRegistryAuth::Token { token } if token == "cli-token"
        ));
    }

    #[test]
    fn resolve_explicit_auth_accepts_basic_auth() {
        let creds =
            resolve_explicit_credentials(Some("user".to_string()), Some("pass".to_string()), None)
                .expect("resolve creds");
        assert!(matches!(
            creds,
            MsbRegistryAuth::Basic { username, password }
                if username == "user" && password == "pass"
        ));
    }

    #[test]
    fn resolve_explicit_auth_errors_for_conflicting_inputs() {
        let result = resolve_explicit_credentials(
            Some("user".to_string()),
            Some("pass".to_string()),
            Some("token".to_string()),
        );
        assert!(matches!(
            result,
            Err(microsandbox_core::MicrosandboxError::InvalidArgument(_))
        ));
    }

    #[test]
    fn resolve_explicit_auth_errors_when_missing() {
        let result = resolve_explicit_credentials(None, None, None);
        assert!(matches!(
            result,
            Err(microsandbox_core::MicrosandboxError::InvalidArgument(_))
        ));
    }

    #[tokio::test]
    async fn read_password_from_stdin_trims_trailing_newline() {
        let (mut writer, mut reader) = tokio::io::duplex(64);
        writer.write_all(b"secret\n").await.expect("write");
        drop(writer);

        let password = read_password_from_reader(&mut reader)
            .await
            .expect("password");
        assert_eq!(password, "secret");
    }

    #[tokio::test]
    async fn read_password_from_stdin_errors_on_empty_input() {
        let (mut writer, mut reader) = tokio::io::duplex(64);
        writer.write_all(b"\n").await.expect("write");
        drop(writer);

        let result = read_password_from_reader(&mut reader).await;
        assert!(matches!(
            result,
            Err(MicrosandboxCliError::InvalidArgument(_))
        ));
    }

    #[tokio::test]
    async fn read_password_from_stdin_trims_trailing_carriage_return() {
        let (mut writer, mut reader) = tokio::io::duplex(64);
        writer.write_all(b"secret\r").await.expect("write");
        drop(writer);

        let password = read_password_from_reader(&mut reader)
            .await
            .expect("password");
        assert_eq!(password, "secret");
    }

    #[tokio::test]
    async fn read_password_from_stdin_trims_trailing_crlf() {
        let (mut writer, mut reader) = tokio::io::duplex(64);
        writer.write_all(b"secret\r\n").await.expect("write");
        drop(writer);

        let password = read_password_from_reader(&mut reader)
            .await
            .expect("password");
        assert_eq!(password, "secret");
    }

    #[tokio::test]
    async fn read_password_from_stdin_trims_multiple_trailing_newlines() {
        let (mut writer, mut reader) = tokio::io::duplex(64);
        writer.write_all(b"secret\n\n\r\n").await.expect("write");
        drop(writer);

        let password = read_password_from_reader(&mut reader)
            .await
            .expect("password");
        assert_eq!(password, "secret");
    }

    #[tokio::test]
    async fn read_password_from_stdin_errors_on_empty_input_with_carriage_return() {
        let (mut writer, mut reader) = tokio::io::duplex(64);
        writer.write_all(b"\r").await.expect("write");
        drop(writer);

        let result = read_password_from_reader(&mut reader).await;
        assert!(matches!(
            result,
            Err(MicrosandboxCliError::InvalidArgument(_))
        ));
    }

    #[tokio::test]
    async fn read_password_from_stdin_errors_on_empty_input_with_crlf() {
        let (mut writer, mut reader) = tokio::io::duplex(64);
        writer.write_all(b"\r\n").await.expect("write");
        drop(writer);

        let result = read_password_from_reader(&mut reader).await;
        assert!(matches!(
            result,
            Err(MicrosandboxCliError::InvalidArgument(_))
        ));
    }
}
