//! Request handlers for the microsandbox server.
//!
//! This module implements:
//! - API endpoint handlers
//! - Request processing logic
//! - Response formatting
//!
//! The module provides:
//! - Handler functions for API routes
//! - Request validation and processing
//! - Response generation and error handling

use axum::{
    Json,
    body::Body,
    debug_handler,
    extract::{Path, State},
    http::{Request, StatusCode},
    response::{IntoResponse, Response},
};
use microsandbox_core::management::{menv, orchestra};
use microsandbox_utils::{DEFAULT_CONFIG, DEFAULT_PORTAL_GUEST_PORT, MICROSANDBOX_CONFIG_FILENAME};
use reqwest;
use serde_json::{self, json};
use serde_yaml;
use std::path::{Path as StdPath, PathBuf};
use tokio::{
    fs as tokio_fs,
    time::{Duration, sleep, timeout},
};
use tracing::{debug, trace, warn};

use crate::{
    SandboxStatus, SandboxStatusResponse, ServerResult,
    error::ServerError,
    mcp, middleware,
    payload::{
        JSONRPC_VERSION, JsonRpcError, JsonRpcRequest, JsonRpcResponse,
        JsonRpcResponseOrNotification, RegularMessageResponse, SandboxMetricsGetParams,
        SandboxStartParams, SandboxStopParams,
    },
    state::AppState,
};

//--------------------------------------------------------------------------------------------------
// Functions: REST API Handlers
//--------------------------------------------------------------------------------------------------

/// Handler for health check
pub async fn health() -> ServerResult<impl IntoResponse> {
    Ok((
        StatusCode::OK,
        Json(RegularMessageResponse {
            message: "Service is healthy".to_string(),
        }),
    ))
}

//--------------------------------------------------------------------------------------------------
// Functions: JSON-RPC Handlers
//--------------------------------------------------------------------------------------------------

/// Dedicated MCP handler for Model Context Protocol requests
#[debug_handler]
pub async fn mcp_handler(
    State(state): State<AppState>,
    Json(request): Json<JsonRpcRequest>,
) -> ServerResult<impl IntoResponse> {
    debug!(?request, "Received MCP request");
    // Check for required JSON-RPC fields
    if request.jsonrpc != JSONRPC_VERSION {
        let error = JsonRpcError {
            code: -32600,
            message: "Invalid or missing jsonrpc version field".to_string(),
            data: None,
        };
        return Ok(JsonRpcResponseOrNotification::error(
            error,
            request.id.clone(),
        ));
    }

    // Extract the ID before moving the request
    let request_id = request.id.clone();

    // Handle MCP methods directly since all requests to /mcp are MCP requests
    match mcp::handle_mcp_method(state, request).await {
        Ok(response) => {
            // The enum handles both regular responses and notifications
            Ok(response)
        }
        Err(e) => {
            let error = JsonRpcError {
                code: -32603,
                message: format!("MCP method error: {}", e),
                data: None,
            };
            Ok(JsonRpcResponseOrNotification::error(error, request_id))
        }
    }
}

