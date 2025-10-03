package dev.microsandbox;

import java.io.IOException;

/**
 * Python-specific sandbox implementation.
 *
 * This sandbox allows you to execute Python code in a secure, isolated environment.
 */
public class PythonSandbox extends BaseSandbox {

    /**
     * Create a Python sandbox with default configuration.
     */
    public PythonSandbox() {
        super(null, null, null, null);
    }

    /**
     * Create a Python sandbox with custom name.
     *
     * @param name Custom name for the sandbox
     */
    public PythonSandbox(String name) {
        super(null, null, name, null);
    }

    /**
     * Create a Python sandbox with full configuration.
     *
     * @param serverUrl URL of the Microsandbox server
     * @param namespace Namespace for the sandbox
     * @param name Name for the sandbox
     * @param apiKey API key for authentication
     */
    public PythonSandbox(String serverUrl, String namespace, String name, String apiKey) {
        super(serverUrl, namespace, name, apiKey);
    }

    /**
     * Builder class for creating PythonSandbox instances with fluent configuration.
     */
    public static class Builder {
        private String serverUrl;
        private String namespace;
        private String name;
        private String apiKey;

        public Builder serverUrl(String serverUrl) {
            this.serverUrl = serverUrl;
            return this;
        }

        public Builder namespace(String namespace) {
            this.namespace = namespace;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder apiKey(String apiKey) {
            this.apiKey = apiKey;
            return this;
        }

        public PythonSandbox build() {
            return new PythonSandbox(serverUrl, namespace, name, apiKey);
        }
    }

    /**
     * Create a new builder for configuring a PythonSandbox.
     *
     * @return Builder instance
     */
    public static Builder newBuilder() {
        return new Builder();
    }

    /**
     * Execute Python code in the sandbox.
     *
     * @param pythonCode The Python code to execute
     * @return Execution result
     * @throws IOException if execution fails
     */
    public Execution runPython(String pythonCode) throws IOException {
        return executeCode(pythonCode);
    }

    /**
     * Execute Python code with timeout.
     *
     * @param pythonCode The Python code to execute
     * @param timeoutSeconds Timeout in seconds
     * @return Execution result
     * @throws IOException if execution fails
     */
    public Execution runPython(String pythonCode, int timeoutSeconds) throws IOException {
        return executeCode(pythonCode, timeoutSeconds);
    }

    /**
     * Execute a shell command in the Python sandbox.
     *
     * @param command The command to execute
     * @param args Command arguments
     * @return Command execution result
     * @throws IOException if command execution fails
     */
    public CommandExecution runCommand(String command, String... args) throws IOException {
        return executeCommand(command, args);
    }

    /**
     * Execute a shell command with timeout.
     *
     * @param command The command to execute
     * @param timeoutSeconds Timeout in seconds
     * @param args Command arguments
     * @return Command execution result
     * @throws IOException if command execution fails
     */
    public CommandExecution runCommand(String command, int timeoutSeconds, String... args) throws IOException {
        return executeCommand(command, args, timeoutSeconds);
    }

    /**
     * Install a Python package using pip.
     *
     * @param packageName Name of the package to install
     * @return Command execution result
     * @throws IOException if installation fails
     */
    public CommandExecution installPackage(String packageName) throws IOException {
        return runCommand("pip", "install", packageName);
    }

    /**
     * Install multiple Python packages using pip.
     *
     * @param packageNames Names of the packages to install
     * @return Command execution result
     * @throws IOException if installation fails
     */
    public CommandExecution installPackages(String... packageNames) throws IOException {
        String[] args = new String[packageNames.length + 1];
        args[0] = "install";
        System.arraycopy(packageNames, 0, args, 1, packageNames.length);
        return runCommand("pip", args);
    }

    /**
     * List installed Python packages.
     *
     * @return Command execution result containing package list
     * @throws IOException if command fails
     */
    public CommandExecution listPackages() throws IOException {
        return runCommand("pip", "list");
    }

    /**
     * Get Python version.
     *
     * @return Command execution result containing Python version
     * @throws IOException if command fails
     */
    public CommandExecution getPythonVersion() throws IOException {
        return runCommand("python", "--version");
    }

    @Override
    protected String getLanguage() {
        return "python";
    }

    @Override
    protected String getDefaultImage() {
        return "python:3.11-slim";
    }

    /**
     * Create a Python sandbox with the auto-start pattern.
     *
     * @return Started PythonSandbox instance
     * @throws IOException if sandbox creation fails
     */
    public static PythonSandbox createAndStart() throws IOException {
        PythonSandbox sandbox = new PythonSandbox();
        sandbox.start();
        return sandbox;
    }

    /**
     * Create a Python sandbox with custom name and auto-start.
     *
     * @param name Custom name for the sandbox
     * @return Started PythonSandbox instance
     * @throws IOException if sandbox creation fails
     */
    public static PythonSandbox createAndStart(String name) throws IOException {
        PythonSandbox sandbox = new PythonSandbox(name);
        sandbox.start();
        return sandbox;
    }
}