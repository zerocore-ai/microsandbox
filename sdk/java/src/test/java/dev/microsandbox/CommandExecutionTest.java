package dev.microsandbox;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 * Test class for the CommandExecution class.
 */
public class CommandExecutionTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void testSuccessfulCommand() throws Exception {
        String jsonResponse = "{\"status\":\"completed\",\"output\":\"File listing\",\"exitCode\":0,\"command\":\"ls\"}";
        JsonNode jsonNode = objectMapper.readTree(jsonResponse);
        CommandExecution cmd = new CommandExecution(jsonNode);

        assertEquals("completed", cmd.getStatus());
        assertEquals("File listing", cmd.getOutput());
        assertEquals(0, cmd.getExitCode());
        assertEquals("ls", cmd.getCommand());
        assertTrue(cmd.isSuccess());
        assertFalse(cmd.isTimeout());
    }

    @Test
    public void testFailedCommand() throws Exception {
        String jsonResponse = "{\"status\":\"completed\",\"output\":\"\",\"error\":\"No such file\",\"exitCode\":2}";
        JsonNode jsonNode = objectMapper.readTree(jsonResponse);
        CommandExecution cmd = new CommandExecution(jsonNode);

        assertEquals("No such file", cmd.getError());
        assertEquals(2, cmd.getExitCode());
        assertFalse(cmd.isSuccess());
    }

    @Test
    public void testCommandWithArgs() throws Exception {
        String jsonResponse = "{\"command\":\"ls\",\"args\":[\"-la\",\"/home\"],\"exitCode\":0}";
        JsonNode jsonNode = objectMapper.readTree(jsonResponse);
        CommandExecution cmd = new CommandExecution(jsonNode);

        assertEquals("ls", cmd.getCommand());
        String[] args = cmd.getArgs();
        assertNotNull(args);
        assertEquals(2, args.length);
        assertEquals("-la", args[0]);
        assertEquals("/home", args[1]);
    }

    @Test
    public void testTimeoutCommand() throws Exception {
        String jsonResponse = "{\"status\":\"timeout\",\"error\":\"Command timed out\"}";
        JsonNode jsonNode = objectMapper.readTree(jsonResponse);
        CommandExecution cmd = new CommandExecution(jsonNode);

        assertTrue(cmd.isTimeout());
        assertFalse(cmd.isSuccess());
    }

    @Test
    public void testExecutionTime() throws Exception {
        String jsonResponse = "{\"executionTime\":250,\"exitCode\":0}";
        JsonNode jsonNode = objectMapper.readTree(jsonResponse);
        CommandExecution cmd = new CommandExecution(jsonNode);

        assertEquals(250, cmd.getExecutionTime());
    }

    @Test
    public void testEmptyCommand() throws Exception {
        String jsonResponse = "{}";
        JsonNode jsonNode = objectMapper.readTree(jsonResponse);
        CommandExecution cmd = new CommandExecution(jsonNode);

        assertEquals("", cmd.getOutput());
        assertEquals("", cmd.getError());
        assertEquals(-1, cmd.getExitCode());
        assertEquals("unknown", cmd.getStatus());
        assertNull(cmd.getCommand());
        assertNull(cmd.getArgs());
    }

    @Test
    public void testToString() throws Exception {
        String jsonResponse = "{\"command\":\"echo\",\"exitCode\":0,\"status\":\"completed\",\"output\":\"hello\"}";
        JsonNode jsonNode = objectMapper.readTree(jsonResponse);
        CommandExecution cmd = new CommandExecution(jsonNode);

        String toString = cmd.toString();
        assertTrue(toString.contains("command='echo'"));
        assertTrue(toString.contains("exitCode=0"));
        assertTrue(toString.contains("status='completed'"));
    }
}