/// Main JSON-RPC handler that dispatches to the appropriate method
#[debug_handler]
pub async fn json_rpc_handler(
    State(state): State<AppState>,
    Json(request): Json<JsonRpcRequest>,
) -> ServerResult<impl IntoResponse> {
    debug!(?request, "Received JSON-RPC request");

    // Check for required JSON-RPC fields
    if request.jsonrpc != JSONRPC_VERSION {
        let error = JsonRpcError {
            code: -32600,
            message: "Invalid or missing jsonrpc version field".to_string(),
            data: None,
        };
        return Ok((
            StatusCode::BAD_REQUEST,
            Json(JsonRpcResponse::error(error, request.id.clone())),
        ));
    }

    let method = request.method.as_str();
    let id = request.id.clone();

    match method {
        // Server specific methods
        "sandbox.start" => {
            // Parse the params into a SandboxStartRequest
            let start_params: SandboxStartParams =
                serde_json::from_value(request.params.clone()).map_err(|e| {
                    ServerError::ValidationError(crate::error::ValidationError::InvalidInput(
                        format!("Invalid params for sandbox.start: {}", e),
                    ))
                })?;

            // Call the sandbox_up_impl function
            let result = sandbox_start_impl(state, start_params).await?;

            // Create JSON-RPC response with success
            Ok((
                StatusCode::OK,
                Json(JsonRpcResponse::success(json!(result), id)),
            ))
        }
        "sandbox.stop" => {
            // Parse the params into a SandboxStopRequest
            let stop_params: SandboxStopParams = serde_json::from_value(request.params.clone())
                .map_err(|e| {
                    ServerError::ValidationError(crate::error::ValidationError::InvalidInput(
                        format!("Invalid params for sandbox.stop: {}", e),
                    ))
                })?;

            // Call the sandbox_down_impl function
            let result = sandbox_stop_impl(state, stop_params).await?;

            // Create JSON-RPC response with success
            Ok((
                StatusCode::OK,
                Json(JsonRpcResponse::success(json!(result), id)),
            ))
        }
        "sandbox.metrics.get" => {
            // Parse the params into a SandboxMetricsGetRequest
            let metrics_params: SandboxMetricsGetParams =
                serde_json::from_value(request.params.clone()).map_err(|e| {
                    ServerError::ValidationError(crate::error::ValidationError::InvalidInput(
                        format!("Invalid params for sandbox.metrics.get: {}", e),
                    ))
                })?;

            // Call the sandbox_get_metrics_impl function with state and request
            let result = sandbox_get_metrics_impl(state.clone(), metrics_params).await?;

            // Create JSON-RPC response with success
            Ok((
                StatusCode::OK,
                Json(JsonRpcResponse::success(json!(result), id)),
            ))
        }

        // Portal-forwarded methods
        "sandbox.repl.run" | "sandbox.command.run" => {
            // Forward these RPC methods to the portal
            match forward_rpc_to_portal(state, request).await {
                Ok((status, json_response)) => Ok((status, json_response)),
                Err(e) => Err(e),
            }
        }

        _ => {
            let error = JsonRpcError {
                code: -32601,
                message: format!("Method not found: {}", method),
                data: None,
            };
            Ok((
                StatusCode::NOT_FOUND,
                Json(JsonRpcResponse::error(error, id)),
            ))
        }
    }
}

