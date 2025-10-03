package dev.microsandbox;

import okhttp3.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * Base sandbox implementation for the Microsandbox Java SDK.
 *
 * This class provides the base interface for interacting with the Microsandbox server.
 * It handles common functionality like sandbox creation, management, and communication.
 */
public abstract class BaseSandbox {
    private static final Logger logger = LoggerFactory.getLogger(BaseSandbox.class);
    private static final String DEFAULT_SERVER_URL = "http://127.0.0.1:5555";

    protected final String serverUrl;
    protected final String namespace;
    protected final String name;
    protected final String apiKey;
    protected final OkHttpClient httpClient;
    protected final ObjectMapper objectMapper;

    protected String sandboxId;
    protected boolean isStarted = false;

    /**
     * Initialize a base sandbox instance.
     *
     * @param serverUrl URL of the Microsandbox server
     * @param namespace Namespace for the sandbox
     * @param name Name for the sandbox
     * @param apiKey API key for Microsandbox server authentication
     */
    public BaseSandbox(String serverUrl, String namespace, String name, String apiKey) {
        this.serverUrl = serverUrl != null ? serverUrl : getServerUrlFromEnv();
        this.namespace = namespace != null ? namespace : "default";
        this.name = name != null ? name : "java-sandbox-" + UUID.randomUUID().toString().substring(0, 8);
        this.apiKey = apiKey != null ? apiKey : System.getenv("MSB_API_KEY");

        this.httpClient = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .build();

        this.objectMapper = new ObjectMapper();
    }

    /**
     * Get server URL from environment variable or use default.
     */
    private String getServerUrlFromEnv() {
        String envUrl = System.getenv("MSB_SERVER_URL");
        return envUrl != null ? envUrl : DEFAULT_SERVER_URL;
    }

    /**
     * Start the sandbox with specified configuration.
     *
     * @param dockerImage Docker image to use (null for language default)
     * @param memoryMb Memory limit in MB (0 for default 512MB)
     * @param cpuCores CPU cores (0 for default 1)
     * @throws IOException if sandbox creation fails
     */
    public void start(String dockerImage, int memoryMb, int cpuCores) throws IOException {
        if (isStarted) {
            throw new IllegalStateException("Sandbox is already started");
        }

        // Create sandbox creation request
        MediaType JSON = MediaType.get("application/json; charset=utf-8");

        String requestBody = String.format(
            "{\"name\":\"%s\",\"namespace\":\"%s\",\"lang\":\"%s\",\"dockerImage\":\"%s\",\"memoryMb\":%d,\"cpuCores\":%d}",
            name, namespace, getLanguage(),
            dockerImage != null ? dockerImage : getDefaultImage(),
            memoryMb > 0 ? memoryMb : 512,
            cpuCores > 0 ? cpuCores : 1
        );

        RequestBody body = RequestBody.create(requestBody, JSON);
        Request.Builder requestBuilder = new Request.Builder()
            .url(serverUrl + "/sandboxes")
            .post(body);

        // Add API key if provided
        if (apiKey != null && !apiKey.isEmpty()) {
            requestBuilder.header("Authorization", "Bearer " + apiKey);
        }

        Request request = requestBuilder.build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Failed to create sandbox: " + response.code() + " " + response.message());
            }

            JsonNode responseJson = objectMapper.readTree(response.body().string());
            this.sandboxId = responseJson.get("sandboxId").asText();
            this.isStarted = true;

