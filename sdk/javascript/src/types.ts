/**
 * Common types and interfaces for the Microsandbox TypeScript SDK
 */

/**
 * Options for creating a sandbox
 */
export interface SandboxOptions {
  /**
   * URL of the Microsandbox server
   */
  serverUrl?: string;

  /**
   * Name for the sandbox
   */
  name?: string;

  /**
   * API key for Microsandbox server authentication
   */
  apiKey?: string;

  /**
   * Docker image to use for the sandbox
   */
  image?: string;

  /**
   * Memory limit in MB
   */
  memory?: number;

  /**
   * CPU limit (will be rounded to nearest integer)
   */
  cpus?: number;

  /**
   * Volumes to mount
   */
  volumes?: string[];

  /**
   * Ports to expose
   */
  ports?: string[];

  /**
   * Environment variables to use
   */
  envs?: string[];

  /**
   * Sandboxes to depend on
   */
  dependsOn?: string[];

  /**
   * Working directory to use
   */
  workdir?: string;

  /**
   * Shell to use
   */
  shell?: string;

  /**
   * Scripts that can be run
   */
  scripts?: Record<string, string>;

  /**
   * Exec command to run
   */
  exec?: string;

  /**
   * Maximum time in seconds to wait for the sandbox to start
   */
  timeout?: number;
}

/**
 * Builder pattern for SandboxOptions
 */
export class SandboxOptionsBuilder {
  private options: SandboxOptions = {};

  /**
   * Set server URL
   */
  serverUrl(serverUrl: string): SandboxOptionsBuilder {
    this.options.serverUrl = serverUrl;
    return this;
  }

  /**
   * Set sandbox name
   */
  name(name: string): SandboxOptionsBuilder {
    this.options.name = name;
    return this;
  }

  /**
   * Set API key
   */
  apiKey(apiKey: string): SandboxOptionsBuilder {
    this.options.apiKey = apiKey;
    return this;
  }

  /**
   * Set Docker image
   */
  image(image: string): SandboxOptionsBuilder {
    this.options.image = image;
    return this;
  }

  /**
   * Set memory limit
   */
  memory(memory: number): SandboxOptionsBuilder {
    this.options.memory = memory;
    return this;
  }

  /**
   * Set CPU limit
   */
  cpus(cpus: number): SandboxOptionsBuilder {
    this.options.cpus = cpus;
    return this;
  }

  /**
   * Set volumes
   */
  volumes(volumes: string[]): SandboxOptionsBuilder {
    this.options.volumes = volumes;
    return this;
  }

  /**
   * Set ports
   */
  ports(ports: string[]): SandboxOptionsBuilder {
    this.options.ports = ports;
    return this;
  }

  /**
   * Set environment variables
   */
  envs(envs: string[]): SandboxOptionsBuilder {
    this.options.envs = envs;
    return this;
  }

  /**
   * Set sandbox dependencies
   */
  dependsOn(dependsOn: string[]): SandboxOptionsBuilder {
    this.options.dependsOn = dependsOn;
    return this;
  }

  /**
   * Set working directory
   */
  workdir(workdir: string): SandboxOptionsBuilder {
    this.options.workdir = workdir;
    return this;
  }

  /**
   * Set shell
   */
  shell(shell: string): SandboxOptionsBuilder {
    this.options.shell = shell;
    return this;
  }

  /**
   * Set scripts
   */
  scripts(scripts: Record<string, string>): SandboxOptionsBuilder {
    this.options.scripts = scripts;
    return this;
  }

  /**
   * Set exec command
   */
  exec(exec: string): SandboxOptionsBuilder {
    this.options.exec = exec;
    return this;
  }

  /**
   * Set timeout
   */
  timeout(timeout: number): SandboxOptionsBuilder {
    this.options.timeout = timeout;
    return this;
  }

  /**
   * Build SandboxOptions object
   */
  build(): SandboxOptions {
    return { ...this.options };
  }
}

/**
 * Module namespace for SandboxOptions
 */
export namespace SandboxOptions {
  /**
   * Create a builder for SandboxOptions
   */
  export const builder = (): SandboxOptionsBuilder =>
    new SandboxOptionsBuilder();
}

/**
 * Output line from sandbox execution
 */
export interface OutputLine {
  stream: "stdout" | "stderr";
  text: string;
}

/**
 * Output data from sandbox execution
 */
export interface OutputData {
  output?: OutputLine[];
  status?: string;
  language?: string;
  success?: boolean;
  exit_code?: number;
  command?: string;
  args?: string[];
}
