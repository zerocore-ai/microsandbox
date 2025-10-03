package dev.microsandbox.examples;

import dev.microsandbox.*;

import java.io.IOException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 * Advanced example demonstrating more sophisticated usage patterns.
 *
 * This example shows:
 * - Builder pattern for configuration
 * - Concurrent execution with multiple sandboxes
 * - Resource management patterns
 * - Error handling strategies
 */
public class AdvancedExample {

    public static void main(String[] args) {
        demonstrateBuilderPattern();
        demonstrateConcurrentExecution();
        demonstrateResourceManagement();
    }

    private static void demonstrateBuilderPattern() {
        System.out.println("=== Builder Pattern Example ===");

        // Create sandbox with builder pattern
        PythonSandbox sandbox = Microsandbox.pythonBuilder()
            .name("builder-example")
            .namespace("development")
            .build();

        try {
            sandbox.start();

            Execution result = sandbox.runPython("print('Builder pattern sandbox works!')");
            if (result.isSuccess()) {
                System.out.println("Output: " + result.getOutput().trim());
            }

            // Get some info about the sandbox
            System.out.println("Sandbox ID: " + sandbox.getSandboxId());
            System.out.println("Is started: " + sandbox.isStarted());

        } catch (IOException e) {
            System.err.println("Builder pattern example failed: " + e.getMessage());
        } finally {
            try {
                sandbox.stop();
            } catch (IOException e) {
                System.err.println("Error stopping sandbox: " + e.getMessage());
            }
        }
    }

    private static void demonstrateConcurrentExecution() {
        System.out.println("\n=== Concurrent Execution Example ===");

        ExecutorService executor = Executors.newFixedThreadPool(3);

        try {
            // Create multiple sandboxes concurrently
            CompletableFuture<String> pythonTask = CompletableFuture.supplyAsync(() -> {
                try {
                    PythonSandbox sandbox = Microsandbox.python("concurrent-python");
                    sandbox.start();

                    Execution result = sandbox.runPython(
                        "import time\n" +
                        "import random\n" +
                        "time.sleep(random.uniform(0.5, 1.5))\n" +
                        "print('Python task completed')"
                    );

                    String output = result.isSuccess() ? result.getOutput().trim() : "Failed";
                    sandbox.stop();
                    return "Python: " + output;
                } catch (IOException e) {
                    return "Python: Error - " + e.getMessage();
                }
            }, executor);

            CompletableFuture<String> nodeTask = CompletableFuture.supplyAsync(() -> {
                try {
                    NodeSandbox sandbox = Microsandbox.node("concurrent-node");
                    sandbox.start();

                    Execution result = sandbox.runJS(
                        "const delay = Math.random() * 1000 + 500;\n" +
                        "setTimeout(() => {\n" +
                        "    console.log('Node.js task completed');\n" +
                        "}, delay);\n" +
                        "console.log('Node.js task started');"
                    );

                    String output = result.isSuccess() ? result.getOutput().trim() : "Failed";
                    sandbox.stop();
                    return "Node.js: " + output;
                } catch (IOException e) {
                    return "Node.js: Error - " + e.getMessage();
                }
            }, executor);

            CompletableFuture<String> commandTask = CompletableFuture.supplyAsync(() -> {
                try {
                    PythonSandbox sandbox = Microsandbox.python("concurrent-commands");
                    sandbox.start();

                    CommandExecution result = sandbox.runCommand("echo", "Command task completed");

                    String output = result.isSuccess() ? result.getOutput().trim() : "Failed";
                    sandbox.stop();
                    return "Command: " + output;
                } catch (IOException e) {
                    return "Command: Error - " + e.getMessage();
                }
            }, executor);

            // Wait for all tasks to complete
            CompletableFuture<Void> allTasks = CompletableFuture.allOf(pythonTask, nodeTask, commandTask);
            allTasks.get(30, TimeUnit.SECONDS);

            // Print results
            System.out.println(pythonTask.get());
            System.out.println(nodeTask.get());
            System.out.println(commandTask.get());

        } catch (Exception e) {
            System.err.println("Concurrent execution failed: " + e.getMessage());
        } finally {
            executor.shutdown();
        }
    }

    private static void demonstrateResourceManagement() {
        System.out.println("\n=== Resource Management Example ===");

        // Using try-with-resources pattern (would need to implement AutoCloseable)
        PythonSandbox sandbox = Microsandbox.python("resource-management");

        try {
            sandbox.start();

            // Monitor resource usage during execution
            System.out.println("Starting resource-intensive work...");

            // Start monitoring in a separate thread
            Thread metricsThread = new Thread(() -> {
                for (int i = 0; i < 5; i++) {
                    try {
                        Thread.sleep(1000);
                        Metrics.MetricsData metrics = sandbox.getMetrics().getAll();
                        System.out.printf("Monitor [%ds]: CPU: %.1f%%, Memory: %d MB\n",
                                i + 1, metrics.getCpuUsage(), metrics.getMemoryUsageMb());
                    } catch (Exception e) {
                        break;
                    }
                }
            });
            metricsThread.start();

            // Execute resource-intensive code
            Execution result = sandbox.runPython(
                "import time\n" +
                "import gc\n" +
                "print('Starting intensive computation...')\n" +
                "data = [i**2 for i in range(100000)]\n" +
                "time.sleep(2)\n" +
                "result = sum(data)\n" +
                "print(f'Computation result: {result}')\n" +
                "del data\n" +
                "gc.collect()\n" +
                "print('Resources cleaned up')"
            );

            metricsThread.join();

            if (result.isSuccess()) {
                System.out.println("Final output: " + result.getOutput().trim());
                System.out.println("Execution time: " + result.getExecutionTime() + "ms");
            }

            // Final metrics
            Metrics.MetricsData finalMetrics = sandbox.getMetrics().getAll();
            System.out.println("Final metrics: " + finalMetrics);

        } catch (Exception e) {
            System.err.println("Resource management example failed: " + e.getMessage());
        } finally {
            try {
                sandbox.stop();
                System.out.println("Resources cleaned up successfully");
            } catch (IOException e) {
                System.err.println("Error during cleanup: " + e.getMessage());
            }
        }
    }
}