package dev.microsandbox;

import java.io.IOException;

/**
 * Node.js-specific sandbox implementation.
 *
 * This sandbox allows you to execute Node.js/JavaScript code in a secure, isolated environment.
 */
public class NodeSandbox extends BaseSandbox {

    /**
     * Create a Node.js sandbox with default configuration.
     */
    public NodeSandbox() {
        super(null, null, null, null);
    }

    /**
     * Create a Node.js sandbox with custom name.
     *
     * @param name Custom name for the sandbox
     */
    public NodeSandbox(String name) {
        super(null, null, name, null);
    }

    /**
     * Create a Node.js sandbox with full configuration.
     *
     * @param serverUrl URL of the Microsandbox server
     * @param namespace Namespace for the sandbox
     * @param name Name for the sandbox
     * @param apiKey API key for authentication
     */
    public NodeSandbox(String serverUrl, String namespace, String name, String apiKey) {
        super(serverUrl, namespace, name, apiKey);
    }

    /**
     * Builder class for creating NodeSandbox instances with fluent configuration.
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

        public NodeSandbox build() {
            return new NodeSandbox(serverUrl, namespace, name, apiKey);
        }
    }

    /**
     * Create a new builder for configuring a NodeSandbox.
     *
     * @return Builder instance
     */
    public static Builder newBuilder() {
        return new Builder();
    }

    /**
     * Execute JavaScript/Node.js code in the sandbox.
     *
     * @param jsCode The JavaScript code to execute
     * @return Execution result
     * @throws IOException if execution fails
     */
    public Execution runJavaScript(String jsCode) throws IOException {
        return executeCode(jsCode);
    }

    /**
     * Execute JavaScript/Node.js code with timeout.
     *
     * @param jsCode The JavaScript code to execute
     * @param timeoutSeconds Timeout in seconds
     * @return Execution result
     * @throws IOException if execution fails
     */
    public Execution runJavaScript(String jsCode, int timeoutSeconds) throws IOException {
        return executeCode(jsCode, timeoutSeconds);
    }

    /**
     * Alias for runJavaScript for convenience.
     *
     * @param jsCode The JavaScript code to execute
     * @return Execution result
     * @throws IOException if execution fails
     */
    public Execution runJS(String jsCode) throws IOException {
        return runJavaScript(jsCode);
    }

    /**
     * Execute a shell command in the Node.js sandbox.
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
     * Install an npm package.
     *
     * @param packageName Name of the package to install
     * @return Command execution result
     * @throws IOException if installation fails
     */
    public CommandExecution installNpmPackage(String packageName) throws IOException {
        return runCommand("npm", "install", packageName);
    }

    /**
     * Install multiple npm packages.
     *
     * @param packageNames Names of the packages to install
     * @return Command execution result
     * @throws IOException if installation fails
     */
    public CommandExecution installNpmPackages(String... packageNames) throws IOException {
        String[] args = new String[packageNames.length + 1];
        args[0] = "install";
        System.arraycopy(packageNames, 0, args, 1, packageNames.length);
        return runCommand("npm", args);
    }

    /**
     * List installed npm packages.
     *
     * @return Command execution result containing package list
     * @throws IOException if command fails
     */
    public CommandExecution listNpmPackages() throws IOException {
        return runCommand("npm", "list");
    }

    /**
     * Get Node.js version.
     *
     * @return Command execution result containing Node.js version
     * @throws IOException if command fails
     */
    public CommandExecution getNodeVersion() throws IOException {
        return runCommand("node", "--version");
    }

    /**
     * Get npm version.
     *
     * @return Command execution result containing npm version
     * @throws IOException if command fails
     */
    public CommandExecution getNpmVersion() throws IOException {
        return runCommand("npm", "--version");
    }

    /**
     * Initialize a new npm project.
     *
     * @return Command execution result
     * @throws IOException if command fails
     */
    public CommandExecution npmInit() throws IOException {
        return runCommand("npm", "init", "-y");
    }

    /**
     * Run an npm script.
     *
     * @param scriptName Name of the npm script to run
     * @return Command execution result
     * @throws IOException if command fails
     */
    public CommandExecution runNpmScript(String scriptName) throws IOException {
        return runCommand("npm", "run", scriptName);
    }

    @Override
    protected String getLanguage() {
        return "node";
    }

    @Override
    protected String getDefaultImage() {
        return "node:18-slim";
    }

    /**
     * Create a Node.js sandbox with the auto-start pattern.
     *
     * @return Started NodeSandbox instance
     * @throws IOException if sandbox creation fails
     */
    public static NodeSandbox createAndStart() throws IOException {
        NodeSandbox sandbox = new NodeSandbox();
        sandbox.start();
        return sandbox;
    }

    /**
     * Create a Node.js sandbox with custom name and auto-start.
     *
     * @param name Custom name for the sandbox
     * @return Started NodeSandbox instance
     * @throws IOException if sandbox creation fails
     */
    public static NodeSandbox createAndStart(String name) throws IOException {
        NodeSandbox sandbox = new NodeSandbox(name);
        sandbox.start();
        return sandbox;
    }
}