            logger.info("Started sandbox {} with ID: {}", name, sandboxId);
        }
    }

    /**
     * Start the sandbox with default configuration.
     *
     * @throws IOException if sandbox creation fails
     */
    public void start() throws IOException {
        start(null, 0, 0);
    }

    /**
     * Stop and destroy the sandbox.
     *
     * @throws IOException if sandbox destruction fails
     */
    public void stop() throws IOException {
        if (!isStarted || sandboxId == null) {
            return;
        }

        Request.Builder requestBuilder = new Request.Builder()
            .url(serverUrl + "/sandboxes/" + sandboxId)
            .delete();

        if (apiKey != null && !apiKey.isEmpty()) {
            requestBuilder.header("Authorization", "Bearer " + apiKey);
        }

        Request request = requestBuilder.build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                logger.warn("Failed to stop sandbox {}: {} {}", sandboxId, response.code(), response.message());
            } else {
                logger.info("Stopped sandbox {}", sandboxId);
            }
        } finally {
            this.isStarted = false;
            this.sandboxId = null;
        }
    }

    /**
     * Execute code in the sandbox.
     *
     * @param code The code to execute
     * @return Execution result
     * @throws IOException if execution fails
     */
    public Execution executeCode(String code) throws IOException {
        return executeCode(code, null);
    }

    /**
     * Execute code in the sandbox with timeout.
     *
     * @param code The code to execute
     * @param timeoutSeconds Timeout in seconds (null for default)
     * @return Execution result
     * @throws IOException if execution fails
     */
    public Execution executeCode(String code, Integer timeoutSeconds) throws IOException {
        if (!isStarted) {
            throw new IllegalStateException("Sandbox is not started");
        }

        MediaType JSON = MediaType.get("application/json; charset=utf-8");

        String requestBody = timeoutSeconds != null ?
            String.format("{\"code\":\"%s\",\"timeout\":%d}", escapeJson(code), timeoutSeconds) :
            String.format("{\"code\":\"%s\"}", escapeJson(code));

        RequestBody body = RequestBody.create(requestBody, JSON);
        Request.Builder requestBuilder = new Request.Builder()
            .url(serverUrl + "/sandboxes/" + sandboxId + "/execute")
            .post(body);

        if (apiKey != null && !apiKey.isEmpty()) {
            requestBuilder.header("Authorization", "Bearer " + apiKey);
        }

        Request request = requestBuilder.build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Failed to execute code: " + response.code() + " " + response.message());
            }

            JsonNode responseJson = objectMapper.readTree(response.body().string());
            return new Execution(responseJson);
        }
    }

    /**
     * Execute a shell command in the sandbox.
     *
     * @param command The command to execute
     * @param args Command arguments
     * @return Command execution result
     * @throws IOException if command execution fails
     */
    public CommandExecution executeCommand(String command, String[] args) throws IOException {
        return executeCommand(command, args, null);
    }

    /**
     * Execute a shell command in the sandbox with timeout.
     *
     * @param command The command to execute
     * @param args Command arguments
     * @param timeoutSeconds Timeout in seconds (null for default)
     * @return Command execution result
     * @throws IOException if command execution fails
     */
    public CommandExecution executeCommand(String command, String[] args, Integer timeoutSeconds) throws IOException {
        if (!isStarted) {
            throw new IllegalStateException("Sandbox is not started");
        }

        MediaType JSON = MediaType.get("application/json; charset=utf-8");

        StringBuilder argsJson = new StringBuilder("[");
        if (args != null && args.length > 0) {
            for (int i = 0; i < args.length; i++) {
                if (i > 0) argsJson.append(",");
                argsJson.append("\"").append(escapeJson(args[i])).append("\"");
            }
        }
        argsJson.append("]");

        String requestBody = timeoutSeconds != null ?
            String.format("{\"command\":\"%s\",\"args\":%s,\"timeout\":%d}",
                escapeJson(command), argsJson.toString(), timeoutSeconds) :
            String.format("{\"command\":\"%s\",\"args\":%s}",
                escapeJson(command), argsJson.toString());

        RequestBody body = RequestBody.create(requestBody, JSON);
        Request.Builder requestBuilder = new Request.Builder()
            .url(serverUrl + "/sandboxes/" + sandboxId + "/command")
            .post(body);

        if (apiKey != null && !apiKey.isEmpty()) {
            requestBuilder.header("Authorization", "Bearer " + apiKey);
        }

        Request request = requestBuilder.build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Failed to execute command: " + response.code() + " " + response.message());
            }

            JsonNode responseJson = objectMapper.readTree(response.body().string());
            return new CommandExecution(responseJson);
        }
    }

    /**
     * Get sandbox metrics.
     *
     * @return Metrics instance
     */
    public Metrics getMetrics() {
        return new Metrics(this);
    }

    /**
     * Get the language this sandbox supports.
     *
     * @return Language name
     */
    protected abstract String getLanguage();

    /**
     * Get the default Docker image for this language.
     *
     * @return Default Docker image name
     */
    protected abstract String getDefaultImage();

    /**
     * Escape JSON string values.
     */
    private String escapeJson(String value) {
        return value.replace("\"", "\\\"")
                   .replace("\n", "\\n")
                   .replace("\r", "\\r")
                   .replace("\t", "\\t");
    }

    /**
     * Get the sandbox ID.
     */
    public String getSandboxId() {
        return sandboxId;
    }

    /**
     * Check if the sandbox is started.
     */
    public boolean isStarted() {
        return isStarted;
    }

    // Package-private methods for internal use
    String getServerUrl() { return serverUrl; }
    String getApiKey() { return apiKey; }
    OkHttpClient getHttpClient() { return httpClient; }
    ObjectMapper getObjectMapper() { return objectMapper; }
}