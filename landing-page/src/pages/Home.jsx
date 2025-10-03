import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="inline-flex items-center rounded-full bg-purple-500/10 px-4 py-2 mb-8 border border-purple-500/20">
              <span className="text-sm font-medium text-purple-300">
                ✨ Easy Secure Execution of Untrusted User/AI Code
              </span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl mb-6">
              Execute Untrusted Code
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Without Compromise
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              microsandbox combines hardware-level VM isolation with lightning-fast startup times.
              Run AI-generated code, user submissions, or experimental code with confidence.
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#get-started"
                className="rounded-md bg-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-all"
              >
                Get Started
              </a>
              <a
                href="https://docs.microsandbox.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold leading-6 text-white hover:text-purple-300 transition-colors"
              >
                View Documentation <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Highlight */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-600/20 mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Strong Isolation</h3>
              <p className="text-gray-400">Hardware-level VM isolation with microVMs. No shared kernels, no sophisticated breakout attacks.</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-600/20 mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Instant Startup</h3>
              <p className="text-gray-400">Boot times under 200ms, not 10+ seconds. Get instant feedback and iterate quickly.</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-600/20 mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Your Infrastructure</h3>
              <p className="text-gray-400">Self-hosted with full control. No cloud provider lock-in, no surprises.</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-600/20 mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">OCI Compatible</h3>
              <p className="text-gray-400">Works with standard container images. Use your existing Docker images seamlessly.</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-600/20 mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI-Ready</h3>
              <p className="text-gray-400">Built-in MCP support for seamless AI integration. Works directly with Claude and other AI tools.</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-600/20 mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Multi-Language SDKs</h3>
              <p className="text-gray-400">SDKs for Python, JavaScript, Rust, Go, and 25+ more languages. Use your favorite language.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-6 lg:px-8 bg-gray-900/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              Built for Real-World Use Cases
            </h2>
            <p className="text-lg text-gray-400">
              From AI coding assistants to data analysis, microsandbox powers secure execution everywhere
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gray-800 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">🧑‍💻 Coding & Dev Environments</h3>
                <p className="text-gray-400 mb-4">
                  Let your AI agents build real apps with professional dev tools. Handle Git operations,
                  dependency management, and testing in a protected environment with instant feedback.
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>AI pair programming platforms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>Coding education platforms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>Automated code generation</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gray-800 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">📊 Data Analysis</h3>
                <p className="text-gray-400 mb-4">
                  Transform raw numbers into meaningful insights with AI. Process data, create charts,
                  and generate reports safely with powerful libraries like NumPy, Pandas, and TensorFlow.
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>Financial analysis tools</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>Privacy-focused data processing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>Medical research platforms</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gray-800 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">🌐 Web Browsing Agents</h3>
                <p className="text-gray-400 mb-4">
                  Build AI assistants that can browse the web. Navigate websites, extract data,
                  fill out forms, and handle logins in a contained environment.
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>Price comparison tools</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>Research assistants</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>Web automation workflows</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gray-800 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">🚀 Instant App Hosting</h3>
                <p className="text-gray-400 mb-4">
                  Share working apps and demos in seconds without deployment headaches.
                  Zero-setup deployment with automatic cleanup when no longer needed.
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>Educational platforms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>AI-generated live demos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>Rapid prototyping</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section id="get-started" className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-lg text-gray-400">
              Three simple steps to secure code execution
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600 text-white text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Start the Server</h3>
              <div className="bg-gray-800 rounded-lg p-4 text-left">
                <code className="text-sm text-green-400">
                  curl -sSL https://get.microsandbox.dev | sh<br/>
                  msb server start --dev
                </code>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600 text-white text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Install the SDK</h3>
              <div className="bg-gray-800 rounded-lg p-4 text-left">
                <code className="text-sm text-green-400">
                  pip install microsandbox<br/>
                  # or<br/>
                  npm install microsandbox
                </code>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600 text-white text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Execute Code</h3>
              <div className="bg-gray-800 rounded-lg p-4 text-left overflow-x-auto">
                <code className="text-sm text-green-400 whitespace-pre">
{`async with PythonSandbox.create() as sb:
  exec = await sb.run("print('Hello!')")
  print(await exec.output())`}
                </code>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/features"
              className="inline-flex items-center rounded-md bg-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-all"
            >
              Explore All Features
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-r from-purple-900 to-pink-900">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Ready to Execute Code Safely?
          </h2>
          <p className="text-lg text-gray-200 mb-8">
            Join developers building the future of secure code execution
          </p>
          <div className="flex items-center justify-center gap-x-6">
            <a
              href="https://docs.microsandbox.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-white px-8 py-3 text-sm font-semibold text-purple-900 shadow-sm hover:bg-gray-100 transition-all"
            >
              View Documentation
            </a>
            <a
              href="https://github.com/microsandbox/microsandbox"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold leading-6 text-white hover:text-gray-200 transition-colors"
            >
              View on GitHub <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
