package dev.microsandbox;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * Represents the result of command execution in a sandbox.
 */
public class CommandExecution {
    private final JsonNode executionData;

    /**
     * Create a command execution result from JSON response.
     *
     * @param executionData JSON response from the command execution API
     */
    public CommandExecution(JsonNode executionData) {
        this.executionData = executionData;
    }

    /**
     * Get the command output (stdout).
     *
     * @return Command output as string
     */
    public String getOutput() {
        JsonNode outputNode = executionData.get("output");
        if (outputNode != null && outputNode.isTextual()) {
            return outputNode.asText();
        }

        JsonNode stdoutNode = executionData.get("stdout");
        if (stdoutNode != null && stdoutNode.isTextual()) {
            return stdoutNode.asText();
        }

        return "";
    }

    /**
     * Get the command error output (stderr).
     *
     * @return Error output as string, empty if no error
     */
    public String getError() {
        JsonNode errorNode = executionData.get("error");
        if (errorNode != null && errorNode.isTextual()) {
            return errorNode.asText();
        }

        JsonNode stderrNode = executionData.get("stderr");
        if (stderrNode != null && stderrNode.isTextual()) {
            return stderrNode.asText();
        }

        return "";
    }

    /**
     * Get the command exit code.
     *
     * @return Exit code, -1 if not available
     */
    public int getExitCode() {
        JsonNode exitCodeNode = executionData.get("exitCode");
        if (exitCodeNode != null && exitCodeNode.isNumber()) {
            return exitCodeNode.asInt();
        }

        JsonNode codeNode = executionData.get("code");
        if (codeNode != null && codeNode.isNumber()) {
            return codeNode.asInt();
        }

        return -1;
    }

    /**
     * Check if the command executed successfully (exit code 0).
     *
     * @return true if command succeeded
     */
    public boolean isSuccess() {
        return getExitCode() == 0;
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
     * Check if the command execution timed out.
     *
     * @return true if execution timed out
     */
    public boolean isTimeout() {
        return "timeout".equals(getStatus());
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
     * Get the command that was executed.
     *
     * @return Command string or null if not available
     */
    public String getCommand() {
        JsonNode commandNode = executionData.get("command");
        return commandNode != null ? commandNode.asText() : null;
    }

    /**
     * Get the arguments that were passed to the command.
     *
     * @return Array of arguments or null if not available
     */
    public String[] getArgs() {
        JsonNode argsNode = executionData.get("args");
        if (argsNode != null && argsNode.isArray()) {
            String[] args = new String[argsNode.size()];
            for (int i = 0; i < argsNode.size(); i++) {
                args[i] = argsNode.get(i).asText();
            }
            return args;
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
        return String.format("CommandExecution{command='%s', exitCode=%d, status='%s', output='%s', error='%s'}",
                getCommand(),
                getExitCode(),
                getStatus(),
                getOutput().length() > 50 ? getOutput().substring(0, 50) + "..." : getOutput(),
                getError().length() > 50 ? getError().substring(0, 50) + "..." : getError());
    }
}