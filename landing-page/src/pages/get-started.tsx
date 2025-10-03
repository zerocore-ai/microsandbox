import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import {
  CheckIcon,
  CommandLineIcon,
  CodeBracketIcon,
  RocketLaunchIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

const GetStartedPage: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: 'Install the Server',
      description: 'Get Microsandbox running on your machine in seconds',
      code: 'curl -sSL https://get.microsandbox.dev | sh',
      details: 'The installer will automatically download and configure Microsandbox for your system.'
    },
    {
      step: 2,
      title: 'Start the Server',
      description: 'Launch the Microsandbox server with development mode enabled',
      code: 'msb server start --dev',
      details: 'Development mode provides additional logging and debugging features.'
    },
    {
      step: 3,
      title: 'Install an SDK',
      description: 'Choose your preferred programming language',
      code: 'pip install microsandbox  # Python\nnpm install microsandbox  # JavaScript\ncargo add microsandbox    # Rust',
      details: 'SDKs are available for 20+ programming languages.'
    },
    {
      step: 4,
      title: 'Write Your First Code',
      description: 'Execute code securely in just a few lines',
      code: `import asyncio
from microsandbox import PythonSandbox

async def main():
    async with PythonSandbox.create(name="hello") as sb:
        exec = await sb.run("print('Hello, Microsandbox!')")
        print(await exec.output())

asyncio.run(main())`,
      details: 'This example creates a secure Python sandbox and executes a simple print statement.'
    }
  ];

  const quickLinks = [
    {
      icon: BookOpenIcon,
      title: 'Documentation',
      description: 'Complete guides and API reference',
      url: 'https://docs.microsandbox.dev',
      external: true
    },
    {
      icon: CodeBracketIcon,
      title: 'Examples',
      description: 'Sample code and use cases',
      url: 'https://github.com/microsandbox/examples',
      external: true
    },
    {
      icon: CommandLineIcon,
      title: 'CLI Reference',
      description: 'Command-line interface guide',
      url: 'https://docs.microsandbox.dev/cli',
      external: true
    }
  ];

  return (
    <>
      <Head>
        <title>Get Started - Microsandbox | Quick Setup Guide</title>
        <meta name="description" content="Get started with Microsandbox in minutes. Install the server, choose your SDK, and start executing code securely. Complete setup guide and examples included." />
        <meta name="keywords" content="microsandbox setup, installation guide, getting started, sdk installation, quick start" />
        <meta property="og:title" content="Get Started with Microsandbox" />
        <meta property="og:description" content="Complete setup guide to get Microsandbox running on your system in minutes." />
        <link rel="canonical" href="https://microsandbox.dev/get-started" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16 sm:py-24">
          <div className="section-container">
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Get Started with
                <br />
                <span className="gradient-text">Microsandbox</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Start executing code securely in minutes. Follow our simple setup process and you'll be running untrusted code safely in no time.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">&lt;5min</div>
                <div className="text-sm text-gray-600">Setup Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">20+</div>
                <div className="text-sm text-gray-600">Language SDKs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">Free</div>
                <div className="text-sm text-gray-600">Developer Tier</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">0</div>
                <div className="text-sm text-gray-600">Credit Card Required</div>
              </div>
            </div>
          </div>
        </section>

        {/* Installation Steps */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="section-container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  4 Simple Steps
                </h2>
                <p className="text-xl text-gray-600">
                  From zero to secure code execution in less than 5 minutes
                </p>
              </div>

              <div className="space-y-12">
                {steps.map((step, index) => (
                  <div
                    key={step.step}
                    className="relative animate-slide-up"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    {/* Connection Line */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-16 bg-gray-200 hidden sm:block"></div>
                    )}

                    <div className="flex items-start space-x-6">
                      {/* Step Number */}
                      <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {step.step}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600 mb-4">{step.description}</p>

                        {/* Code Block */}
                        <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
                          <pre className="text-sm text-gray-100 whitespace-pre-wrap">
                            <code>{step.code}</code>
                          </pre>
                        </div>

                        <p className="text-sm text-gray-500">{step.details}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* System Requirements */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="section-container">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  System Requirements
                </h2>
                <p className="text-xl text-gray-600">
                  Microsandbox works on most modern systems with minimal requirements
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                    Supported Operating Systems
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Linux (Ubuntu 20.04+, CentOS 8+, Debian 11+)</li>
                    <li>• macOS (10.15+)</li>
                    <li>• Windows (via WSL2) - Coming Soon</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                    Hardware Requirements
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• 2 CPU cores (4+ recommended)</li>
                    <li>• 4GB RAM (8GB+ recommended)</li>
                    <li>• 10GB disk space</li>
                    <li>• Virtualization support (KVM/Hypervisor)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="section-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What's Next?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Explore our resources to get the most out of Microsandbox
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {quickLinks.map((link, index) => (
                <a
                  key={link.title}
                  href={link.url}
                  target={link.external ? '_blank' : '_self'}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg hover:border-primary-200 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                    <link.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{link.title}</h3>
                  <p className="text-gray-600">{link.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-r from-primary-600 to-secondary-600">
          <div className="section-container">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Need Help Getting Started?
              </h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Our community and support team are here to help you succeed with Microsandbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://discord.gg/T95Y3XnEAK"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  Join Discord Community
                </a>
                <a
                  href="https://github.com/microsandbox/microsandbox/issues"
                  className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-200"
                >
                  Report Issues
                </a>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default GetStartedPage;