/// Forwards the JSON-RPC request to the portal service
pub async fn forward_rpc_to_portal(
    state: AppState,
    request: JsonRpcRequest,
) -> ServerResult<(StatusCode, Json<JsonRpcResponse>)> {
    // Extract sandbox information from request context or method parameters
    // The method will have the format "sandbox.repl.run" etc.
    // The method params will have a sandbox_name parameter

    // Extract the sandbox name from the parameters
    let sandbox_name = if let Some(params) = request.params.as_object() {
        params
            .get("sandbox")
            .and_then(|v| v.as_str())
            .ok_or_else(|| {
                ServerError::ValidationError(crate::error::ValidationError::InvalidInput(
                    "Missing required 'sandbox' parameter for portal request".to_string(),
                ))
            })?
    } else {
        return Err(ServerError::ValidationError(
            crate::error::ValidationError::InvalidInput(
                "Request parameters must be an object containing 'sandbox'".to_string(),
            ),
        ));
    };

    // Get the portal URL specifically for this sandbox
    let portal_url = state.get_portal_url_for_sandbox(sandbox_name).await?;

    // Create a full URL to the portal's JSON-RPC endpoint
    let portal_rpc_url = format!("{}/api/v1/rpc", portal_url);
    // Create a health check URL
    let portal_health_url = format!("{}/health", portal_url);

    debug!("Forwarding RPC to portal: {}", portal_rpc_url);

    // Create an HTTP client
    let client = reqwest::Client::new();

    // Configure connection retry parameters
    // The portal inside the sandbox may take some time to start, so we need to retry
    const MAX_RETRIES: u32 = 300;
    const TIMEOUT_MS: u64 = 50;
    const RETRY_DELAY_MS: u64 = 10;

    // Try to establish a connection to the portal before sending the actual request
    let mut retry_count = 0;
    let mut last_error = None;

    // Keep trying to connect until we succeed or hit max retries
    while retry_count < MAX_RETRIES {
        // Check if portal is available and ready using the health check endpoint
        match client
            .head(&portal_health_url)
            .timeout(Duration::from_millis(TIMEOUT_MS))
            .send()
            .await
        {
            Ok(response) => {
                let status = response.status();
                if status == reqwest::StatusCode::OK {
                    debug!(
                        "Successfully connected to portal after {} retries (status: {})",
                        retry_count, status
                    );
                    break;
                } else if status == reqwest::StatusCode::SERVICE_UNAVAILABLE {
                    last_error = Some(format!("Portal not ready yet (status: {})", status));
                    trace!(
                        "Portal not ready (attempt {}), retrying...",
                        retry_count + 1
                    );
                } else {
                    last_error = Some(format!("Portal returned error status: {}", status));
                    trace!(
                        "Portal connection attempt {} returned {}, retrying...",
                        retry_count + 1,
                        status
                    );
                }
            }
            Err(e) => {
                // Track the error for potential reporting but keep retrying
                last_error = Some(e.to_string());
                trace!("Connection attempt {} failed, retrying...", retry_count + 1);
            }
        }

        // Increment retry counter
        retry_count += 1;

        // Wait before the next retry to give the portal time to start
        sleep(Duration::from_millis(RETRY_DELAY_MS)).await;
    }

    // If we've hit the max retries and still can't connect, report the error
    if retry_count >= MAX_RETRIES {
        let error_msg = if let Some(e) = last_error {
            format!(
                "Failed to connect to portal after {} retries: {}",
                MAX_RETRIES, e
            )
        } else {
            format!("Failed to connect to portal after {} retries", MAX_RETRIES)
        };
        return Err(ServerError::InternalError(error_msg));
    }

    // Forward the request to the portal now that we've verified connectivity
    let response = client
        .post(&portal_rpc_url)
        .json(&request)
        .send()
        .await
        .map_err(|e| {
            ServerError::InternalError(format!("Failed to forward RPC to portal: {}", e))
        })?;

    // Check if the request was successful
    if !response.status().is_success() {
        let status = response.status();
        let error_text = response
            .text()
            .await
            .unwrap_or_else(|_| "Unknown error".to_string());

        return Err(ServerError::InternalError(format!(
            "Portal returned error status {}: {}",
            status, error_text
        )));
    }

    // Parse the JSON-RPC response from the portal
    let portal_response: JsonRpcResponse = response.json().await.map_err(|e| {
        ServerError::InternalError(format!("Failed to parse portal response: {}", e))
    })?;

    // Return the portal's response directly
    Ok((StatusCode::OK, Json(portal_response)))
}

