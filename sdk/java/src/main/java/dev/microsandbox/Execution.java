package dev.microsandbox;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * Represents the result of code execution in a sandbox.
 */
public class Execution {
    private final JsonNode executionData;

    /**
     * Create an execution result from JSON response.
     *
     * @param executionData JSON response from the execution API
     */
    public Execution(JsonNode executionData) {
        this.executionData = executionData;
    }

    /**
     * Get the execution status.
     *
     * @return Execution status (e.g., "completed", "error", "timeout")
     */
    public String getStatus() {
        JsonNode statusNode = executionData.get("status");
        return statusNode != null ? statusNode.asText() : "unknown";
    }

    /**
     * Get the execution output/result.
     *
     * @return Execution output as string
     */
    public String getOutput() {
        JsonNode outputNode = executionData.get("output");
        if (outputNode != null && outputNode.isTextual()) {
            return outputNode.asText();
        }

        // Handle cases where output might be in different format
        JsonNode resultNode = executionData.get("result");
        if (resultNode != null && resultNode.isTextual()) {
            return resultNode.asText();
        }

        return "";
    }

    /**
     * Get error output if execution failed.
     *
     * @return Error output as string, empty if no error
     */
    public String getError() {
        JsonNode errorNode = executionData.get("error");
        if (errorNode != null && errorNode.isTextual()) {
            return errorNode.asText();
        }

        // Check for stderr
        JsonNode stderrNode = executionData.get("stderr");
        if (stderrNode != null && stderrNode.isTextual()) {
            return stderrNode.asText();
        }

        return "";
    }

    /**
     * Check if the execution has an error.
     *
     * @return true if execution failed with an error
     */
    public boolean hasError() {
        String status = getStatus();
        return "error".equals(status) || "timeout".equals(status) || !getError().isEmpty();
    }

    /**
     * Check if the execution completed successfully.
     *
     * @return true if execution completed without errors
     */
    public boolean isSuccess() {
        return "completed".equals(getStatus()) && !hasError();
    }

    /**
     * Get execution time in milliseconds.
     *
     * @return Execution time in milliseconds, -1 if not available
     */
    public long getExecutionTime() {
        JsonNode timeNode = executionData.get("executionTime");
        if (timeNode != null && timeNode.isNumber()) {
            return timeNode.asLong();
        }

        JsonNode durationNode = executionData.get("duration");
        if (durationNode != null && durationNode.isNumber()) {
            return durationNode.asLong();
        }

        return -1;
    }

    /**
     * Get the execution ID if available.
     *
     * @return Execution ID or null if not available
     */
    public String getExecutionId() {
        JsonNode idNode = executionData.get("executionId");
        if (idNode != null && idNode.isTextual()) {
            return idNode.asText();
        }

        JsonNode requestIdNode = executionData.get("requestId");
        if (requestIdNode != null && requestIdNode.isTextual()) {
            return requestIdNode.asText();
        }

        return null;
    }

    /**
     * Get the raw JSON data for this execution.
     *
     * @return Raw JSON data
     */
    public JsonNode getRawData() {
        return executionData;
    }

    @Override
    public String toString() {
        return String.format("Execution{status='%s', output='%s', error='%s'}",
                getStatus(),
                getOutput().length() > 100 ? getOutput().substring(0, 100) + "..." : getOutput(),
                getError().length() > 100 ? getError().substring(0, 100) + "..." : getError());
    }
}