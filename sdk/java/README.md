# Microsandbox Java SDK

A comprehensive Java SDK for interacting with Microsandbox environments. This SDK provides thread-safe access to running microsandbox environments for code execution, command execution, and resource monitoring.

## Installation

### Maven

```xml
<dependency>
    <groupId>dev.microsandbox</groupId>
    <artifactId>microsandbox</artifactId>
    <version>0.1.0</version>
</dependency>
```

### Gradle

```groovy
implementation 'dev.microsandbox:microsandbox:0.1.0'
```

## Quick Start

### Basic Python Code Execution

```java
import dev.microsandbox.*;

public class Example {
    public static void main(String[] args) {
        // Create a Python sandbox
        PythonSandbox sandbox = Microsandbox.python("my-sandbox");

        try {
            // Start the sandbox
            sandbox.start();

            // Execute Python code
            Execution result = sandbox.runPython("print('Hello from Java SDK!')");

            // Get the output
            if (result.isSuccess()) {
                System.out.println(result.getOutput());
            }

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            // Always stop the sandbox
            try {
                sandbox.stop();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

### Node.js Code Execution

```java
// Create a Node.js sandbox
NodeSandbox sandbox = Microsandbox.node("node-example");

try {
    sandbox.start();

    // Execute JavaScript code
    Execution result = sandbox.runJS(
        "const greeting = 'Hello from Node.js!';" +
        "console.log(greeting);"
    );

    if (result.isSuccess()) {
        System.out.println(result.getOutput());
    }

} finally {
    sandbox.stop();
}
```

### Command Execution

```java
// Execute shell commands
CommandExecution cmdResult = sandbox.runCommand("ls", "-la");

if (cmdResult.isSuccess()) {
    System.out.println("Directory listing:");
    System.out.println(cmdResult.getOutput());
    System.out.println("Exit code: " + cmdResult.getExitCode());
} else {
    System.err.println("Command failed: " + cmdResult.getError());
}
```

### Resource Metrics

```java
// Get comprehensive metrics
Metrics.MetricsData metrics = sandbox.getMetrics().getAll();

System.out.printf("CPU: %.2f%%, Memory: %d MB, Disk: %d bytes\n",
    metrics.getCpuUsage(),
    metrics.getMemoryUsageMb(),
    metrics.getDiskUsageBytes());

// Or get individual metrics
double cpu = sandbox.getMetrics().getCpuUsage();
long memory = sandbox.getMetrics().getMemoryUsageMb();
```

## Advanced Usage

### Builder Pattern Configuration

```java
// Create sandbox with builder pattern
PythonSandbox sandbox = Microsandbox.pythonBuilder()
    .name("advanced-sandbox")
    .namespace("production")
    .apiKey("your-api-key")
    .build();
```

### Package Management

```java
// Install Python packages
CommandExecution installResult = sandbox.installPackage("requests");
if (installResult.isSuccess()) {
    // Use the installed package
    Execution result = sandbox.runPython(
        "import requests\n" +
        "response = requests.get('https://api.github.com')\n" +
        "print(f'Status: {response.status_code}')"
    );
}

// Install npm packages in Node.js sandbox
NodeSandbox nodeSandbox = Microsandbox.node();
nodeSandbox.start();
nodeSandbox.installNpmPackage("lodash");
```

### Error Handling

```java
Execution result = sandbox.runPython("1/0");  // Will cause a Python error

if (result.hasError()) {
    System.err.println("Execution error: " + result.getError());
    System.err.println("Status: " + result.getStatus());
} else if (result.isSuccess()) {
    System.out.println("Output: " + result.getOutput());
}
```

### Timeouts

```java
// Execute with timeout
Execution result = sandbox.runPython("import time; time.sleep(5)", 10); // 10 second timeout
CommandExecution cmdResult = sandbox.runCommand("sleep", 2, "1"); // 2 second timeout, 1 second sleep
```

## Configuration

### Environment Variables

- `MSB_API_KEY`: API key for Microsandbox server authentication
- `MSB_SERVER_URL`: Microsandbox server URL (default: `http://127.0.0.1:5555`)

### Start Parameters

```java
// Start with custom resources
sandbox.start(
    "python:3.11-slim", // Docker image (null for language default)
    1024,               // Memory in MB (0 for default 512MB)
    2                   // CPU cores (0 for default 1)
);
```

## Examples

The SDK includes comprehensive examples in the `src/main/java/dev/microsandbox/examples` directory:

- **[HelloExample.java](src/main/java/dev/microsandbox/examples/HelloExample.java)**: Basic usage and code execution
- **[NodeExample.java](src/main/java/dev/microsandbox/examples/NodeExample.java)**: Node.js specific functionality
- **[CommandExample.java](src/main/java/dev/microsandbox/examples/CommandExample.java)**: Shell command execution patterns
- **[MetricsExample.java](src/main/java/dev/microsandbox/examples/MetricsExample.java)**: Resource monitoring
- **[AdvancedExample.java](src/main/java/dev/microsandbox/examples/AdvancedExample.java)**: Advanced patterns including concurrency

### Running Examples

```bash
# Build the project
mvn clean install

# Run the default example (HelloExample)
mvn exec:java

# Run a specific example
mvn exec:java -Dexec.mainClass="dev.microsandbox.examples.NodeExample"
mvn exec:java -Dexec.mainClass="dev.microsandbox.examples.MetricsExample"
```

## API Reference

### Core Classes

- **`Microsandbox`**: Factory class for creating sandbox instances
- **`PythonSandbox`**: Python-specific sandbox implementation
- **`NodeSandbox`**: Node.js-specific sandbox implementation
- **`Execution`**: Result of code execution
- **`CommandExecution`**: Result of command execution
- **`Metrics`**: Access to resource usage metrics

### Key Methods

#### PythonSandbox
- `runPython(String code)`: Execute Python code
- `installPackage(String packageName)`: Install pip package
- `getPythonVersion()`: Get Python version

#### NodeSandbox
- `runJS(String code)`: Execute JavaScript code
- `installNpmPackage(String packageName)`: Install npm package
- `getNodeVersion()`: Get Node.js version

#### BaseSandbox (Common)
- `start()`: Start the sandbox
- `stop()`: Stop and cleanup the sandbox
- `runCommand(String command, String... args)`: Execute shell command
- `getMetrics()`: Get resource metrics

## Requirements

- Java 8 or higher
- Running Microsandbox server (default: http://127.0.0.1:5555)
- API key (if authentication is enabled on the server)

## Performance

- **HTTP Connection Pooling**: Efficient connection reuse with OkHttp
- **JSON Processing**: Fast JSON parsing with Jackson
- **Thread Safety**: All operations are thread-safe
- **Resource Management**: Proper cleanup and resource management

## Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for information on building from source and contributing to the project.

## License

[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)