/// Implementation for starting a sandbox
pub async fn sandbox_start_impl(
    state: AppState,
    params: SandboxStartParams,
) -> ServerResult<String> {
    // Validate sandbox name
    validate_sandbox_name(&params.sandbox)?;

    let project_dir = state.get_config().get_project_dir().clone();
    let config_file = MICROSANDBOX_CONFIG_FILENAME;
    let config_path = project_dir.join(config_file);
    let sandbox = &params.sandbox;

    // Create project directory if it doesn't exist
    if !project_dir.exists() {
        tokio_fs::create_dir_all(&project_dir).await.map_err(|e| {
            ServerError::InternalError(format!("Failed to create project directory: {}", e))
        })?;

        // Initialize microsandbox environment
        menv::initialize(Some(project_dir.clone()))
            .await
            .map_err(|e| {
                ServerError::InternalError(format!(
                    "Failed to initialize microsandbox environment: {}",
                    e
                ))
            })?;
    }

    // Check if we have a valid configuration to proceed with
    let has_config_in_request = params
        .config
        .as_ref()
        .and_then(|c| c.image.as_ref())
        .is_some();
    let has_existing_config_file = config_path.exists();

    if !has_config_in_request && !has_existing_config_file {
        return Err(ServerError::ValidationError(
            crate::error::ValidationError::InvalidInput(format!(
                "No configuration provided and no existing configuration found for sandbox '{}'",
                sandbox
            )),
        ));
    }

    // Load or create the config
    let mut config_yaml: serde_yaml::Value;

    // Read or initialize the configuration
    if has_existing_config_file {
        // Read the existing config
        let config_content = tokio_fs::read_to_string(&config_path).await.map_err(|e| {
            ServerError::InternalError(format!("Failed to read config file: {}", e))
        })?;

        // Parse the config as YAML
        config_yaml = serde_yaml::from_str(&config_content).map_err(|e| {
            ServerError::InternalError(format!("Failed to parse config file: {}", e))
        })?;

        // If we're relying on existing config, verify that the sandbox exists in it
        if !has_config_in_request {
            let has_sandbox_config = config_yaml
                .get("sandboxes")
                .and_then(|sandboxes| sandboxes.get(sandbox))
                .is_some();

            if !has_sandbox_config {
                return Err(ServerError::ValidationError(
                    crate::error::ValidationError::InvalidInput(format!(
                        "Sandbox '{}' not found in existing configuration",
                        sandbox
                    )),
                ));
            }
        }
    } else {
        // Create a new config with default values
        if !has_config_in_request {
            return Err(ServerError::ValidationError(
                crate::error::ValidationError::InvalidInput(
                    "No configuration provided and no existing configuration file".to_string(),
                ),
            ));
        }

        // Create default config
        tokio_fs::write(&config_path, DEFAULT_CONFIG)
            .await
            .map_err(|e| {
                ServerError::InternalError(format!("Failed to create config file: {}", e))
            })?;

        // Parse default config
        config_yaml = serde_yaml::from_str(DEFAULT_CONFIG).map_err(|e| {
            ServerError::InternalError(format!("Failed to parse default config: {}", e))
        })?;
    }

    // Ensure sandboxes field exists
    if !config_yaml.is_mapping() {
        config_yaml = serde_yaml::Value::Mapping(serde_yaml::Mapping::new());
    }

    let config_map = config_yaml.as_mapping_mut().unwrap();
    if !config_map.contains_key(serde_yaml::Value::String("sandboxes".to_string())) {
        config_map.insert(
            serde_yaml::Value::String("sandboxes".to_string()),
            serde_yaml::Value::Mapping(serde_yaml::Mapping::new()),
        );
    }

    // Get the sandboxes mapping
    let sandboxes_key = serde_yaml::Value::String("sandboxes".to_string());
    let sandboxes_value = config_map.get_mut(&sandboxes_key).unwrap();

    // Check if sandboxes value is a mapping, if not, replace it with an empty mapping
    if !sandboxes_value.is_mapping() {
        *sandboxes_value = serde_yaml::Value::Mapping(serde_yaml::Mapping::new());
    }

    let sandboxes_map = sandboxes_value.as_mapping_mut().unwrap();

    // If config is provided and we have an image, update the sandbox configuration
    if let Some(config) = &params.config
        && config.image.is_some()
    {
        // Create or update sandbox entry
        let mut sandbox_map = serde_yaml::Mapping::new();

        // Set required image field
        if let Some(image) = &config.image {
            sandbox_map.insert(
                serde_yaml::Value::String("image".to_string()),
                serde_yaml::Value::String(image.clone()),
            );
        }

        // Set optional fields
        if let Some(memory) = config.memory {
            sandbox_map.insert(
                serde_yaml::Value::String("memory".to_string()),
                serde_yaml::Value::Number(serde_yaml::Number::from(memory)),
            );
        }

        if let Some(cpus) = config.cpus {
            sandbox_map.insert(
                serde_yaml::Value::String("cpus".to_string()),
                serde_yaml::Value::Number(serde_yaml::Number::from(cpus)),
            );
        }

        if !config.volumes.is_empty() {
            let volumes_array = config
                .volumes
                .iter()
                .map(|v| serde_yaml::Value::String(v.clone()))
                .collect::<Vec<_>>();
            sandbox_map.insert(
                serde_yaml::Value::String("volumes".to_string()),
                serde_yaml::Value::Sequence(volumes_array),
            );
        }

        if !config.ports.is_empty() {
            let ports_array = config
                .ports
                .iter()
                .map(|p| serde_yaml::Value::String(p.clone()))
                .collect::<Vec<_>>();
            sandbox_map.insert(
                serde_yaml::Value::String("ports".to_string()),
                serde_yaml::Value::Sequence(ports_array),
            );
        }

        if !config.envs.is_empty() {
            let envs_array = config
                .envs
                .iter()
                .map(|e| serde_yaml::Value::String(e.clone()))
                .collect::<Vec<_>>();
            sandbox_map.insert(
                serde_yaml::Value::String("envs".to_string()),
                serde_yaml::Value::Sequence(envs_array),
            );
        }

        if !config.depends_on.is_empty() {
            let depends_on_array = config
                .depends_on
                .iter()
                .map(|d| serde_yaml::Value::String(d.clone()))
                .collect::<Vec<_>>();
            sandbox_map.insert(
                serde_yaml::Value::String("depends_on".to_string()),
                serde_yaml::Value::Sequence(depends_on_array),
            );
        }

        if let Some(workdir) = &config.workdir {
            sandbox_map.insert(
                serde_yaml::Value::String("workdir".to_string()),
                serde_yaml::Value::String(workdir.clone()),
            );
        }

        if let Some(shell) = &config.shell {
            sandbox_map.insert(
                serde_yaml::Value::String("shell".to_string()),
                serde_yaml::Value::String(shell.clone()),
            );
        }

        if !config.scripts.is_empty() {
            let mut scripts_map = serde_yaml::Mapping::new();
            for (script_name, script) in &config.scripts {
                scripts_map.insert(
                    serde_yaml::Value::String(script_name.clone()),
                    serde_yaml::Value::String(script.clone()),
                );
            }
            sandbox_map.insert(
                serde_yaml::Value::String("scripts".to_string()),
                serde_yaml::Value::Mapping(scripts_map),
            );
        }

        if let Some(exec) = &config.exec {
            sandbox_map.insert(
                serde_yaml::Value::String("exec".to_string()),
                serde_yaml::Value::String(exec.clone()),
            );
        }

        // Replace or add the sandbox in the config
        sandboxes_map.insert(
            serde_yaml::Value::String(sandbox.clone()),
            serde_yaml::Value::Mapping(sandbox_map),
        );
    }

    // Assign a port for this sandbox
    let sandbox_key = params.sandbox.clone();
    let port = {
        let mut port_manager = state.get_port_manager().write().await;
        port_manager.assign_port(&sandbox_key).await.map_err(|e| {
            ServerError::InternalError(format!("Failed to assign portal port: {}", e))
        })?
    };

    debug!("Assigned portal port {} to sandbox {}", port, sandbox_key);

    // Get the specific sandbox configuration
    let sandbox_config = sandboxes_map
        .get_mut(serde_yaml::Value::String(sandbox.clone()))
        .ok_or_else(|| {
            ServerError::InternalError(format!("Sandbox '{}' not found in configuration", sandbox))
        })?
        .as_mapping_mut()
        .ok_or_else(|| {
            ServerError::InternalError(format!(
                "Sandbox '{}' configuration is not a mapping",
                sandbox
            ))
        })?;

    // Add or update the portal port mapping
    let guest_port = DEFAULT_PORTAL_GUEST_PORT;
    let portal_port_mapping = format!("{}:{}", port, guest_port);

    let ports_key = serde_yaml::Value::String("ports".to_string());

    if let Some(ports) = sandbox_config.get_mut(&ports_key) {
        if let Some(ports_seq) = ports.as_sequence_mut() {
            // Filter out any existing portal port mappings
            ports_seq.retain(|p| {
                p.as_str()
                    .map(|s| !s.ends_with(&format!(":{}", guest_port)))
                    .unwrap_or(true)
            });

            // Add the new port mapping
            ports_seq.push(serde_yaml::Value::String(portal_port_mapping));
        }
    } else {
        // Create a new ports list with the portal port mapping
        let ports_seq = vec![serde_yaml::Value::String(portal_port_mapping)];
        sandbox_config.insert(ports_key, serde_yaml::Value::Sequence(ports_seq));
    }

    // Write the updated config back to the file
    let updated_config = serde_yaml::to_string(&config_yaml)
        .map_err(|e| ServerError::InternalError(format!("Failed to serialize config: {}", e)))?;

    tokio_fs::write(&config_path, updated_config)
        .await
        .map_err(|e| ServerError::InternalError(format!("Failed to write config file: {}", e)))?;

    // Start the sandbox
    orchestra::up(
        vec![sandbox.clone()],
        Some(&project_dir),
        Some(config_file),
        true,
    )
    .await
    .map_err(|e| {
        ServerError::InternalError(format!("Failed to start sandbox {}: {}", params.sandbox, e))
    })?;

    // Determine if this is a first-time image pull based on config
    let potentially_first_time_pull = if let Some(config) = &params.config {
        config.image.is_some()
    } else {
        false
    };

    // Set appropriate timeout based on whether this might be a first-time image pull
    // Using longer timeout for first-time pulls to allow for image downloading
    let poll_timeout = if potentially_first_time_pull {
        Duration::from_secs(180) // 3 minutes for first-time image pulls
    } else {
        Duration::from_secs(60) // 1 minute for regular starts
    };

    // Wait for the sandbox to actually start running with a timeout
    debug!("Waiting for sandbox {} to start...", sandbox);
    match timeout(
        poll_timeout,
        poll_sandbox_until_running(&params.sandbox, &project_dir, config_file),
    )
    .await
    {
        Ok(result) => match result {
            Ok(_) => {
                debug!("Sandbox {} is now running", sandbox);
                Ok(format!("Sandbox {} started successfully", params.sandbox))
            }
            Err(e) => {
                // The sandbox was started but polling failed for some reason
                warn!("Failed to verify sandbox {} is running: {}", sandbox, e);
                Ok(format!(
                    "Sandbox {} was started, but couldn't verify it's running: {}",
                    params.sandbox, e
                ))
            }
        },
        Err(_) => {
            // Timeout occurred, but we still return success since the sandbox might still be starting
            warn!("Timeout waiting for sandbox {} to start", sandbox);
            Ok(format!(
                "Sandbox {} was started, but timed out waiting for it to be fully running. It may still be initializing.",
                params.sandbox
            ))
        }
    }
}

