package dev.microsandbox.examples;

import dev.microsandbox.*;

import java.io.IOException;

/**
 * Example demonstrating resource metrics functionality.
 *
 * This example shows:
 * - Getting sandbox resource metrics
 * - Monitoring CPU, memory, and disk usage
 * - Tracking metrics over time during workload
 */
public class MetricsExample {

    public static void main(String[] args) {
        // Create a Python sandbox
        PythonSandbox sandbox = Microsandbox.python("metrics-example");

        try {
            // Start the sandbox
            System.out.println("Starting sandbox...");
            sandbox.start();

            // Get initial metrics
            System.out.println("=== Initial Metrics ===");
            printMetrics(sandbox);

            // Execute some CPU-intensive code
            System.out.println("\n=== Running CPU-intensive workload ===");
            Execution cpuWork = sandbox.runPython(
                "import time\n" +
                "import math\n" +
                "print('Starting CPU-intensive calculation...')\n" +
                "start = time.time()\n" +
                "result = sum(math.sqrt(i) for i in range(100000))\n" +
                "end = time.time()\n" +
                "print(f'Calculation completed in {end - start:.2f} seconds')\n" +
                "print(f'Result: {result:.2f}')"
            );

            if (cpuWork.isSuccess()) {
                System.out.println("CPU work output:\n" + cpuWork.getOutput());
            }

            // Check metrics after CPU work
            System.out.println("\n=== Metrics After CPU Work ===");
            printMetrics(sandbox);

            // Execute memory-intensive code
            System.out.println("\n=== Running memory-intensive workload ===");
            Execution memoryWork = sandbox.runPython(
                "import sys\n" +
                "print('Creating large data structures...')\n" +
                "data = []\n" +
                "for i in range(50000):\n" +
                "    data.append(list(range(100)))\n" +
                "print(f'Created data structure with {len(data)} elements')\n" +
                "print(f'Memory usage of data: {sys.getsizeof(data)} bytes')\n" +
                "# Clean up\n" +
                "del data\n" +
                "print('Data cleaned up')"
            );

            if (memoryWork.isSuccess()) {
                System.out.println("Memory work output:\n" + memoryWork.getOutput());
            }

            // Check metrics after memory work
            System.out.println("\n=== Metrics After Memory Work ===");
            printMetrics(sandbox);

            // Install a package to increase disk usage
            System.out.println("\n=== Installing package to increase disk usage ===");
            CommandExecution installCmd = sandbox.installPackage("requests");
            if (installCmd.isSuccess()) {
                System.out.println("Package installed successfully");
            }

            // Check final metrics
            System.out.println("\n=== Final Metrics ===");
            printMetrics(sandbox);

            // Demonstrate individual metric retrieval
            System.out.println("\n=== Individual Metrics ===");
            Metrics metrics = sandbox.getMetrics();
            System.out.printf("CPU Usage: %.2f%%\n", metrics.getCpuUsage());
            System.out.printf("Memory Usage: %d MB\n", metrics.getMemoryUsageMb());
            System.out.printf("Disk Usage: %d bytes\n", metrics.getDiskUsageBytes());

        } catch (IOException e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        } finally {
            // Clean up
            try {
                sandbox.stop();
                System.out.println("\nSandbox stopped successfully.");
            } catch (IOException e) {
                System.err.println("Error stopping sandbox: " + e.getMessage());
            }
        }
    }

    private static void printMetrics(PythonSandbox sandbox) {
        try {
            Metrics.MetricsData metrics = sandbox.getMetrics().getAll();
            System.out.printf("CPU: %.2f%%, Memory: %d MB, Disk: %d bytes, Uptime: %d seconds\n",
                    metrics.getCpuUsage(),
                    metrics.getMemoryUsageMb(),
                    metrics.getDiskUsageBytes(),
                    metrics.getUptimeSeconds());

            if (metrics.getNetworkBytesSent() > 0 || metrics.getNetworkBytesReceived() > 0) {
                System.out.printf("Network - Sent: %d bytes, Received: %d bytes\n",
                        metrics.getNetworkBytesSent(),
                        metrics.getNetworkBytesReceived());
            }
        } catch (IOException e) {
            System.err.println("Failed to get metrics: " + e.getMessage());
        }
    }
}