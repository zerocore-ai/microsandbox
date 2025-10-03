package dev.microsandbox;

import com.fasterxml.jackson.databind.JsonNode;
import okhttp3.Request;
import okhttp3.Response;

import java.io.IOException;

/**
 * Provides access to sandbox resource usage metrics.
 */
public class Metrics {
    private final BaseSandbox sandbox;

    /**
     * Create a metrics instance for the given sandbox.
     *
     * @param sandbox The sandbox to get metrics for
     */
    public Metrics(BaseSandbox sandbox) {
        this.sandbox = sandbox;
    }

    /**
     * Get all available metrics for the sandbox.
     *
     * @return MetricsData containing all metrics
     * @throws IOException if metrics retrieval fails
     */
    public MetricsData getAll() throws IOException {
        if (!sandbox.isStarted()) {
            throw new IllegalStateException("Sandbox is not started");
        }

        Request.Builder requestBuilder = new Request.Builder()
            .url(sandbox.getServerUrl() + "/sandboxes/" + sandbox.getSandboxId() + "/metrics");

        if (sandbox.getApiKey() != null && !sandbox.getApiKey().isEmpty()) {
            requestBuilder.header("Authorization", "Bearer " + sandbox.getApiKey());
        }

        Request request = requestBuilder.build();

        try (Response response = sandbox.getHttpClient().newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Failed to get metrics: " + response.code() + " " + response.message());
            }

            JsonNode responseJson = sandbox.getObjectMapper().readTree(response.body().string());
            return new MetricsData(responseJson);
        }
    }

    /**
     * Get CPU usage percentage.
     *
     * @return CPU usage percentage (0.0 - 100.0)
     * @throws IOException if metrics retrieval fails
     */
    public double getCpuUsage() throws IOException {
        return getAll().getCpuUsage();
    }

    /**
     * Get memory usage in MB.
     *
     * @return Memory usage in megabytes
     * @throws IOException if metrics retrieval fails
     */
    public long getMemoryUsageMb() throws IOException {
        return getAll().getMemoryUsageMb();
    }

    /**
     * Get disk usage in bytes.
     *
     * @return Disk usage in bytes
     * @throws IOException if metrics retrieval fails
     */
    public long getDiskUsageBytes() throws IOException {
        return getAll().getDiskUsageBytes();
    }

    /**
     * Container class for all metrics data.
     */
    public static class MetricsData {
        private final JsonNode metricsData;

        public MetricsData(JsonNode metricsData) {
            this.metricsData = metricsData;
        }

        /**
         * Get CPU usage percentage.
         *
         * @return CPU usage percentage (0.0 - 100.0)
         */
        public double getCpuUsage() {
            JsonNode cpuNode = metricsData.get("cpu");
            if (cpuNode != null && cpuNode.isNumber()) {
                return cpuNode.asDouble();
            }

            JsonNode cpuPercentNode = metricsData.get("cpuPercent");
            if (cpuPercentNode != null && cpuPercentNode.isNumber()) {
                return cpuPercentNode.asDouble();
            }

            return 0.0;
        }

        /**
         * Get memory usage in MB.
         *
         * @return Memory usage in megabytes
         */
        public long getMemoryUsageMb() {
            JsonNode memoryNode = metricsData.get("memory");
            if (memoryNode != null && memoryNode.isNumber()) {
                return memoryNode.asLong();
            }

            JsonNode memoryMbNode = metricsData.get("memoryMb");
            if (memoryMbNode != null && memoryMbNode.isNumber()) {
                return memoryMbNode.asLong();
            }

            JsonNode memoryMibNode = metricsData.get("memoryMiB");
            if (memoryMibNode != null && memoryMibNode.isNumber()) {
                return memoryMibNode.asLong();
            }

            return 0;
        }

        /**
         * Get disk usage in bytes.
         *
         * @return Disk usage in bytes
         */
        public long getDiskUsageBytes() {
            JsonNode diskNode = metricsData.get("disk");
            if (diskNode != null && diskNode.isNumber()) {
                return diskNode.asLong();
            }

            JsonNode diskBytesNode = metricsData.get("diskBytes");
            if (diskBytesNode != null && diskBytesNode.isNumber()) {
                return diskBytesNode.asLong();
            }

            return 0;
        }

        /**
         * Get network bytes sent.
         *
         * @return Network bytes sent
         */
        public long getNetworkBytesSent() {
            JsonNode networkSentNode = metricsData.get("networkBytesSent");
            if (networkSentNode != null && networkSentNode.isNumber()) {
                return networkSentNode.asLong();
            }
            return 0;
        }

        /**
         * Get network bytes received.
         *
         * @return Network bytes received
         */
        public long getNetworkBytesReceived() {
            JsonNode networkReceivedNode = metricsData.get("networkBytesReceived");
            if (networkReceivedNode != null && networkReceivedNode.isNumber()) {
                return networkReceivedNode.asLong();
            }
            return 0;
        }

        /**
         * Get uptime in seconds.
         *
         * @return Uptime in seconds
         */
        public long getUptimeSeconds() {
            JsonNode uptimeNode = metricsData.get("uptime");
            if (uptimeNode != null && uptimeNode.isNumber()) {
                return uptimeNode.asLong();
            }

            JsonNode uptimeSecondsNode = metricsData.get("uptimeSeconds");
            if (uptimeSecondsNode != null && uptimeSecondsNode.isNumber()) {
                return uptimeSecondsNode.asLong();
            }

            return 0;
        }

        /**
         * Get the raw JSON data for these metrics.
         *
         * @return Raw JSON data
         */
        public JsonNode getRawData() {
            return metricsData;
        }

        @Override
        public String toString() {
            return String.format("MetricsData{cpu=%.2f%%, memory=%dMB, disk=%dB, uptime=%ds}",
                    getCpuUsage(), getMemoryUsageMb(), getDiskUsageBytes(), getUptimeSeconds());
        }
    }
}