use std::path::PathBuf;

use clap::Parser;
use microsandbox_utils::{DEFAULT_SERVER_HOST, DEFAULT_SERVER_PORT};

use crate::styles;

//--------------------------------------------------------------------------------------------------
// Types
//--------------------------------------------------------------------------------------------------

/// Arguments for the msbserver command
#[derive(Debug, Parser)]
#[command(name = "msbserver", author, styles=styles::styles())]
pub struct MsbserverArgs {
    /// Secret key used for JWT token generation and validation
    #[arg(short = 'k', long = "key")]
    pub key: Option<String>,

    /// Host address to listen on
    #[arg(long, default_value = DEFAULT_SERVER_HOST)]
    pub host: String,

    /// Port number to listen on
    #[arg(long, default_value_t = DEFAULT_SERVER_PORT)]
    pub port: u16,

    /// Project directory for storing sandbox configurations and state
    #[arg(short = 'p', long = "path")]
    pub project_dir: Option<PathBuf>,

    /// Run in development mode
    #[arg(long = "dev", default_value_t = false)]
    pub dev_mode: bool,
}
