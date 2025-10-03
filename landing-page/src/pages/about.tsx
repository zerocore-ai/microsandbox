import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import {
  ShieldCheckIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  HeartIcon,
  UsersIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

const AboutPage: React.FC = () => {
  const milestones = [
    {
      year: '2024',
      title: 'Beta Launch',
      description: 'Public beta release with multi-language SDK support and MCP integration.'
    },
    {
      year: '2023',
      title: 'Foundation',
      description: 'Started development with focus on combining VM-level security with container-like performance.'
    },
    {
      year: '2023',
      title: 'First Prototype',
      description: 'Achieved sub-200ms startup times using libkrun and optimized microVM architecture.'
    }
  ];

  const values = [
    {
      icon: ShieldCheckIcon,
      title: 'Security First',
      description: 'We believe security should never be an afterthought. Every decision is made with security implications in mind.'
    },
    {
      icon: LightBulbIcon,
      title: 'Innovation',
      description: 'Pushing the boundaries of what\'s possible in secure computing while maintaining simplicity.'
    },
    {
      icon: RocketLaunchIcon,
      title: 'Performance',
      description: 'Speed and efficiency matter. We optimize for both developer experience and runtime performance.'
    },
    {
      icon: HeartIcon,
      title: 'Open Source',
      description: 'Building in the open with community input, transparency, and collaborative development.'
    }
  ];

  const team = [
    {
      name: 'Core Development Team',
      role: 'Building the future of secure code execution',
      description: 'A passionate team of security researchers, systems engineers, and developer experience experts.',
      avatar: '👥'
    }
  ];

  const stats = [
    { number: '200ms', label: 'Average Startup Time' },
    { number: '20+', label: 'Supported Languages' },
    { number: '99.9%', label: 'Isolation Success Rate' },
    { number: '100%', label: 'Open Source' }
  ];

  return (
    <>
      <Head>
        <title>About Us - Microsandbox | Our Mission & Story</title>
        <meta name="description" content="Learn about Microsandbox's mission to revolutionize secure code execution. Our story, values, and the team behind the fastest, most secure sandbox platform." />
        <meta name="keywords" content="microsandbox about, company story, secure computing, team, mission, values" />
        <meta property="og:title" content="About Us - Microsandbox" />
        <meta property="og:description" content="Discover the story behind Microsandbox and our mission to make secure code execution accessible to everyone." />
        <link rel="canonical" href="https://microsandbox.dev/about" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16 sm:py-24">
          <div className="section-container">
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Revolutionizing
                <br />
                <span className="gradient-text">Secure Computing</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're on a mission to make secure code execution fast, simple, and accessible to everyone—from individual developers to enterprise teams.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-3xl sm:text-4xl font-bold text-primary-600">{stat.number}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="section-container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-xl text-gray-600">
                  To eliminate the trade-offs between security, performance, and developer experience in code execution.
                </p>
              </div>

              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 sm:p-12">
                <blockquote className="text-lg sm:text-xl text-gray-700 italic leading-relaxed">
                  "Every developer should be able to run untrusted code without fear, without compromise, and without waiting. Security shouldn't slow you down, and speed shouldn't compromise safety."
                </blockquote>
                <cite className="block text-primary-600 font-semibold mt-6">— The Microsandbox Team</cite>
              </div>
            </div>
          </div>
        </section>

        {/* Problem & Solution */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">The Problem We Solve</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">The Security Dilemma</h3>
                    <p className="text-gray-600">
                      Running untrusted code locally puts your entire system at risk. One malicious script could compromise everything from personal data to business secrets.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">The Performance Problem</h3>
                    <p className="text-gray-600">
                      Traditional VMs are secure but painfully slow to start. Waiting 10+ seconds for a sandbox to boot kills productivity and makes real-time use cases impossible.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">The Control Challenge</h3>
                    <p className="text-gray-600">
                      Cloud solutions lack flexibility and put you at the mercy of external providers. You need full control over your security policies and infrastructure.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Solution</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <ShieldCheckIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">True Isolation</h3>
                      <p className="text-gray-600">Hardware-level VM isolation ensures complete security without shared kernel vulnerabilities.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <RocketLaunchIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Instant Performance</h3>
                      <p className="text-gray-600">Revolutionary microVM technology achieves startup times under 200ms—nearly instant execution.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <GlobeAltIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Complete Control</h3>
                      <p className="text-gray-600">Self-hosted solution gives you full control over security policies, compliance, and infrastructure.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="section-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These principles guide every decision we make and every line of code we write.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                    <value.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="section-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From concept to reality—building the future of secure code execution.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200"></div>

                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.year}
                    className="relative flex items-start space-x-8 pb-12 last:pb-0 animate-slide-up"
                    style={{ animationDelay: `${index * 300}ms` }}
                  >
                    <div className="relative z-10 w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-sm">{milestone.year}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="section-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Meet the Team</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Passionate engineers, researchers, and builders working to make secure computing accessible to everyone.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              {team.map((member, index) => (
                <div
                  key={member.name}
                  className="text-center p-8 bg-gray-50 rounded-2xl animate-slide-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="text-6xl mb-6">{member.avatar}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              ))}
            </div>

            {/* Community */}
            <div className="text-center mt-16">
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8">
                <UsersIcon className="w-16 h-16 text-primary-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Community</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  We're building Microsandbox in the open. Join our growing community of developers, security researchers, and enthusiasts.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="https://github.com/microsandbox/microsandbox" className="btn-primary">
                    Star us on GitHub
                  </a>
                  <a href="https://discord.gg/T95Y3XnEAK" className="btn-secondary">
                    Join Discord
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default AboutPage;