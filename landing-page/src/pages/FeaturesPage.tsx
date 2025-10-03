import React from 'react';
import { 
  ShieldCheckIcon, 
  BoltIcon, 
  HomeIcon, 
  CubeIcon,
  RocketLaunchIcon,
  CodeBracketIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ServerIcon,
  CpuChipIcon,
  CloudIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CommandLineIcon,
  DocumentTextIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline';

const FeaturesPage: React.FC = () => {
  const mainFeatures = [
    {
      icon: ShieldCheckIcon,
      title: 'Hardware-Level Isolation',
      description: 'True security with microVM technology that provides complete isolation from the host system.',
      details: [
        'libkrun-powered microVMs for ultimate security',
        'No shared kernel vulnerabilities',
        'Complete process and memory isolation',
        'Network isolation with controlled access'
      ]
    },
    {
      icon: BoltIcon,
      title: 'Lightning Fast Startup',
      description: 'Boot times under 200ms that make microsandbox feel instant compared to traditional VMs.',
      details: [
        'Sub-200ms boot times vs 10+ seconds for VMs',
        'Optimized microVM architecture',
        'Pre-warmed environments for even faster starts',
        'No cold start penalties'
      ]
    },
    {
      icon: HomeIcon,
      title: 'Self-Hosted Control',
      description: 'Keep your data and execution environments under your complete control.',
      details: [
        'Deploy on your own infrastructure',
        'No vendor lock-in or dependency',
        'Complete data privacy and compliance',
        'Custom security policies and configurations'
      ]
    },
    {
      icon: CubeIcon,
      title: 'OCI Container Compatibility',
      description: 'Use any OCI-compatible container images with your existing Docker workflows.',
      details: [
        'Standard Docker/Podman image support',
        'Leverage existing container ecosystems',
        'Easy migration from container workflows',
        'Support for multi-stage builds and layers'
      ]
    }
  ];

  const advancedFeatures = [
    {
      icon: RocketLaunchIcon,
      title: 'AI & MCP Integration',
      description: 'Built-in Model Context Protocol support for seamless AI agent integration.',
      benefits: ['Direct Claude integration', 'Agent-friendly APIs', 'Structured code execution']
    },
    {
      icon: CodeBracketIcon,
      title: 'Multi-Language Support',
      description: 'Support for 20+ programming languages with dedicated environments.',
      benefits: ['Python, JavaScript, Rust, Go, Java', 'Language-specific optimizations', 'Custom runtime configurations']
    },
    {
      icon: CommandLineIcon,
      title: 'CLI & Project Management',
      description: 'Powerful command-line tools for managing sandbox environments and projects.',
      benefits: ['Package-manager-like workflow', 'Environment persistence', 'One-command deployments']
    },
    {
      icon: CloudIcon,
      title: 'Scalable Architecture',
      description: 'Built to scale from single executions to enterprise workloads.',
      benefits: ['Horizontal scaling support', 'Resource management', 'Multi-tenant capabilities']
    }
  ];

  const useCaseFeatures = [
    {
      icon: AcademicCapIcon,
      category: 'Education',
      title: 'Safe Learning Environments',
      description: 'Students can experiment with code without risking system damage.',
      features: ['Isolated student environments', 'Assignment submission sandboxes', 'Automated grading support']
    },
    {
      icon: BuildingOfficeIcon,
      category: 'Enterprise',
      title: 'Secure Code Review',
      description: 'Test and analyze untrusted code submissions safely.',
      features: ['Malware analysis sandboxes', 'Code submission validation', 'Security audit environments']
    },
    {
      icon: UserGroupIcon,
      category: 'Development',
      title: 'Team Collaboration',
      description: 'Share development environments instantly across teams.',
      features: ['Consistent dev environments', 'Easy environment sharing', 'Reproducible builds']
    },
    {
      icon: ChartBarIcon,
      category: 'Data Science',
      title: 'Secure Data Processing',
      description: 'Process sensitive data with complete isolation and privacy.',
      features: ['Isolated data analysis', 'Secure model training', 'Privacy-preserving workflows']
    }
  ];

  const technicalSpecs = [
    { label: 'Boot Time', value: '< 200ms', description: 'Instant startup for productivity' },
    { label: 'Memory Overhead', value: '< 50MB', description: 'Minimal resource footprint' },
    { label: 'Languages Supported', value: '20+', description: 'Growing ecosystem' },
    { label: 'Container Compatibility', value: 'Full OCI', description: 'Standard Docker images' },
    { label: 'Isolation Level', value: 'Hardware VM', description: 'Maximum security' },
    { label: 'Scaling', value: 'Horizontal', description: 'Enterprise ready' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Enterprise-grade features for{' '}
              <span className="gradient-text">secure code execution</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Discover why thousands of developers choose microsandbox for running untrusted code safely and efficiently.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Technical Specifications</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {technicalSpecs.map((spec) => (
              <div key={spec.label} className="bg-white p-6 rounded-lg text-center shadow-sm">
                <div className="text-2xl font-bold text-primary-600">{spec.value}</div>
                <div className="mt-1 font-semibold text-gray-900 text-sm">{spec.label}</div>
                <div className="mt-1 text-xs text-gray-600">{spec.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Core Features</h2>
            <p className="mt-4 text-lg text-gray-600">
              The foundation of secure, fast, and reliable code execution
            </p>
          </div>

          <div className="space-y-20">
            {mainFeatures.map((feature, index) => (
              <div key={feature.title} className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-lg text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 bg-gradient-to-br from-primary-50 to-secondary-50 p-8 rounded-2xl">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <pre className="text-green-400 text-sm">
                      <code>{`$ msb exe --image python
Starting microsandbox...
✓ VM ready in 187ms
✓ Environment loaded
$ python
>>> print("Secure execution!")
Secure execution!`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Advanced Capabilities</h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful features that set microsandbox apart
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {advancedFeatures.map((feature) => (
              <div key={feature.title} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="space-y-2">
                  {feature.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Case Features */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Features by Use Case</h2>
            <p className="mt-4 text-lg text-gray-600">
              Specialized capabilities for different industries and scenarios
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {useCaseFeatures.map((useCase) => (
              <div key={useCase.title} className="bg-gray-50 p-6 rounded-xl">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <useCase.icon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-2">
                  {useCase.category}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{useCase.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{useCase.description}</p>
                <ul className="space-y-1">
                  {useCase.features.map((feature) => (
                    <li key={feature} className="text-xs text-gray-600 flex items-start gap-1">
                      <span className="text-primary-600 mt-1">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDK Support */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl">Multi-Language SDK Support</h2>
            <p className="mt-4 text-lg text-gray-300">
              Work with microsandbox in your preferred programming language
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4 text-blue-400">Python</h3>
              <pre className="bg-gray-900 p-4 rounded text-green-400 text-sm overflow-x-auto">
                <code>{`import asyncio
from microsandbox import PythonSandbox

async def main():
    async with PythonSandbox.create() as sb:
        exec = await sb.run("print('Hello!')")
        print(await exec.output())

asyncio.run(main())`}</code>
              </pre>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4 text-yellow-400">JavaScript</h3>
              <pre className="bg-gray-900 p-4 rounded text-green-400 text-sm overflow-x-auto">
                <code>{`import { NodeSandbox } from "microsandbox";

async function main() {
  const sb = await NodeSandbox.create();
  try {
    const exec = await sb.run("console.log('Hello!')");
    console.log(await exec.output());
  } finally {
    await sb.stop();
  }
}`}</code>
              </pre>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4 text-orange-400">Rust</h3>
              <pre className="bg-gray-900 p-4 rounded text-green-400 text-sm overflow-x-auto">
                <code>{`use microsandbox::PythonSandbox;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut sb = PythonSandbox::create(Default::default()).await?;
    let exec = sb.run("print('Hello!')").await?;
    println!("{}", exec.output().await?);
    sb.stop().await?;
    Ok(())
}`}</code>
              </pre>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-300">
              And 17+ more languages including Go, Java, C++, Ruby, PHP, and more!
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to experience secure code execution?
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              Get started with microsandbox today and see the difference
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/microsandbox/microsandbox"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Get Started Free
              </a>
              <a
                href="https://docs.microsandbox.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Read Documentation
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
