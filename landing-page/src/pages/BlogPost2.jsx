import React from 'react';
import { Link } from 'react-router-dom';

const BlogPost2 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <section className="relative px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link to="/blog" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300 border border-purple-500/20">
                Tutorial
              </span>
              <span className="text-sm text-gray-400">12 min read</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Building an AI Coding Assistant with microsandbox: A Complete Guide
            </h1>

            <div className="flex items-center text-gray-400 text-sm">
              <span className="font-medium text-gray-300">microsandbox Team</span>
              <span className="mx-2">•</span>
              <span>October 1, 2025</span>
            </div>
          </div>

          <div className="text-6xl mb-12 text-center">🤖</div>
        </div>
      </section>

      {/* Content */}
      <article className="px-6 lg:px-8 pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 mb-8">
              <p className="text-xl text-gray-300 italic">
                AI coding assistants like GitHub Copilot, ChatGPT, and Claude have transformed how we write code.
                But what if you want to build your own AI assistant that can not just suggest code, but actually
                run it safely? This comprehensive guide will show you how to build a secure AI coding assistant
                using microsandbox.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6">Why AI Needs Secure Code Execution</h2>

            <p className="text-gray-300 mb-6">
              Modern AI coding assistants are powerful, but most of them stop at code generation. They can write
              Python, JavaScript, or any language you need—but they can't verify that the code actually works.
              That's where secure code execution comes in.
            </p>

            <div className="bg-purple-900/20 border border-purple-600 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-purple-300 mb-3">The AI Execution Challenge</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  AI-generated code can contain bugs or even malicious logic
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  Running untrusted code locally risks your entire system
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  Traditional sandboxing solutions are too slow for good UX
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  Users expect instant feedback when code runs
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6">What We'll Build</h2>

            <p className="text-gray-300 mb-6">
              In this tutorial, we'll build a complete AI coding assistant that can:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="text-3xl mb-3">✨</div>
                <h3 className="text-lg font-bold text-white mb-2">Generate Code</h3>
                <p className="text-gray-300 text-sm">Use AI (Claude, OpenAI, or any LLM) to write code based on natural language prompts</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="text-lg font-bold text-white mb-2">Execute Safely</h3>
                <p className="text-gray-300 text-sm">Run the generated code in isolated microsandbox environments</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="text-lg font-bold text-white mb-2">Show Results</h3>
                <p className="text-gray-300 text-sm">Display execution output, errors, and logs to the user</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="text-3xl mb-3">🔄</div>
                <h3 className="text-lg font-bold text-white mb-2">Iterate & Fix</h3>
                <p className="text-gray-300 text-sm">Let AI fix errors and improve the code automatically</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6">Prerequisites</h2>

            <div className="bg-gray-800 rounded-xl p-6 mb-8">
              <p className="text-gray-300 mb-4">Before we start, make sure you have:</p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  microsandbox installed and server running
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  An AI API key (Claude, OpenAI, or similar)
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Python 3.8+ or Node.js 16+
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic understanding of async programming
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6">Step 1: Set Up microsandbox</h2>

            <p className="text-gray-300 mb-6">
              First, let's install and configure microsandbox. If you haven't already, run:
            </p>

            <div className="bg-gray-900 rounded-xl p-6 mb-8 font-mono text-sm overflow-x-auto">
              <div className="text-gray-400 mb-2"># Install microsandbox</div>
              <div className="text-green-400 mb-4">curl -sSL https://get.microsandbox.dev | sh</div>

              <div className="text-gray-400 mb-2"># Start the server</div>
              <div className="text-green-400 mb-4">msb server start --dev</div>

              <div className="text-gray-400 mb-2"># Install Python SDK</div>
              <div className="text-green-400">pip install microsandbox anthropic</div>
            </div>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6">Step 2: Create the AI Code Generator</h2>

            <p className="text-gray-300 mb-6">
              Let's create a function that uses Claude (Anthropic's AI) to generate code based on user prompts:
            </p>

            <div className="bg-gray-900 rounded-xl p-6 mb-8 font-mono text-sm overflow-x-auto">
              <pre className="text-green-400">{`import anthropic
import os

class AICodeGenerator:
    def __init__(self):
        self.client = anthropic.Anthropic(
            api_key=os.environ.get("ANTHROPIC_API_KEY")
        )

    async def generate_code(self, prompt: str, language: str = "python"):
        """Generate code based on natural language prompt"""

        system_prompt = f"""You are an expert {language} programmer.
        Generate clean, well-commented code based on the user's request.
        Only return the code, no explanations."""

        message = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            system=system_prompt,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        return message.content[0].text`}</pre>
            </div>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6">Step 3: Create the Code Executor</h2>

            <p className="text-gray-300 mb-6">
              Now let's build a wrapper around microsandbox to execute the AI-generated code safely:
            </p>

            <div className="bg-gray-900 rounded-xl p-6 mb-8 font-mono text-sm overflow-x-auto">
              <pre className="text-green-400">{`from microsandbox import PythonSandbox
import asyncio

class SafeCodeExecutor:
    def __init__(self):
        self.sandbox = None

    async def execute(self, code: str):
        """Execute code in a secure microsandbox"""

        try:
            # Create a new sandbox
            async with PythonSandbox.create(
                name="ai-assistant",
                timeout=30
            ) as sandbox:
                # Execute the code
                execution = await sandbox.run(code)

                # Get output and errors
                output = await execution.output()
                errors = await execution.errors()

                return {
                    "success": execution.exit_code == 0,
                    "output": output,
                    "errors": errors,
                    "exit_code": execution.exit_code
                }

        except Exception as e:
            return {
                "success": False,
                "output": "",
                "errors": str(e),
                "exit_code": -1
            }`}</pre>
            </div>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6">Step 4: Combine AI + Sandbox</h2>

            <p className="text-gray-300 mb-6">
              Now let's create the main assistant class that combines code generation with safe execution:
            </p>

            <div className="bg-gray-900 rounded-xl p-6 mb-8 font-mono text-sm overflow-x-auto">
              <pre className="text-green-400">{`class AICodingAssistant:
    def __init__(self):
        self.generator = AICodeGenerator()
        self.executor = SafeCodeExecutor()

    async def process_request(self, user_prompt: str):
        """Process user request end-to-end"""

        print(f"🤖 Generating code for: {user_prompt}")

        # Step 1: Generate code with AI
        code = await self.generator.generate_code(user_prompt)
        print(f"✨ Generated code:\\n{code}\\n")

        # Step 2: Execute in microsandbox
        print("🚀 Executing in secure sandbox...")
        result = await self.executor.execute(code)

        # Step 3: Handle results
        if result["success"]:
            print(f"✅ Success! Output:\\n{result['output']}")
        else:
            print(f"❌ Error:\\n{result['errors']}")

            # Step 4: Auto-fix if there's an error
            print("🔧 Attempting to fix...")
            fixed_code = await self.fix_code(code, result['errors'])

            if fixed_code:
                result = await self.executor.execute(fixed_code)
                if result["success"]:
                    print(f"✅ Fixed! Output:\\n{result['output']}")

        return result

    async def fix_code(self, code: str, error: str):
        """Ask AI to fix the code based on error"""
        fix_prompt = f"""This code has an error:

Code:
{code}

Error:
{error}

Please fix the code and return only the corrected code."""

        return await self.generator.generate_code(fix_prompt)`}</pre>
            </div>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6">Step 5: Create the User Interface</h2>

            <p className="text-gray-300 mb-6">
              Let's create a simple command-line interface for our AI assistant:
            </p>

            <div className="bg-gray-900 rounded-xl p-6 mb-8 font-mono text-sm overflow-x-auto">
              <pre className="text-green-400">{`async def main():
    """Main CLI interface"""

    assistant = AICodingAssistant()

    print("🤖 AI Coding Assistant with microsandbox")
    print("=" * 50)
    print("Enter your coding requests (or 'quit' to exit)\\n")

    while True:
        user_input = input("You: ")

        if user_input.lower() in ['quit', 'exit', 'q']:
            print("👋 Goodbye!")
            break

        if not user_input.strip():
            continue

        try:
            await assistant.process_request(user_input)
        except Exception as e:
            print(f"❌ Error: {e}")

        print()  # Empty line for readability

if __name__ == "__main__":
    asyncio.run(main())`}</pre>
            </div>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6">Step 6: Test Your AI Assistant</h2>

            <p className="text-gray-300 mb-6">
              Now let's test our AI coding assistant with some real examples:
            </p>

            <div className="bg-gray-800 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Example Prompts to Try:</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-purple-600 pl-4">
                  <p className="text-purple-300 font-semibold mb-1">Basic Math</p>
                  <p className="text-gray-300 text-sm">"Write a function to calculate fibonacci numbers"</p>
                </div>
                <div className="border-l-4 border-purple-600 pl-4">
                  <p className="text-purple-300 font-semibold mb-1">Data Processing</p>
                  <p className="text-gray-300 text-sm">"Read a CSV file and calculate average of column values"</p>
                </div>
                <div className="border-l-4 border-purple-600 pl-4">
                  <p className="text-purple-300 font-semibold mb-1">Web Scraping</p>
                  <p className="text-gray-300 text-sm">"Fetch and parse HTML from a website"</p>
                </div>
                <div className="border-l-4 border-purple-600 pl-4">
                  <p className="text-purple-300 font-semibold mb-1">API Integration</p>
                  <p className="text-gray-300 text-sm">"Make a REST API call and format the JSON response"</p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6">Advanced Features to Add</h2>

            <p className="text-gray-300 mb-6">
              Once you have the basic assistant working, consider adding these features:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-3">📦 Package Management</h3>
                <p className="text-gray-300 text-sm mb-3">Let AI install dependencies automatically</p>
                <div className="bg-gray-900 rounded p-3 font-mono text-xs text-green-400">
                  await sandbox.run("pip install requests")
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-3">💾 File Persistence</h3>
                <p className="text-gray-300 text-sm mb-3">Save and reuse files between executions</p>
                <div className="bg-gray-900 rounded p-3 font-mono text-xs text-green-400">
                  await sandbox.upload_file("data.csv")
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-3">🌐 Network Access</h3>
                <p className="text-gray-300 text-sm mb-3">Enable controlled internet access</p>
                <div className="bg-gray-900 rounded p-3 font-mono text-xs text-green-400">
                  sandbox.enable_network()
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-3">📊 Visualization</h3>
                <p className="text-gray-300 text-sm mb-3">Display charts and plots generated by code</p>
                <div className="bg-gray-900 rounded p-3 font-mono text-xs text-green-400">
                  images = await sandbox.get_images()
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-3">🔄 Multi-Language</h3>
                <p className="text-gray-300 text-sm mb-3">Support Python, JavaScript, Rust, etc.</p>
                <div className="bg-gray-900 rounded p-3 font-mono text-xs text-green-400">
                  NodeSandbox, RustSandbox...
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-3">⏱️ Timeout Control</h3>
                <p className="text-gray-300 text-sm mb-3">Prevent infinite loops</p>
                <div className="bg-gray-900 rounded p-3 font-mono text-xs text-green-400">
                  sandbox.timeout = 10  # seconds
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6">Best Practices & Security Tips</h2>

            <div className="space-y-4 mb-8">
              <div className="bg-green-900/20 border border-green-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3">✅ Do This</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Always use microsandbox for untrusted code execution</li>
                  <li>• Set appropriate resource limits (CPU, memory, time)</li>
                  <li>• Log all code executions for audit purposes</li>
                  <li>• Validate AI-generated code before execution</li>
                  <li>• Use read-only file systems when possible</li>
                </ul>
              </div>

              <div className="bg-red-900/20 border border-red-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-400 mb-3">❌ Don't Do This</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Never execute AI code directly on your host system</li>
                  <li>• Don't grant unlimited network access</li>
                  <li>• Avoid running production credentials in sandboxes</li>
                  <li>• Don't skip timeout limits</li>
                  <li>• Never trust AI-generated code without validation</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6">Performance Optimization</h2>

            <p className="text-gray-300 mb-6">
              To make your AI assistant fast and responsive:
            </p>

            <div className="bg-gray-800 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Optimization Techniques</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-purple-400 font-bold mr-3 mt-1">1.</span>
                  <div>
                    <p className="text-white font-semibold">Reuse Sandboxes</p>
                    <p className="text-gray-400 text-sm">Keep sandboxes alive between requests instead of recreating them</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-400 font-bold mr-3 mt-1">2.</span>
                  <div>
                    <p className="text-white font-semibold">Parallel Execution</p>
                    <p className="text-gray-400 text-sm">Run multiple sandboxes concurrently for different users</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-400 font-bold mr-3 mt-1">3.</span>
                  <div>
                    <p className="text-white font-semibold">Pre-warm Sandboxes</p>
                    <p className="text-gray-400 text-sm">Create sandbox pool ahead of time for instant availability</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-400 font-bold mr-3 mt-1">4.</span>
                  <div>
                    <p className="text-white font-semibold">Cache Dependencies</p>
                    <p className="text-gray-400 text-sm">Pre-install common packages in your sandbox images</p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6">Real-World Use Cases</h2>

            <p className="text-gray-300 mb-6">
              AI coding assistants built with microsandbox are being used for:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <p className="text-white font-semibold">📚 Interactive Tutorials</p>
                <p className="text-gray-400 text-sm">Students learn by prompting AI and seeing real execution</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <p className="text-white font-semibold">🔧 DevOps Automation</p>
                <p className="text-gray-400 text-sm">Generate and test infrastructure scripts safely</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <p className="text-white font-semibold">📊 Data Analysis</p>
                <p className="text-gray-400 text-sm">Business users analyze data using natural language</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <p className="text-white font-semibold">🧪 Code Review</p>
                <p className="text-gray-400 text-sm">AI generates tests and verifies they pass</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6">Conclusion</h2>

            <p className="text-gray-300 mb-6">
              Building an AI coding assistant that can safely execute code opens up incredible possibilities. With
              microsandbox, you get hardware-level isolation with sub-200ms startup times—fast enough for real-time
              interactive experiences.
            </p>

            <p className="text-gray-300 mb-6">
              The key takeaways:
            </p>

            <ul className="space-y-2 mb-8 text-gray-300">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">✓</span>
                Never execute untrusted AI code without proper isolation
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">✓</span>
                microsandbox provides the security you need without sacrificing performance
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">✓</span>
                Combine AI code generation with automatic execution and error fixing
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">✓</span>
                Add features like file handling, networking, and multi-language support as needed
              </li>
            </ul>

            <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-2xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-4">Build Your AI Assistant Today</h3>
              <p className="text-gray-200 mb-6">
                Get started with microsandbox and create the next generation of AI-powered tools
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://docs.microsandbox.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-md bg-white px-8 py-3 text-sm font-semibold text-purple-900 shadow-sm hover:bg-gray-100 transition-all"
                >
                  View Full Docs
                </a>
                <a
                  href="https://github.com/microsandbox/microsandbox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-md bg-purple-700 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-600 transition-all border border-purple-600"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-400">Tags:</span>
              {["AI", "Tutorial", "MCP", "Python", "Claude", "Code Generation"].map((tag, idx) => (
                <span key={idx} className="text-sm bg-gray-800 text-purple-300 px-3 py-1 rounded-full border border-gray-700">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Share */}
          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Share this article:</span>
              <div className="flex gap-4">
                <button className="text-gray-400 hover:text-purple-400 transition-colors">Twitter</button>
                <button className="text-gray-400 hover:text-purple-400 transition-colors">LinkedIn</button>
                <button className="text-gray-400 hover:text-purple-400 transition-colors">Copy Link</button>
              </div>
            </div>
          </div>

          {/* Back to Blog */}
          <div className="mt-12 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to all posts
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost2;
