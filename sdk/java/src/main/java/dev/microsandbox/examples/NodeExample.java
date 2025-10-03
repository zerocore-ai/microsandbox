package dev.microsandbox.examples;

import dev.microsandbox.*;

import java.io.IOException;

/**
 * Example demonstrating Node.js sandbox functionality.
 *
 * This example shows:
 * - Creating a Node.js sandbox
 * - Executing JavaScript code
 * - Installing npm packages
 * - Running commands
 */
public class NodeExample {

    public static void main(String[] args) {
        // Create a Node.js sandbox
        NodeSandbox sandbox = Microsandbox.node("node-example");

        try {
            // Start the sandbox
            System.out.println("Starting Node.js sandbox...");
            sandbox.start();

            // Execute JavaScript code
            System.out.println("Executing JavaScript code...");
            Execution jsResult = sandbox.runJS(
                "const greeting = 'Hello from Node.js!';\n" +
                "console.log(greeting);\n" +
                "const sum = [1, 2, 3, 4, 5].reduce((a, b) => a + b, 0);\n" +
                "console.log('Sum:', sum);"
            );

            if (jsResult.isSuccess()) {
                System.out.println("JavaScript Output:\n" + jsResult.getOutput());
            } else {
                System.err.println("JavaScript execution failed: " + jsResult.getError());
            }

            // Get Node.js version
            System.out.println("\nChecking Node.js version...");
            CommandExecution versionCmd = sandbox.getNodeVersion();
            if (versionCmd.isSuccess()) {
                System.out.println("Node.js version: " + versionCmd.getOutput().trim());
            }

            // Install an npm package
            System.out.println("\nInstalling lodash package...");
            CommandExecution installCmd = sandbox.installNpmPackage("lodash");
            if (installCmd.isSuccess()) {
                System.out.println("Package installed successfully!");
            } else {
                System.err.println("Failed to install package: " + installCmd.getError());
            }

            // Use the installed package
            System.out.println("\nUsing lodash in JavaScript code...");
            Execution lodashResult = sandbox.runJS(
                "const _ = require('lodash');\n" +
                "const numbers = [1, 2, 3, 4, 5];\n" +
                "const doubled = _.map(numbers, n => n * 2);\n" +
                "console.log('Original:', numbers);\n" +
                "console.log('Doubled:', doubled);\n" +
                "console.log('Sum of doubled:', _.sum(doubled));"
            );

            if (lodashResult.isSuccess()) {
                System.out.println("Lodash Output:\n" + lodashResult.getOutput());
            } else {
                System.err.println("Lodash execution failed: " + lodashResult.getError());
            }

            // List installed packages
            System.out.println("\nListing installed npm packages...");
            CommandExecution listCmd = sandbox.listNpmPackages();
            if (listCmd.isSuccess()) {
                System.out.println("Installed packages:\n" + listCmd.getOutput());
            }

        } catch (IOException e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        } finally {
            // Clean up
            try {
                sandbox.stop();
                System.out.println("\nNode.js sandbox stopped successfully.");
            } catch (IOException e) {
                System.err.println("Error stopping sandbox: " + e.getMessage());
            }
        }
    }
}