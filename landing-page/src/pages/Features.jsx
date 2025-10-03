import React from 'react';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      category: "Security & Isolation",
      items: [
        {
          icon: "🛡️",
          title: "Hardware-Level Isolation",
          description: "True VM isolation using microVMs powered by libkrun. No shared kernels, no container breakouts.",
          benefits: ["Complete process isolation", "Memory protection", "Network isolation", "Filesystem isolation"]
        },
        {
          icon: "🔒",
          title: "Secure by Default",
          description: "Every sandbox runs in its own isolated microVM with configurable resource limits and security policies.",
          benefits: ["No privilege escalation", "Limited system access", "Controlled network access", "Resource quotas"]
        },
        {
          icon: "🎯",
          title: "Attack Surface Minimization",
          description: "Minimal attack surface with only essential components running inside each microVM.",
          benefits: ["No unnecessary services", "Minimal dependencies", "Hardened configurations", "Regular security updates"]
        }
      ]
    },
    {
      category: "Performance",
      items: [
        {
          icon: "⚡",
          title: "Lightning-Fast Startup",
          description: "Boot times under 200ms - dramatically faster than traditional VMs that take 10+ seconds.",
          benefits: ["Near-instant feedback", "High throughput", "Rapid iteration", "Better user experience"]
        },
        {
          icon: "📊",
          title: "Resource Efficiency",
          description: "Low memory overhead and efficient CPU usage. Run hundreds of sandboxes on a single machine.",
          benefits: ["Minimal memory footprint", "Efficient CPU utilization", "High density", "Cost-effective scaling"]
        },
        {
          icon: "🔄",
          title: "Persistent State",
          description: "Optional state persistence between sandbox sessions. Resume exactly where you left off.",
          benefits: ["Development continuity", "Faster restarts", "Preserved installations", "Cached dependencies"]
        }
      ]
    },
    {
      category: "Developer Experience",
      items: [
        {
          icon: "🌐",
          title: "Multi-Language Support",
          description: "Native SDKs for 30+ programming languages including Python, JavaScript, Rust, Go, Java, and more.",
          benefits: ["Use your favorite language", "Idiomatic APIs", "Type safety", "Excellent documentation"]
        },
        {
          icon: "📦",
          title: "OCI Image Compatibility",
          description: "Works with standard Docker/OCI container images. Use existing images or create custom ones.",
          benefits: ["Leverage existing images", "Standard tooling", "Easy customization", "Wide ecosystem"]
        },
        {
          icon: "🤖",
          title: "AI-Native Integration",
          description: "Built-in Model Context Protocol (MCP) support. Works directly with Claude, Agno, and other AI tools.",
          benefits: ["Seamless AI integration", "Direct AI tool support", "No additional setup", "AI agent ready"]
        },
        {
          icon: "🛠️",
          title: "Powerful CLI & SDK",
          description: "Intuitive command-line tools and programmatic APIs for maximum flexibility.",
          benefits: ["Simple commands", "Rich SDK features", "Scriptable automation", "IDE integration ready"]
        }
      ]
    },
    {
      category: "Infrastructure",
      items: [
        {
          icon: "🏠",
          title: "Self-Hosted",
          description: "Run on your own infrastructure with complete control. No cloud provider dependencies or lock-in.",
          benefits: ["Full data control", "No vendor lock-in", "Custom configurations", "On-premise deployment"]
        },
        {
          icon: "☁️",
          title: "Cloud-Ready",
          description: "Deploy on AWS, GCP, Azure, or any cloud provider. Optimized for both bare metal and virtualized hosts.",
          benefits: ["Multi-cloud support", "Easy deployment", "Auto-scaling ready", "Cloud-native design"]
        },
        {
          icon: "📈",
          title: "Scalable Architecture",
          description: "Scale from single-machine development to multi-node production clusters seamlessly.",
          benefits: ["Horizontal scaling", "Load balancing", "High availability", "Production-grade reliability"]
        }
      ]
    },
    {
      category: "Flexibility",
      items: [
        {
          icon: "🔌",
          title: "Network Capabilities",
          description: "Configurable network access. Enable internet access or keep sandboxes fully isolated.",
          benefits: ["Controlled internet access", "Custom DNS", "Port forwarding", "Network policies"]
        },
        {
          icon: "💾",
          title: "Filesystem Management",
          description: "Mount directories, upload files, and manage sandbox filesystems with ease.",
          benefits: ["File uploads/downloads", "Directory mounting", "Volume management", "Snapshot support"]
        },
        {
          icon: "⚙️",
          title: "Resource Control",
          description: "Fine-grained control over CPU, memory, disk, and network resources per sandbox.",
          benefits: ["CPU limits", "Memory limits", "Disk quotas", "Network bandwidth control"]
        },
        {
          icon: "🔍",
          title: "Monitoring & Logging",
          description: "Built-in monitoring and logging capabilities. Track resource usage and capture all output.",
          benefits: ["Real-time metrics", "Log streaming", "Resource monitoring", "Debugging tools"]
        }
      ]
    },
    {
      category: "Workflow Integration",
      items: [
        {
          icon: "🎭",
          title: "Project-Based Workflow",
          description: "Sandboxfile configuration for managing multiple sandbox environments like npm or cargo.",
          benefits: ["Configuration as code", "Reproducible environments", "Team sharing", "Version control friendly"]
        },
        {
          icon: "🚀",
          title: "Quick Execution Modes",
          description: "Run permanent project sandboxes or temporary disposable sandboxes based on your needs.",
          benefits: ["Persistent development", "One-off experiments", "Testing isolation", "Clean environments"]
        },
        {
          icon: "📝",
          title: "Script Management",
          description: "Define and run custom scripts within your sandboxes. Perfect for build, test, and deployment tasks.",
          benefits: ["Custom workflows", "Reusable scripts", "CI/CD integration", "Automation friendly"]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-6">
              Powerful Features for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Secure Code Execution
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              Everything you need to run untrusted code safely, from hardware-level isolation
              to lightning-fast performance and developer-friendly tools.
            </p>
          </div>
        </div>
      </section>

      {/* Features Sections */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {features.map((category, idx) => (
            <div key={idx} className="mb-20">
              {/* Category Header */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-3 flex items-center">
                  <span className="inline-block w-2 h-8 bg-gradient-to-b from-purple-400 to-pink-400 mr-4 rounded"></span>
                  {category.category}
                </h2>
                <div className="h-px bg-gradient-to-r from-purple-600 via-pink-600 to-transparent"></div>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {category.items.map((feature, featureIdx) => (
                  <div key={featureIdx} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
                    <div className="relative bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                      <p className="text-gray-400 mb-6">{feature.description}</p>
                      <div className="space-y-2">
                        {feature.benefits.map((benefit, benefitIdx) => (
                          <div key={benefitIdx} className="flex items-start">
                            <svg className="w-5 h-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-300">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-6 lg:px-8 bg-gray-900/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              Why microsandbox?
            </h2>
            <p className="text-lg text-gray-400">
              See how we compare to traditional approaches
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-4 px-6 text-white font-semibold">Approach</th>
                  <th className="py-4 px-6 text-white font-semibold">Isolation</th>
                  <th className="py-4 px-6 text-white font-semibold">Startup Time</th>
                  <th className="py-4 px-6 text-white font-semibold">Control</th>
                  <th className="py-4 px-6 text-white font-semibold">Risk</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800 bg-gray-800/50">
                  <td className="py-4 px-6 text-white font-semibold">Running Locally</td>
                  <td className="py-4 px-6 text-red-400">❌ None</td>
                  <td className="py-4 px-6 text-green-400">✅ Instant</td>
                  <td className="py-4 px-6 text-green-400">✅ Full</td>
                  <td className="py-4 px-6 text-red-400">🔴 System compromise</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-6 text-white font-semibold">Containers (Docker)</td>
                  <td className="py-4 px-6 text-yellow-400">⚠️ Shared kernel</td>
                  <td className="py-4 px-6 text-green-400">✅ Fast</td>
                  <td className="py-4 px-6 text-green-400">✅ Good</td>
                  <td className="py-4 px-6 text-yellow-400">🟡 Kernel exploits</td>
                </tr>
                <tr className="border-b border-gray-800 bg-gray-800/50">
                  <td className="py-4 px-6 text-white font-semibold">Traditional VMs</td>
                  <td className="py-4 px-6 text-green-400">✅ Strong</td>
                  <td className="py-4 px-6 text-red-400">❌ 10+ seconds</td>
                  <td className="py-4 px-6 text-green-400">✅ Full</td>
                  <td className="py-4 px-6 text-green-400">🟢 Low</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-6 text-white font-semibold">Cloud Solutions</td>
                  <td className="py-4 px-6 text-green-400">✅ Good</td>
                  <td className="py-4 px-6 text-yellow-400">⚠️ Variable</td>
                  <td className="py-4 px-6 text-red-400">❌ Limited</td>
                  <td className="py-4 px-6 text-green-400">🟢 Low</td>
                </tr>
                <tr className="border-b-2 border-purple-600 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
                  <td className="py-4 px-6 text-white font-bold">microsandbox</td>
                  <td className="py-4 px-6 text-green-400 font-semibold">✅ Hardware-level</td>
                  <td className="py-4 px-6 text-green-400 font-semibold">✅ &lt;200ms</td>
                  <td className="py-4 px-6 text-green-400 font-semibold">✅ Complete</td>
                  <td className="py-4 px-6 text-green-400 font-semibold">🟢 Minimal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Experience the Power of microsandbox
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Get started today and see how easy secure code execution can be
          </p>
          <div className="flex items-center justify-center gap-x-6">
            <Link
              to="/"
              className="rounded-md bg-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-all"
            >
              Get Started
            </Link>
            <Link
              to="/pricing"
              className="text-sm font-semibold leading-6 text-white hover:text-purple-300 transition-colors"
            >
              View Pricing <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
