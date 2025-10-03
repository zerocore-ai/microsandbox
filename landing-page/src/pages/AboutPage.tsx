import React from 'react';
import { 
  HeartIcon,
  CodeBracketIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const AboutPage: React.FC = () => {
  const team = [
    {
      name: 'Alex Chen',
      role: 'Founder & CEO',
      bio: 'Former security engineer at major cloud providers. Passionate about making secure code execution accessible to everyone.',
      avatar: 'AC'
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO',
      bio: 'Systems architecture expert with 15+ years in virtualization and containerization technologies.',
      avatar: 'SJ'
    },
    {
      name: 'Miguel Rodriguez',
      role: 'Lead Developer',
      bio: 'Open-source enthusiast and expert in Rust, Go, and distributed systems. Core contributor to libkrun.',
      avatar: 'MR'
    },
    {
      name: 'Dr. Priya Patel',
      role: 'Security Architect',
      bio: 'PhD in Computer Security. Former researcher at top universities, specializing in VM isolation and sandbox technologies.',
      avatar: 'PP'
    }
  ];

  const values = [
    {
      icon: ShieldCheckIcon,
      title: 'Security First',
      description: 'We believe security should never be an afterthought. Every design decision prioritizes the safety and isolation of code execution.',
    },
    {
      icon: RocketLaunchIcon,
      title: 'Performance Matters',
      description: 'Fast execution means better developer experience. We work tirelessly to minimize overhead and maximize performance.',
    },
    {
      icon: UserGroupIcon,
      title: 'Community Driven',
      description: 'Open source at our core. We build with the community, for the community, ensuring transparency and collaboration.',
    },
    {
      icon: GlobeAltIcon,
      title: 'Accessible to All',
      description: 'Secure code execution should be available to developers everywhere, regardless of their infrastructure or budget.',
    },
  ];

  const milestones = [
    {
      year: '2023',
      title: 'The Problem',
      description: 'Identified the gap between container security and VM performance for code execution.'
    },
    {
      year: 'Early 2024',
      title: 'First Prototype',
      description: 'Built initial prototype using libkrun for hardware-level isolation with fast startup.'
    },
    {
      year: 'Mid 2024',
      title: 'Multi-Language Support',
      description: 'Expanded to support Python, JavaScript, Rust, and 15+ other programming languages.'
    },
    {
      year: 'Late 2024',
      title: 'AI Integration',
      description: 'Added MCP support for seamless integration with AI agents like Claude.'
    },
    {
      year: '2025',
      title: 'Open Source Release',
      description: 'Released microsandbox as open source under Apache 2.0 license.'
    },
  ];

  const stats = [
    { label: 'GitHub Stars', value: '12,000+', description: 'And growing every day' },
    { label: 'Executions', value: '1M+', description: 'Code executions processed' },
    { label: 'Languages', value: '20+', description: 'Supported languages' },
    { label: 'Contributors', value: '150+', description: 'Open source contributors' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Building the future of{' '}
              <span className="gradient-text">secure code execution</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We're a team of security experts, systems engineers, and open-source enthusiasts 
              dedicated to making secure code execution fast, accessible, and reliable for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</div>
                <div className="mt-2 font-semibold text-primary-100">{stat.label}</div>
                <div className="text-sm text-primary-200">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe that running untrusted code safely shouldn't require choosing between security and performance. 
                Traditional solutions force developers to compromise on either isolation or speed, but we think you should have both.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our mission is to democratize secure code execution by providing enterprise-grade security with 
                lightning-fast performance, all while maintaining the simplicity developers need to stay productive.
              </p>
              <p className="text-lg text-gray-600">
                Whether you're building AI agents, educational platforms, or enterprise security tools, 
                microsandbox gives you the confidence to run any code safely.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-8 rounded-2xl">
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <HeartIcon className="h-5 w-5 text-red-400" />
                  <span className="text-white font-semibold">Built with passion</span>
                </div>
                <div className="space-y-3 text-green-400 text-sm">
                  <div>✓ Security without compromise</div>
                  <div>✓ Performance that matters</div>
                  <div>✓ Open source and transparent</div>
                  <div>✓ Community-driven development</div>
                  <div>✓ Accessible to all developers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Values</h2>
            <p className="mt-4 text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <value.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                </div>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Journey</h2>
            <p className="mt-4 text-lg text-gray-600">
              From concept to community-driven open source project
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 h-full bg-primary-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <div className="text-primary-600 font-bold text-lg">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 mt-2">{milestone.title}</h3>
                      <p className="text-gray-600 mt-2">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-600 rounded-full border-4 border-white"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Meet the Team</h2>
            <p className="mt-4 text-lg text-gray-600">
              The people behind microsandbox
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {member.avatar}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                <div className="text-primary-600 font-semibold text-sm mb-3">{member.role}</div>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Built on Proven Technology</h2>
            <p className="mt-4 text-lg text-gray-600">
              Standing on the shoulders of giants
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CodeBracketIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">libkrun</h3>
              <p className="text-gray-600">
                Built on the lightweight virtualization library that powers secure, fast microVMs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <RocketLaunchIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rust</h3>
              <p className="text-gray-600">
                Core components written in Rust for memory safety, performance, and reliability.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Linux KVM</h3>
              <p className="text-gray-600">
                Leveraging proven kernel-based virtualization for hardware-level isolation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Join us in building the future
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              We're always looking for talented people who share our vision
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/microsandbox/microsandbox/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Contribute to Open Source
              </a>
              <a
                href="https://discord.gg/T95Y3XnEAK"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Join Our Community
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