/// Polls the sandbox until it's verified to be running
async fn poll_sandbox_until_running(
    sandbox_name: &str,
    project_dir: &StdPath,
    config_file: &str,
) -> ServerResult<()> {
    const POLL_INTERVAL: Duration = Duration::from_millis(20);
    const MAX_ATTEMPTS: usize = 2500; // Increased to maintain similar overall timeout period with faster polling

    for attempt in 1..=MAX_ATTEMPTS {
        // Check if the sandbox is running
        let statuses = orchestra::status(
            vec![sandbox_name.to_string()],
            Some(project_dir),
            Some(config_file),
        )
        .await
        .map_err(|e| ServerError::InternalError(format!("Failed to get sandbox status: {}", e)))?;

        // Find our sandbox in the results
        if let Some(status) = statuses.iter().find(|s| s.name == sandbox_name)
            && status.running
        {
            // Sandbox is running, we're done
            debug!(
                "Sandbox {} is running (verified on attempt {})",
                sandbox_name, attempt
            );
            return Ok(());
        }

        // Sleep before the next attempt
        sleep(POLL_INTERVAL).await;
    }

    // If we reach here, we've exceeded our attempt limit
    Err(ServerError::InternalError(format!(
        "Exceeded maximum attempts to verify sandbox {} is running",
        sandbox_name
    )))
}

