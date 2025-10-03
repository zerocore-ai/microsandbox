package dev.microsandbox;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 * Test class for the Execution class.
 */
public class ExecutionTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void testSuccessfulExecution() throws Exception {
        String jsonResponse = "{\"status\":\"completed\",\"output\":\"Hello World\",\"executionTime\":100}";
        JsonNode jsonNode = objectMapper.readTree(jsonResponse);
        Execution execution = new Execution(jsonNode);

        assertEquals("completed", execution.getStatus());
        assertEquals("Hello World", execution.getOutput());
        assertTrue(execution.isSuccess());
        assertFalse(execution.hasError());
        assertEquals(100, execution.getExecutionTime());
    }

    @Test
    public void testFailedExecution() throws Exception {
        String jsonResponse = "{\"status\":\"error\",\"output\":\"\",\"error\":\"Division by zero\"}";
        JsonNode jsonNode = objectMapper.readTree(jsonResponse);
        Execution execution = new Execution(jsonNode);

        assertEquals("error", execution.getStatus());
        assertEquals("Division by zero", execution.getError());
        assertFalse(execution.isSuccess());
        assertTrue(execution.hasError());
    }

    @Test
    public void testTimeoutExecution() throws Exception {
        String jsonResponse = "{\"status\":\"timeout\",\"output\":\"\",\"error\":\"Execution timed out\"}";
        JsonNode jsonNode = objectMapper.readTree(jsonResponse);
        Execution execution = new Execution(jsonNode);

        assertEquals("timeout", execution.getStatus());
        assertFalse(execution.isSuccess());
        assertTrue(execution.hasError());
    }

    @Test
    public void testExecutionWithId() throws Exception {
        String jsonResponse = "{\"status\":\"completed\",\"output\":\"Test\",\"executionId\":\"exec123\"}";
        JsonNode jsonNode = objectMapper.readTree(jsonResponse);
        Execution execution = new Execution(jsonNode);

        assertEquals("exec123", execution.getExecutionId());
    }

    @Test
    public void testEmptyExecution() throws Exception {
        String jsonResponse = "{}";
        JsonNode jsonNode = objectMapper.readTree(jsonResponse);
        Execution execution = new Execution(jsonNode);

        assertEquals("unknown", execution.getStatus());
        assertEquals("", execution.getOutput());
        assertEquals("", execution.getError());
        assertEquals(-1, execution.getExecutionTime());
    }

    @Test
    public void testToString() throws Exception {
        String jsonResponse = "{\"status\":\"completed\",\"output\":\"Hello\",\"error\":\"\"}";
        JsonNode jsonNode = objectMapper.readTree(jsonResponse);
        Execution execution = new Execution(jsonNode);

        String toString = execution.toString();
        assertTrue(toString.contains("status='completed'"));
        assertTrue(toString.contains("output='Hello'"));
    }
}