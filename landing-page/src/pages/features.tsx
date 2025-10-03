import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Features from '../components/Features';
import UseCases from '../components/UseCases';
import {
  ShieldCheckIcon,
  BoltIcon,
  ServerIcon,
  CubeIcon,
  RobotIcon,
  CodeBracketIcon,
  CloudIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';

const FeaturesPage: React.FC = () => {
  const technicalFeatures = [
    {
      category: 'Security & Isolation',
      features: [
        {
          icon: ShieldCheckIcon,
          title: 'microVM Isolation',
          description: 'Each sandbox runs in its own lightweight virtual machine with complete kernel separation.',
          technical: 'Built on libkrun for hardware-level isolation without the overhead of traditional VMs.'
        },
        {
          icon: CpuChipIcon,
          title: 'Resource Control',
          description: 'Fine-grained CPU, memory, and network resource allocation and monitoring.',
          technical: 'Configurable limits with real-time usage monitoring and automatic cleanup.'
        }
      ]
    },
    {
      category: 'Performance & Speed',
      features: [
        {
          icon: BoltIcon,
          title: 'Ultra-Fast Boot',
          description: 'Revolutionary startup times under 200ms for immediate code execution.',
          technical: 'Pre-warmed environments with copy-on-write snapshots and optimized kernel loading.'
        },
        {
          icon: CloudIcon,
          title: 'Efficient Scaling',
          description: 'Automatic scaling and resource pooling for high-throughput workloads.',
          technical: 'Dynamic resource allocation with intelligent sandbox recycling and load balancing.'
        }
      ]
    },
    {
      category: 'Developer Experience',
      features: [
        {
          icon: CodeBracketIcon,
          title: 'Multi-Language SDKs',
          description: 'Native SDKs for Python, JavaScript, Rust, Go, and 15+ other languages.',
          technical: 'Consistent API design across all languages with async/await support and proper error handling.'
        },
        {
          icon: RobotIcon,
          title: 'AI Integration',
          description: 'Built-in MCP (Model Context Protocol) support for seamless AI tool integration.',
          technical: 'Direct integration with Claude, Agno, and other MCP-compatible AI systems.'
        }
      ]
    },
    {
      category: 'Infrastructure',
      features: [
        {
          icon: ServerIcon,
          title: 'Self-Hosted',
          description: 'Deploy on your own infrastructure with complete control over security and compliance.',
          technical: 'Docker-based deployment with Kubernetes support and comprehensive monitoring.'
        },
        {
          icon: CubeIcon,
          title: 'OCI Compatible',
          description: 'Works with standard container images from Docker Hub, GitHub Container Registry, and more.',
          technical: 'Full OCI specification compliance with support for multi-arch images and custom registries.'
        }
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Features - Microsandbox | Secure Code Execution Platform</title>
        <meta name="description" content="Explore Microsandbox's powerful features: hardware-level VM isolation, sub-200ms startup times, multi-language support, AI integration, and self-hosted infrastructure control." />
        <meta name="keywords" content="microsandbox features, vm isolation, fast startup, multi-language sdk, ai integration, secure code execution" />
        <meta property="og:title" content="Features - Microsandbox" />
        <meta property="og:description" content="Discover the powerful features that make Microsandbox the ultimate secure code execution platform." />
        <link rel="canonical" href="https://microsandbox.dev/features" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16 sm:py-24">
          <div className="section-container">
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Powerful Features for
                <br />
                <span className="gradient-text">Secure Code Execution</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to safely execute untrusted code with the performance and control you demand.
              </p>
            </div>
          </div>
        </section>

        {/* Main Features */}
        <Features />

        {/* Technical Deep Dive */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="section-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Technical Deep Dive
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding the technology that makes Microsandbox the most advanced secure code execution platform.
              </p>
            </div>

            <div className="space-y-16">
              {technicalFeatures.map((category, categoryIndex) => (
                <div key={category.category}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                    {category.category}
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {category.features.map((feature, index) => (
                      <div
                        key={feature.title}
                        className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 animate-slide-up"
                        style={{ animationDelay: `${(categoryIndex * 2 + index) * 200}ms` }}
                      >
                        <div className="flex items-start">
                          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-6 flex-shrink-0">
                            <feature.icon className="w-6 h-6 text-primary-600" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                            <p className="text-gray-600 mb-4">{feature.description}</p>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-700 font-medium">Technical Details:</p>
                              <p className="text-sm text-gray-600 mt-1">{feature.technical}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture Diagram */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="section-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                System Architecture
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how Microsandbox delivers security and performance through intelligent architecture design.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="max-w-4xl mx-auto">
                {/* Simplified architecture visualization */}
                <div className="space-y-8">
                  {/* Client Layer */}
                  <div className="text-center">
                    <div className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-800 rounded-lg font-semibold">
                      Your Application (Client)
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Python, JavaScript, Rust, Go, etc.</p>
                  </div>

                  {/* Arrow */}
                  <div className="text-center">
                    <div className="w-px h-8 bg-gray-300 mx-auto"></div>
                    <div className="text-gray-500 text-sm">SDK API Call</div>
                  </div>

                  {/* Server Layer */}
                  <div className="text-center">
                    <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-lg font-semibold">
                      Microsandbox Server
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Request routing, resource management, monitoring</p>
                  </div>

                  {/* Arrow */}
                  <div className="text-center">
                    <div className="w-px h-8 bg-gray-300 mx-auto"></div>
                    <div className="text-gray-500 text-sm">Creates & Manages</div>
                  </div>

                  {/* MicroVM Layer */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['Python Environment', 'Node Environment', 'Custom Environment'].map((env, index) => (
                      <div key={env} className="text-center">
                        <div className="bg-yellow-100 text-yellow-800 rounded-lg p-4">
                          <div className="font-semibold">microVM {index + 1}</div>
                          <div className="text-sm mt-1">{env}</div>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">Isolated execution</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Benefits */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                    <ShieldCheckIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900">Complete Isolation</h4>
                    <p className="text-sm text-gray-600">Each microVM has its own kernel</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                    <BoltIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900">Instant Ready</h4>
                    <p className="text-sm text-gray-600">Pre-warmed environments</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                    <ServerIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900">Scalable</h4>
                    <p className="text-sm text-gray-600">Dynamic resource allocation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <UseCases />
      </Layout>
    </>
  );
};

export default FeaturesPage;