/// Implementation for stopping a sandbox
pub async fn sandbox_stop_impl(state: AppState, params: SandboxStopParams) -> ServerResult<String> {
    // Validate sandbox name
    validate_sandbox_name(&params.sandbox)?;

    let project_dir = state.get_config().get_project_dir().clone();
    let config_file = MICROSANDBOX_CONFIG_FILENAME;
    let sandbox = &params.sandbox;
    let sandbox_key = params.sandbox.clone();

    // Verify that the project directory exists
    if !project_dir.exists() {
        return Err(ServerError::ValidationError(
            crate::error::ValidationError::InvalidInput(
                "Project directory does not exist".to_string(),
            ),
        ));
    }

    // Verify that the config file exists
    let config_path = project_dir.join(config_file);
    if !config_path.exists() {
        return Err(ServerError::ValidationError(
            crate::error::ValidationError::InvalidInput("Configuration file not found".to_string()),
        ));
    }

    // Stop the sandbox using orchestra::down
    orchestra::down(vec![sandbox.clone()], Some(&project_dir), Some(config_file))
        .await
        .map_err(|e| {
            ServerError::InternalError(format!("Failed to stop sandbox {}: {}", params.sandbox, e))
        })?;

    // Release the assigned port
    {
        let mut port_manager = state.get_port_manager().write().await;
        port_manager.release_port(&sandbox_key).await.map_err(|e| {
            ServerError::InternalError(format!("Failed to release portal port: {}", e))
        })?;
    }

    debug!("Released portal port for sandbox {}", sandbox_key);

    // Return success message
    Ok(format!("Sandbox {} stopped successfully", params.sandbox))
}

