//! Middleware components for the microsandbox server.
//!
//! This module handles:
//! - Request/response middleware
//! - Authentication and authorization
//! - Request tracing and logging
//! - Error handling
//!
//! The module provides:
//! - Middleware components for common operations
//! - Authentication middleware for API security
//! - Logging and tracing middleware

use axum::{
    body::Body,
    extract::State,
    http::{HeaderMap, Request, StatusCode, Uri},
    middleware::Next,
    response::IntoResponse,
};
use jsonwebtoken::{Algorithm, DecodingKey, Validation, decode};

use crate::{
    Claims,
    config::PROXY_AUTH_HEADER,
    error::{AuthenticationError, ServerError},
    management::API_KEY_PREFIX,
    state::AppState,
};

//--------------------------------------------------------------------------------------------------
// Middleware Functions
//--------------------------------------------------------------------------------------------------

/// Proxy middleware for forwarding requests to a target service
pub async fn proxy_middleware(
    State(_state): State<AppState>,
    req: Request<Body>,
    next: Next,
) -> impl IntoResponse {
    // Default to passing the request to the next handler
    // This middleware can be extended to implement actual proxying logic
    next.run(req).await
}

/// Convert a URI to a proxied URI targeting a sandbox
pub fn proxy_uri(original_uri: Uri, sandbox_name: &str) -> Uri {
    // In a real implementation, you would:
    // 1. Look up the sandbox's address from a registry or state
    // 2. Construct a new URI that points to the sandbox
    // 3. Return the new URI for proxying

    // For demonstration purposes, we'll construct a simple URI
    // In production, you would get this from a sandbox registry
    let target_host = format!("sandbox-{}.internal", sandbox_name);

    let uri_string = if let Some(path_and_query) = original_uri.path_and_query() {
        format!("http://{}:{}{}", target_host, 8080, path_and_query)
    } else {
        format!("http://{}:{}/", target_host, 8080)
    };

    // Try to parse the string into a URI
    // In case of errors, fallback to a default URI
    uri_string
        .parse()
        .unwrap_or_else(|_| "http://localhost:8080/".parse().unwrap())
}

/// Log incoming requests
pub async fn logging_middleware(
    req: Request<Body>,
    next: Next,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let method = req.method().clone();
    let uri = req.uri().clone();

    // Log the request
    tracing::info!("Request: {} {}", method, uri);

    // Process the request
    let response = next.run(req).await;

    // Log the response
    tracing::info!("Response: {} {}: {}", method, uri, response.status());

    Ok(response)
}

/// Authentication middleware for verifying API keys
pub async fn auth_middleware(
    State(state): State<AppState>,
    req: Request<Body>,
    next: Next,
) -> Result<impl IntoResponse, ServerError> {
    // Skip auth in dev mode if configured
    if *state.get_config().get_dev_mode() {
        return Ok(next.run(req).await);
    }

    // Extract API key from authorization header
    let api_key = extract_api_key_from_headers(req.headers())?;

    // Validate the token
    validate_token(&api_key, &state)?;

    // If everything is valid, continue with the request
    Ok(next.run(req).await)
}

/// Smart authentication middleware for MCP requests
/// All methods require valid token authentication
pub async fn mcp_smart_auth_middleware(
    State(state): State<AppState>,
    req: Request<Body>,
    next: Next,
) -> Result<impl IntoResponse, ServerError> {
    // Skip auth in dev mode if configured
    if *state.get_config().get_dev_mode() {
        return Ok(next.run(req).await);
    }

    // Extract API key from authorization header
    let api_key = extract_api_key_from_headers(req.headers())?;

    // Validate the token
    validate_token(&api_key, &state)?;

    // If everything is valid, continue with the request
    Ok(next.run(req).await)
}

//--------------------------------------------------------------------------------------------------
// Helper Functions
//--------------------------------------------------------------------------------------------------

/// Extract API key from request headers
fn extract_api_key_from_headers(headers: &HeaderMap) -> Result<String, ServerError> {
    // First check the Proxy-Authorization header
    if let Some(auth_header) = headers.get(PROXY_AUTH_HEADER) {
        let auth_value = auth_header.to_str().map_err(|_| {
            ServerError::Authentication(AuthenticationError::InvalidCredentials(
                "Invalid authorization header format".to_string(),
            ))
        })?;

        // Check if it has the Bearer prefix
        if let Some(token) = auth_value.strip_prefix("Bearer ") {
            return Ok(token.to_string());
        }

        // Or if it's just the raw token
        return Ok(auth_value.to_string());
    }

    // Then check standard Authorization header
    if let Some(auth_header) = headers.get("Authorization") {
        let auth_value = auth_header.to_str().map_err(|_| {
            ServerError::Authentication(AuthenticationError::InvalidCredentials(
                "Invalid authorization header format".to_string(),
            ))
        })?;

        // Check if it has the Bearer prefix
        if let Some(token) = auth_value.strip_prefix("Bearer ") {
            return Ok(token.to_string());
        }

        // Or if it's just the raw token
        return Ok(auth_value.to_string());
    }

    Err(ServerError::Authentication(
        AuthenticationError::InvalidCredentials("Missing authorization header".to_string()),
    ))
}

/// Convert a custom API key back to a standard JWT format
fn convert_api_key_to_jwt(api_key: &str) -> Result<String, ServerError> {
    // Check if the API key has the expected prefix
    if !api_key.starts_with(API_KEY_PREFIX) {
        return Err(ServerError::Authentication(
            AuthenticationError::InvalidCredentials(
                "Invalid API key format: missing prefix".to_string(),
            ),
        ));
    }

    // Remove the prefix and return the original JWT
    Ok(api_key[API_KEY_PREFIX.len()..].to_string())
}

/// Get the server key from the AppState config
fn get_server_key(state: &AppState) -> Result<String, ServerError> {
    // Get the key from the config - we already know we're not in dev mode
    // by the time this function is called
    match state.get_config().get_key() {
        Some(key) => Ok(key.clone()),
        None => Err(ServerError::Authentication(
            AuthenticationError::InvalidCredentials(
                "Server key not found in configuration".to_string(),
            ),
        )),
    }
}

/// Validate the token
fn validate_token(api_key: &str, state: &AppState) -> Result<Claims, ServerError> {
    // Convert API key back to JWT format
    let jwt = convert_api_key_to_jwt(api_key)?;

    // Get server key for validation
    let server_key = get_server_key(state)?;

    // Decode and validate the JWT
    let token_data = decode::<Claims>(
        &jwt,
        &DecodingKey::from_secret(server_key.as_bytes()),
        &Validation::new(Algorithm::HS256),
    )
    .map_err(|e| {
        let error_message = match e.kind() {
            jsonwebtoken::errors::ErrorKind::ExpiredSignature => "Token expired".to_string(),
            jsonwebtoken::errors::ErrorKind::InvalidSignature => {
                "Invalid token signature".to_string()
            }
            _ => format!("Token validation error: {}", e),
        };
        ServerError::Authentication(AuthenticationError::InvalidToken(error_message))
    })?;

    Ok(token_data.claims)
}
