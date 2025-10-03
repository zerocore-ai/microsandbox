import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const team = [
    {
      role: "Core Team",
      members: "Open Source Contributors",
      description: "Built by developers, for developers, with contributions from the global open source community."
    }
  ];

  const values = [
    {
      icon: "🔐",
      title: "Security First",
      description: "We believe security should never be an afterthought. Every design decision prioritizes the safety and isolation of code execution."
    },
    {
      icon: "⚡",
      title: "Performance Matters",
      description: "Fast iteration cycles drive innovation. We're committed to providing near-instant startup times without compromising on security."
    },
    {
      icon: "🌍",
      title: "Open & Transparent",
      description: "Open source is in our DNA. We build in public, welcome contributions, and believe in the power of community-driven development."
    },
    {
      icon: "🎯",
      title: "Developer Experience",
      description: "Great tools should be a joy to use. We focus on intuitive APIs, comprehensive documentation, and seamless integration."
    },
    {
      icon: "🚀",
      title: "Innovation Driven",
      description: "We push boundaries to solve hard problems. From AI-native features to cutting-edge virtualization, we're always moving forward."
    },
    {
      icon: "🤝",
      title: "Community Focused",
      description: "Our users are our partners. We listen, learn, and build features that solve real-world problems for real developers."
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "Project Launch",
      description: "microsandbox was born from the need for a better way to execute untrusted code safely and quickly."
    },
    {
      year: "2024",
      title: "MCP Integration",
      description: "Added Model Context Protocol support, enabling seamless AI integration with Claude and other AI tools."
    },
    {
      year: "2024",
      title: "Multi-Language SDKs",
      description: "Expanded to support 30+ programming languages, making microsandbox accessible to developers everywhere."
    },
    {
      year: "2025",
      title: "Growing Community",
      description: "Thousands of developers now use microsandbox for AI coding assistants, education, and production workloads."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-6">
              About
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                microsandbox
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              We're building the future of secure code execution - where safety meets speed,
              and developers get the tools they deserve.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <div className="space-y-4 text-gray-300 text-lg">
                <p>
                  In a world where AI generates code, students learn to program, and developers need
                  to run untrusted scripts, the traditional approaches to code execution simply don't cut it.
                </p>
                <p>
                  Running code locally is dangerous. Containers share kernels and can be exploited.
                  Traditional VMs are too slow for modern workflows. Cloud solutions take away your control.
                </p>
                <p>
                  <strong className="text-white">microsandbox changes the game.</strong> We combine hardware-level
                  VM isolation with sub-200ms startup times, giving you both security and speed on your own infrastructure.
                </p>
                <p>
                  Our mission is to make secure code execution accessible to everyone - from individual developers
                  to enterprises, from AI tools to educational platforms. We believe you shouldn't have to choose
                  between safety, speed, and control.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30"></div>
              <div className="relative bg-gray-800 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">The Problem We Solve</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mr-4 mt-1">
                      <span className="text-red-400">❌</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Local Execution</p>
                      <p className="text-gray-400 text-sm">System compromise risk</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-4 mt-1">
                      <span className="text-yellow-400">⚠️</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Containers</p>
                      <p className="text-gray-400 text-sm">Shared kernel vulnerabilities</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mr-4 mt-1">
                      <span className="text-red-400">🐌</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Traditional VMs</p>
                      <p className="text-gray-400 text-sm">10+ second startup kills productivity</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-4 mt-1">
                      <span className="text-yellow-400">☁️</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Cloud Solutions</p>
                      <p className="text-gray-400 text-sm">Limited control and flexibility</p>
                    </div>
                  </div>
                  <div className="h-px bg-gradient-to-r from-purple-600 to-pink-600 my-4"></div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-4 mt-1">
                      <span className="text-green-400">✨</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">microsandbox</p>
                      <p className="text-gray-400 text-sm">Security + Speed + Control = Perfect</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 lg:px-8 bg-gray-900/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-400">
              The principles that guide everything we build
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 hover:border-purple-600 transition-colors">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-400">
              Key milestones in the microsandbox story
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>

            {/* Timeline items */}
            <div className="space-y-12">
              {milestones.map((milestone, idx) => (
                <div key={idx} className={`relative flex items-center ${idx % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-5/12 ${idx % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
                      <div className="text-purple-400 font-bold text-lg mb-2">{milestone.year}</div>
                      <h3 className="text-white font-semibold text-xl mb-2">{milestone.title}</h3>
                      <p className="text-gray-400">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 border-4 border-gray-900 z-10"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-6 lg:px-8 bg-gray-900/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              Built on Solid Technology
            </h2>
            <p className="text-lg text-gray-400">
              Leveraging the best open source technologies
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Powered by libkrun</h3>
              <p className="text-gray-400 mb-4">
                microsandbox is built on <strong className="text-white">libkrun</strong>, a lightweight
                virtualization library that enables us to provide hardware-level isolation with minimal overhead.
              </p>
              <p className="text-gray-400">
                This technology allows us to achieve the impossible: true VM-level security with
                near-container-like performance and startup times.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">Open Source at Heart</h3>
              <p className="text-gray-400 mb-4">
                microsandbox is fully open source under the Apache 2.0 license. We believe in transparent
                development and welcome contributions from the community.
              </p>
              <p className="text-gray-400">
                Check out our code, report issues, or contribute features on GitHub. Together,
                we're building the future of secure code execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Join Our Community
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Be part of the microsandbox community. Get help, share ideas, and contribute to the project.
          </p>
          <div className="flex items-center justify-center gap-x-6">
            <a
              href="https://github.com/microsandbox/microsandbox"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-gray-800 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 transition-all border border-gray-700"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
            <a
              href="https://discord.gg/T95Y3XnEAK"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Discord
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-r from-purple-900 to-pink-900">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-200 mb-8">
            Join thousands of developers using microsandbox for secure code execution
          </p>
          <div className="flex items-center justify-center gap-x-6">
            <Link
              to="/"
              className="rounded-md bg-white px-8 py-3 text-sm font-semibold text-purple-900 shadow-sm hover:bg-gray-100 transition-all"
            >
              Get Started
            </Link>
            <Link
              to="/features"
              className="text-sm font-semibold leading-6 text-white hover:text-gray-200 transition-colors"
            >
              Explore Features <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