/// Implementation for sandbox metrics
pub async fn sandbox_get_metrics_impl(
    state: AppState,
    params: SandboxMetricsGetParams,
) -> ServerResult<SandboxStatusResponse> {
    // Validate sandbox name if provided
    if let Some(sandbox) = &params.sandbox {
        validate_sandbox_name(sandbox)?;
    }

    let project_dir = state.get_config().get_project_dir().clone();

    // Check if the project directory exists
    if !project_dir.exists() {
        return Err(ServerError::InternalError(format!(
            "Project directory '{}' does not exist",
            project_dir.display()
        )));
    }

    // Get metrics filtered by sandbox name if provided
    let sandbox_names = if let Some(sandbox) = &params.sandbox {
        vec![sandbox.clone()]
    } else {
        vec![]
    };

    let mut all_statuses = Vec::new();

    match orchestra::status(sandbox_names, Some(&project_dir), None).await {
        Ok(statuses) => {
            for status in statuses {
                all_statuses.push(SandboxStatus {
                    name: status.name,
                    running: status.running,
                    cpu_usage: status.cpu_usage,
                    memory_usage: status.memory_usage,
                    disk_usage: status.disk_usage,
                });
            }
        }
        Err(e) => {
            return Err(ServerError::InternalError(format!(
                "Error getting metrics: {e}"
            )));
        }
    }

    Ok(SandboxStatusResponse {
        sandboxes: all_statuses,
    })
}

//--------------------------------------------------------------------------------------------------
// Functions: Proxy Handlers
//--------------------------------------------------------------------------------------------------

/// Handler for proxy requests
pub async fn proxy_request(
    State(_state): State<AppState>,
    Path((sandbox, path)): Path<(String, PathBuf)>,
    req: Request<Body>,
) -> ServerResult<impl IntoResponse> {
    // In a real implementation, this would use the middleware::proxy_uri function
    // to determine the target URI and then forward the request

    let path_str = path.display().to_string();

    // Calculate target URI using our middleware function
    let original_uri = req.uri().clone();
    let _target_uri = middleware::proxy_uri(original_uri, &sandbox);

    // In a production system, this handler would forward the request to the target URI
    // For now, we'll just return information about what would be proxied

    let response = format!(
        "Axum Proxy Request\n\nSandbox: {}\nPath: {}\nMethod: {}\nHeaders: {:?}",
        sandbox,
        path_str,
        req.method(),
        req.headers()
    );

    let result = Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "text/plain")
        .body(Body::from(response))
        .unwrap();

    Ok(result)
}

/// Fallback handler for proxy requests
pub async fn proxy_fallback() -> ServerResult<impl IntoResponse> {
    Ok((StatusCode::NOT_FOUND, "Resource not found"))
}

//--------------------------------------------------------------------------------------------------
// Functions: Helpers
//--------------------------------------------------------------------------------------------------

/// Validates a sandbox name
fn validate_sandbox_name(name: &str) -> ServerResult<()> {
    // Check name length
    if name.is_empty() {
        return Err(ServerError::ValidationError(
            crate::error::ValidationError::InvalidInput("Sandbox name cannot be empty".to_string()),
        ));
    }

    if name.len() > 63 {
        return Err(ServerError::ValidationError(
            crate::error::ValidationError::InvalidInput(
                "Sandbox name cannot exceed 63 characters".to_string(),
            ),
        ));
    }

    // Check name characters
    let valid_chars = name
        .chars()
        .all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_');

    if !valid_chars {
        return Err(ServerError::ValidationError(
            crate::error::ValidationError::InvalidInput(
                "Sandbox name can only contain alphanumeric characters, hyphens, or underscores"
                    .to_string(),
            ),
        ));
    }

    // Must start with an alphanumeric character
    if !name.chars().next().unwrap().is_ascii_alphanumeric() {
        return Err(ServerError::ValidationError(
            crate::error::ValidationError::InvalidInput(
                "Sandbox name must start with an alphanumeric character".to_string(),
            ),
        ));
    }

    Ok(())
}
