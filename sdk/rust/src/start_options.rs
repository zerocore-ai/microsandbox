use std::collections::HashMap;

/// Options for starting a sandbox
#[derive(Debug, Clone)]
pub struct StartOptions {
    /// Docker image to use for the sandbox
    pub image: Option<String>,

    /// Memory limit in MB
    pub memory: u32,

    /// CPU limit
    pub cpus: f32,

    /// Volumes to mount
    pub volumes: Vec<String>,

    /// Ports to expose
    pub ports: Vec<String>,

    /// Environment variables to use
    pub envs: Vec<String>,

    /// Sandboxes to depend on
    pub depends_on: Vec<String>,

    /// Working directory to use
    pub workdir: Option<String>,

    /// Shell to use
    pub shell: Option<String>,

    /// Scripts that can be run
    pub scripts: HashMap<String, String>,

    /// Exec command to run
    pub exec: Option<String>,

    /// Maximum time in seconds to wait for the sandbox to start
    pub timeout: f32,
}

impl Default for StartOptions {
    fn default() -> Self {
        Self {
            image: None,
            memory: 512,
            cpus: 1.0,
            volumes: Vec::new(),
            ports: Vec::new(),
            envs: Vec::new(),
            depends_on: Vec::new(),
            workdir: None,
            shell: None,
            scripts: HashMap::new(),
            exec: None,
            timeout: 180.0,
        }
    }
}
