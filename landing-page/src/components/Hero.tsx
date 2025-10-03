import React from 'react';
import Link from 'next/link';
import {
  ShieldCheckIcon,
  BoltIcon,
  ServerIcon,
  CubeIcon,
  RobotIcon
} from '@heroicons/react/24/outline';

const Hero: React.FC = () => {
  const features = [
    { icon: ShieldCheckIcon, text: 'Strong Isolation' },
    { icon: BoltIcon, text: 'Instant Startup' },
    { icon: ServerIcon, text: 'Your Infrastructure' },
    { icon: CubeIcon, text: 'OCI Compatible' },
    { icon: RobotIcon, text: 'AI-Ready' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative section-container py-16 sm:py-24 lg:py-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-8">
            <BoltIcon className="w-4 h-4 mr-2" />
            Now in Beta - Join the Revolution
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Easy <span className="gradient-text">Secure Execution</span>
            <br />
            of Untrusted Code
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up">
            Hardware-level VM isolation with startup times under <strong>200ms</strong>.
            Perfect for AI agents, code analysis, and secure development environments.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mb-12">
            {features.map((feature, index) => (
              <div
                key={feature.text}
                className="flex items-center space-x-2 text-gray-700 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <feature.icon className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/get-started" className="btn-primary text-lg px-8 py-4 animate-slide-up">
              Get Started Free
            </Link>
            <Link href="https://docs.microsandbox.dev" className="btn-secondary text-lg px-8 py-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              View Documentation
            </Link>
          </div>

          {/* Code example */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-xl shadow-2xl p-6 text-left overflow-hidden animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <span className="text-gray-400 text-sm">Python Example</span>
              </div>
              <div className="font-mono text-sm">
                <div className="text-gray-500"># Install microsandbox</div>
                <div className="text-green-400 mb-2">$ pip install microsandbox</div>

                <div className="text-gray-500"># Secure code execution in 3 lines</div>
                <div className="text-blue-400">import</div>
                <div className="text-white"> asyncio</div>
                <div className="text-blue-400">from</div>
                <div className="text-white"> microsandbox </div>
                <div className="text-blue-400">import</div>
                <div className="text-white"> PythonSandbox</div>
                <br />
                <div className="text-blue-400">async def</div>
                <div className="text-yellow-300"> main</div>
                <div className="text-white">():</div>
                <br />
                <div className="text-blue-400 ml-4">async with</div>
                <div className="text-white"> PythonSandbox.create(name=</div>
                <div className="text-green-300">&quot;secure&quot;</div>
                <div className="text-white">) </div>
                <div className="text-blue-400">as</div>
                <div className="text-white"> sb:</div>
                <br />
                <div className="text-white ml-8">exec = </div>
                <div className="text-blue-400">await</div>
                <div className="text-white"> sb.run(</div>
                <div className="text-green-300">&quot;print('Hello from secure sandbox!')&quot;</div>
                <div className="text-white">)</div>
                <br />
                <div className="text-white ml-8">print(</div>
                <div className="text-blue-400">await</div>
                <div className="text-white"> exec.output())</div>
                <br />
                <div className="text-green-400 mt-2"># Output: Hello from secure sandbox!</div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 animate-slide-up" style={{ animationDelay: '600ms' }}>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">&lt;200ms</div>
                <div className="text-sm text-gray-600">Startup Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">20+</div>
                <div className="text-sm text-gray-600">Language SDKs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">99.9%</div>
                <div className="text-sm text-gray-600">Isolation Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">0</div>
                <div className="text-sm text-gray-600">Setup Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;