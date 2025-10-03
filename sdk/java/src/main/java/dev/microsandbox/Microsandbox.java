package dev.microsandbox;

/**
 * Main entry point and factory class for creating Microsandbox instances.
 *
 * This class provides convenient static methods for creating different types of sandboxes.
 */
public class Microsandbox {

    /**
     * Current version of the Java SDK.
     */
    public static final String VERSION = "0.1.0";

    /**
     * Create a new Python sandbox with default configuration.
     *
     * @return PythonSandbox instance
     */
    public static PythonSandbox python() {
        return new PythonSandbox();
    }

    /**
     * Create a new Python sandbox with custom name.
     *
     * @param name Custom name for the sandbox
     * @return PythonSandbox instance
     */
    public static PythonSandbox python(String name) {
        return new PythonSandbox(name);
    }

    /**
     * Create a new Node.js sandbox with default configuration.
     *
     * @return NodeSandbox instance
     */
    public static NodeSandbox node() {
        return new NodeSandbox();
    }

    /**
     * Create a new Node.js sandbox with custom name.
     *
     * @param name Custom name for the sandbox
     * @return NodeSandbox instance
     */
    public static NodeSandbox node(String name) {
        return new NodeSandbox(name);
    }

    /**
     * Create a builder for Python sandbox with advanced configuration.
     *
     * @return PythonSandbox.Builder instance
     */
    public static PythonSandbox.Builder pythonBuilder() {
        return PythonSandbox.newBuilder();
    }

    /**
     * Create a builder for Node.js sandbox with advanced configuration.
     *
     * @return NodeSandbox.Builder instance
     */
    public static NodeSandbox.Builder nodeBuilder() {
        return NodeSandbox.newBuilder();
    }

    // Private constructor to prevent instantiation
    private Microsandbox() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }
}