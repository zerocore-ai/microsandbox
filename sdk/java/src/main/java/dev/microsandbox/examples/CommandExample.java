package dev.microsandbox.examples;

import dev.microsandbox.*;

import java.io.IOException;

/**
 * Example demonstrating command execution functionality.
 *
 * This example shows:
 * - Executing shell commands
 * - Handling command output and errors
 * - Working with exit codes
 * - Command timeouts
 */
public class CommandExample {

    public static void main(String[] args) {
        // Create a Python sandbox (could be Node.js too)
        PythonSandbox sandbox = Microsandbox.python("command-example");

        try {
            // Start the sandbox
            System.out.println("Starting sandbox...");
            sandbox.start();

            // Execute basic commands
            System.out.println("=== Basic Commands ===");

            // List current directory
            CommandExecution lsCmd = sandbox.runCommand("ls", "-la");
            if (lsCmd.isSuccess()) {
                System.out.println("Directory listing:\n" + lsCmd.getOutput());
            } else {
                System.err.println("ls command failed: " + lsCmd.getError());
            }

            // Check current working directory
            CommandExecution pwdCmd = sandbox.runCommand("pwd");
            if (pwdCmd.isSuccess()) {
                System.out.println("Current directory: " + pwdCmd.getOutput().trim());
            }

            // Get system information
            System.out.println("\n=== System Information ===");

            CommandExecution unameCmd = sandbox.runCommand("uname", "-a");
            if (unameCmd.isSuccess()) {
                System.out.println("System info: " + unameCmd.getOutput().trim());
            }

            CommandExecution dfCmd = sandbox.runCommand("df", "-h");
            if (dfCmd.isSuccess()) {
                System.out.println("Disk usage:\n" + dfCmd.getOutput());
            }

            // Demonstrate error handling
            System.out.println("\n=== Error Handling ===");

            CommandExecution errorCmd = sandbox.runCommand("ls", "/nonexistent-directory");
            if (errorCmd.isSuccess()) {
                System.out.println("Unexpected success: " + errorCmd.getOutput());
            } else {
                System.out.println("Expected error occurred:");
                System.out.println("Exit code: " + errorCmd.getExitCode());
                System.out.println("Error output: " + errorCmd.getError().trim());
            }

            // File operations
            System.out.println("\n=== File Operations ===");

            // Create a file
            CommandExecution createCmd = sandbox.runCommand("echo", "Hello from Java SDK!", ">", "test.txt");
            if (createCmd.isSuccess()) {
                System.out.println("File created successfully");
            }

            // Read the file
            CommandExecution catCmd = sandbox.runCommand("cat", "test.txt");
            if (catCmd.isSuccess()) {
                System.out.println("File content: " + catCmd.getOutput().trim());
            }

            // Count lines in the file
            CommandExecution wcCmd = sandbox.runCommand("wc", "-l", "test.txt");
            if (wcCmd.isSuccess()) {
                System.out.println("Line count: " + wcCmd.getOutput().trim());
            }

            // Demonstrate command with timeout
            System.out.println("\n=== Timeout Example ===");

            try {
                CommandExecution timeoutCmd = sandbox.runCommand("sleep", 2, "1"); // 2 second timeout, 1 second sleep
                if (timeoutCmd.isSuccess()) {
                    System.out.println("Sleep command completed normally");
                } else if (timeoutCmd.isTimeout()) {
                    System.out.println("Command timed out as expected");
                }
            } catch (Exception e) {
                System.out.println("Timeout handling: " + e.getMessage());
            }

            // Process information
            System.out.println("\n=== Process Information ===");

            CommandExecution psCmd = sandbox.runCommand("ps", "aux");
            if (psCmd.isSuccess()) {
                System.out.println("Running processes:\n" + psCmd.getOutput());
            }

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
}