import React from 'react';
import { Link } from 'react-router-dom';
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
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Strong Isolation',
      description: 'Hardware-level VM isolation with microVMs for ultimate security',
    },
    {
      icon: BoltIcon,
      title: 'Instant Startup',
      description: 'Boot times under 200ms, not 10+ seconds like traditional VMs',
    },
    {
      icon: HomeIcon,
      title: 'Your Infrastructure',
      description: 'Self-hosted with full control over your execution environment',
    },
    {
      icon: CubeIcon,
      title: 'OCI Compatible',
      description: 'Works with standard container images you already use',
    },
    {
      icon: RocketLaunchIcon,
      title: 'AI-Ready',
      description: 'Built-in MCP support for seamless AI integration',
    },
    {
      icon: CodeBracketIcon,
      title: 'Multi-Language',
      description: 'Support for Python, JavaScript, Rust, and 20+ languages',
    },
  ];

  const useCases = [
    {
      icon: CodeBracketIcon,
      title: 'Coding & Dev Environments',
      description: 'Let AI agents build real apps with professional dev tools in protected environments.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: ChartBarIcon,
      title: 'Data Analysis',
      description: 'Transform raw numbers into insights with AI that processes data safely and privately.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: GlobeAltIcon,
      title: 'Web Browsing Agent',
      description: 'Build AI assistants that can browse the web safely in contained environments.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: ServerIcon,
      title: 'Instant App Hosting',
      description: 'Share working apps and demos in seconds without deployment headaches.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const stats = [
    { label: 'Boot Time', value: '<200ms', description: 'Lightning fast startup' },
    { label: 'Security Level', value: 'Hardware', description: 'VM-level isolation' },
    { label: 'Languages', value: '20+', description: 'SDK support' },
    { label: 'Container', value: 'OCI', description: 'Standard compatibility' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Easy secure execution of{' '}
              <span className="gradient-text">untrusted code</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
              Run AI-generated code, user submissions, and experimental code safely with hardware-level VM isolation. 
              Boot times under 200ms, not 10+ seconds.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/microsandbox/microsandbox"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-lg px-8 py-4"
              >
                Get Started
                <ArrowRightIcon className="h-5 w-5" />
              </a>
              <a
                href="https://docs.microsandbox.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-lg px-8 py-4"
              >
                View Documentation
              </a>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-200 to-secondary-200 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary-600">{stat.value}</div>
                <div className="mt-2 font-semibold text-gray-900">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why microsandbox?
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              Ever needed to run code you don't fully trust? Traditional options all have serious drawbacks:
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-red-600 text-xl">💻</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Running locally</h3>
              <p className="text-gray-600 text-sm">One malicious script and your entire system is compromised</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-yellow-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-yellow-600 text-xl">🐳</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Using containers</h3>
              <p className="text-gray-600 text-sm">Shared kernels mean sophisticated attacks can still break out</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-orange-600 text-xl">🖥️</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Traditional VMs</h3>
              <p className="text-gray-600 text-sm">Waiting 10+ seconds for a VM to boot kills productivity</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 text-xl">☁️</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Cloud solutions</h3>
              <p className="text-gray-600 text-sm">Not as flexible, at the whim of the cloud provider</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              microsandbox combines the best of all worlds
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              Get enterprise-grade security with developer-friendly performance
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="bg-gray-50 p-6 rounded-xl">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/features" className="btn-primary">
              Explore All Features
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-20 bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-8">
              Get started in three easy steps
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Start the Server</h3>
              <div className="bg-gray-800 p-4 rounded-lg text-left">
                <pre className="text-green-400 text-sm">
                  <code>{`curl -sSL https://get.microsandbox.dev | sh
msb server start --dev`}</code>
                </pre>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Install the SDK</h3>
              <div className="bg-gray-800 p-4 rounded-lg text-left">
                <pre className="text-green-400 text-sm">
                  <code>{`pip install microsandbox
# or
npm install microsandbox
# or
cargo add microsandbox`}</code>
                </pre>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Execute Code</h3>
              <div className="bg-gray-800 p-4 rounded-lg text-left">
                <pre className="text-green-400 text-sm">
                  <code>{`async with PythonSandbox.create() as sb:
  exec = await sb.run("print('Hello!')")
  print(await exec.output())`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Perfect for any use case
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              From AI agents to data analysis, microsandbox handles it all
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            {useCases.map((useCase) => (
              <div key={useCase.title} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <div className={`w-12 h-12 ${useCase.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <useCase.icon className={`h-6 w-6 ${useCase.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to secure your code execution?
            </h2>
            <p className="mt-6 text-xl text-primary-100">
              Join thousands of developers who trust microsandbox for safe code execution
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/microsandbox/microsandbox"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 inline-flex items-center gap-2"
              >
                Start Building Today
                <ArrowRightIcon className="h-5 w-5" />
              </a>
              <Link
                to="/pricing"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 inline-flex items-center gap-2"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
