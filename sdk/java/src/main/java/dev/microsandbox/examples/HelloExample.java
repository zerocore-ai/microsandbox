package dev.microsandbox.examples;

import dev.microsandbox.*;

import java.io.IOException;

/**
 * Basic example showing how to use the Microsandbox Java SDK.
 *
 * This example demonstrates:
 * - Creating a Python sandbox
 * - Executing Python code
 * - Getting execution results
 * - Proper resource cleanup
 */
public class HelloExample {

    public static void main(String[] args) {
        // Create a Python sandbox
        PythonSandbox sandbox = Microsandbox.python("hello-example");

        try {
            // Start the sandbox
            System.out.println("Starting Python sandbox...");
            sandbox.start();

            // Execute some Python code
            System.out.println("Executing Python code...");
            Execution result = sandbox.runPython("print('Hello from the Microsandbox Java SDK!')");

            // Print the output
            if (result.isSuccess()) {
                System.out.println("Output: " + result.getOutput());
            } else {
                System.err.println("Execution failed: " + result.getError());
            }

            // Execute more complex code
            System.out.println("\nExecuting more complex Python code...");
            Execution mathResult = sandbox.runPython(
                "import math\n" +
                "result = math.sqrt(16) + math.pow(2, 3)\n" +
                "print(f'Math result: {result}')"
            );

            if (mathResult.isSuccess()) {
                System.out.println("Output: " + mathResult.getOutput());
            } else {
                System.err.println("Math execution failed: " + mathResult.getError());
            }

        } catch (IOException e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        } finally {
            // Always stop the sandbox to clean up resources
            try {
                sandbox.stop();
                System.out.println("\nSandbox stopped successfully.");
            } catch (IOException e) {
                System.err.println("Error stopping sandbox: " + e.getMessage());
            }
        }
    }
}
