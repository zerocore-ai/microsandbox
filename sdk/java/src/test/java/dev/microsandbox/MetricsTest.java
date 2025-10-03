package dev.microsandbox;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 * Test class for the Metrics class.
 */
public class MetricsTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void testMetricsData() throws Exception {
        String jsonResponse = "{\"cpu\":25.5,\"memoryMb\":256,\"diskBytes\":1048576,\"uptime\":3600," +
                             "\"networkBytesSent\":1024,\"networkBytesReceived\":2048}";
        JsonNode jsonNode = objectMapper.readTree(jsonResponse);
        Metrics.MetricsData metrics = new Metrics.MetricsData(jsonNode);

        assertEquals(25.5, metrics.getCpuUsage(), 0.01);
        assertEquals(256, metrics.getMemoryUsageMb());
        assertEquals(1048576, metrics.getDiskUsageBytes());
        assertEquals(3600, metrics.getUptimeSeconds());
        assertEquals(1024, metrics.getNetworkBytesSent());
        assertEquals(2048, metrics.getNetworkBytesReceived());
    }

    @Test
    public void testMetricsDataAlternativeFields() throws Exception {
        // Test alternative field names that might be used by the API
        String jsonResponse = "{\"cpuPercent\":50.0,\"memoryMiB\":512,\"diskBytes\":2097152,\"uptimeSeconds\":7200}";
        JsonNode jsonNode = objectMapper.readTree(jsonResponse);
        Metrics.MetricsData metrics = new Metrics.MetricsData(jsonNode);

        assertEquals(50.0, metrics.getCpuUsage(), 0.01);
        assertEquals(512, metrics.getMemoryUsageMb());
        assertEquals(2097152, metrics.getDiskUsageBytes());
        assertEquals(7200, metrics.getUptimeSeconds());
    }

    @Test
    public void testEmptyMetrics() throws Exception {
        String jsonResponse = "{}";
        JsonNode jsonNode = objectMapper.readTree(jsonResponse);
        Metrics.MetricsData metrics = new Metrics.MetricsData(jsonNode);

        assertEquals(0.0, metrics.getCpuUsage(), 0.01);
        assertEquals(0, metrics.getMemoryUsageMb());
        assertEquals(0, metrics.getDiskUsageBytes());
        assertEquals(0, metrics.getUptimeSeconds());
        assertEquals(0, metrics.getNetworkBytesSent());
        assertEquals(0, metrics.getNetworkBytesReceived());
    }

    @Test
    public void testMetricsToString() throws Exception {
        String jsonResponse = "{\"cpu\":75.2,\"memoryMb\":128,\"diskBytes\":524288,\"uptime\":1800}";
        JsonNode jsonNode = objectMapper.readTree(jsonResponse);
        Metrics.MetricsData metrics = new Metrics.MetricsData(jsonNode);

        String toString = metrics.toString();
        assertTrue(toString.contains("cpu=75.20%"));
        assertTrue(toString.contains("memory=128MB"));
        assertTrue(toString.contains("disk=524288B"));
        assertTrue(toString.contains("uptime=1800s"));
    }

    @Test
    public void testRawData() throws Exception {
        String jsonResponse = "{\"cpu\":10.0,\"customField\":\"customValue\"}";
        JsonNode jsonNode = objectMapper.readTree(jsonResponse);
        Metrics.MetricsData metrics = new Metrics.MetricsData(jsonNode);

        JsonNode rawData = metrics.getRawData();
        assertNotNull(rawData);
        assertEquals("customValue", rawData.get("customField").asText());
    }
}