package dev.microsandbox;

import org.junit.Test;
import static org.junit.Assert.*;

/**
 * Test class for the main Microsandbox factory class.
 */
public class MicrosandboxTest {

    @Test
    public void testPythonSandboxCreation() {
        PythonSandbox sandbox = Microsandbox.python();
        assertNotNull(sandbox);
        assertFalse(sandbox.isStarted());
    }

    @Test
    public void testPythonSandboxWithName() {
        PythonSandbox sandbox = Microsandbox.python("test-sandbox");
        assertNotNull(sandbox);
        assertFalse(sandbox.isStarted());
    }

    @Test
    public void testNodeSandboxCreation() {
        NodeSandbox sandbox = Microsandbox.node();
        assertNotNull(sandbox);
        assertFalse(sandbox.isStarted());
    }

    @Test
    public void testNodeSandboxWithName() {
        NodeSandbox sandbox = Microsandbox.node("test-node-sandbox");
        assertNotNull(sandbox);
        assertFalse(sandbox.isStarted());
    }

    @Test
    public void testPythonBuilder() {
        PythonSandbox.Builder builder = Microsandbox.pythonBuilder();
        assertNotNull(builder);

        PythonSandbox sandbox = builder
            .name("test-builder")
            .namespace("testing")
            .build();

        assertNotNull(sandbox);
        assertFalse(sandbox.isStarted());
    }

    @Test
    public void testNodeBuilder() {
        NodeSandbox.Builder builder = Microsandbox.nodeBuilder();
        assertNotNull(builder);

        NodeSandbox sandbox = builder
            .name("test-node-builder")
            .namespace("testing")
            .build();

        assertNotNull(sandbox);
        assertFalse(sandbox.isStarted());
    }

    @Test
    public void testVersion() {
        assertEquals("0.1.0", Microsandbox.VERSION);
    }
}