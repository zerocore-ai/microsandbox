import React from 'react';
import {
  ShieldCheckIcon,
  BoltIcon,
  ServerIcon,
  CubeIcon,
  RobotIcon,
  CodeBracketIcon,
  GlobeAltIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const Features: React.FC = () => {
  const mainFeatures = [
    {
      icon: ShieldCheckIcon,
      title: 'Hardware-Level Isolation',
      description: 'True security with microVM isolation. Each execution runs in its own virtual machine with complete kernel separation.',
      benefits: ['Zero shared kernel vulnerabilities', 'Complete process isolation', 'Memory protection']
    },
    {
      icon: BoltIcon,
      title: 'Lightning Fast Startup',
      description: 'Boot times under 200ms, not 10+ seconds like traditional VMs. Get instant feedback for rapid development.',
      benefits: ['Sub-200ms boot times', 'Instant code execution', 'Real-time development']
    },
    {
      icon: ServerIcon,
      title: 'Self-Hosted Control',
      description: 'Your infrastructure, your rules. No dependency on external cloud providers or their limitations.',
      benefits: ['Complete infrastructure control', 'No vendor lock-in', 'Custom security policies']
    },
  ];

  const additionalFeatures = [
    {
      icon: CubeIcon,
      title: 'OCI Compatible',
      description: 'Works seamlessly with standard container images and Docker registries.',
    },
    {
      icon: RobotIcon,
      title: 'AI Agent Ready',
      description: 'Built-in MCP support for seamless integration with Claude, Agno, and other AI tools.',
    },
    {
      icon: CodeBracketIcon,
      title: 'Multi-Language Support',
      description: 'SDKs available for Python, JavaScript, Rust, Go, and 15+ other languages.',
    },
    {
      icon: GlobeAltIcon,
      title: 'Web Browser Automation',
      description: 'Secure web scraping, form automation, and browser-based testing capabilities.',
    },
    {
      icon: ChartBarIcon,
      title: 'Resource Management',
      description: 'Fine-grained control over CPU, memory, and network resources for each sandbox.',
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 bg-white">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="gradient-text">Microsandbox</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The perfect balance of security, performance, and developer experience.
            Stop compromising between safety and productivity.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {mainFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="relative p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-600 mb-6">{feature.description}</p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3"></div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            How We Compare
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Solution</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Security</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Startup Time</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Control</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">AI Ready</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="bg-primary-50">
                  <td className="py-4 px-4 font-semibold text-primary-900">Microsandbox</td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      VM Isolation
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      &lt;200ms
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Full Control
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Built-in
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-900">Local Execution</td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      None
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Instant
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Full Control
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Manual
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-900">Docker Containers</td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Shared Kernel
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      ~2s
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Full Control
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Basic
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-900">Traditional VMs</td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      VM Isolation
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      10+ seconds
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Full Control
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Manual
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-900">Cloud Solutions</td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Variable
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Variable
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Limited
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Some
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {additionalFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="p-6 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;