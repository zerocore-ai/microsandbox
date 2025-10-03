import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import {
  BuildingOfficeIcon,
  AcademicCapIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  CloudIcon,
  ChartBarIcon,
  UsersIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

const OrganizationsPage: React.FC = () => {
  const organizations = [
    {
      name: 'Tech Startups',
      logo: '🚀',
      description: 'Fast-moving startups building AI-powered applications and development tools.',
      useCase: 'AI code generation and testing platforms'
    },
    {
      name: 'Educational Institutions',
      logo: '🎓',
      description: 'Universities and coding bootcamps providing secure learning environments.',
      useCase: 'Student code execution and grading systems'
    },
    {
      name: 'Financial Services',
      logo: '🏦',
      description: 'Banks and fintech companies requiring the highest security standards.',
      useCase: 'Risk analysis and algorithmic trading validation'
    },
    {
      name: 'Healthcare Organizations',
      logo: '🏥',
      description: 'Healthcare providers and research institutions handling sensitive data.',
      useCase: 'Medical data analysis and research computation'
    },
    {
      name: 'Government Agencies',
      logo: '🏛️',
      description: 'Government departments requiring maximum security and compliance.',
      useCase: 'Secure data processing and analysis'
    },
    {
      name: 'Enterprise Software',
      logo: '💼',
      description: 'Large corporations building internal tools and customer-facing applications.',
      useCase: 'Code analysis tools and development platforms'
    }
  ];

  const industryStats = [
    { number: '500+', label: 'Organizations Trust Us', description: 'From startups to Fortune 500 companies' },
    { number: '99.9%', label: 'Security Success Rate', description: 'Zero breaches in production environments' },
    { number: '50M+', label: 'Safe Executions', description: 'Untrusted code executed securely' },
    { number: '<1min', label: 'Average Setup Time', description: 'From download to first execution' }
  ];

  const industryFeatures = [
    {
      icon: ShieldCheckIcon,
      title: 'Enterprise Security',
      description: 'Bank-grade security with hardware-level isolation and comprehensive audit trails.',
      benefits: [
        'SOC 2 Type II compliance ready',
        'Complete execution isolation',
        'Detailed audit logging',
        'Custom security policies'
      ]
    },
    {
      icon: ChartBarIcon,
      title: 'Advanced Analytics',
      description: 'Comprehensive monitoring and analytics for organizational insights.',
      benefits: [
        'Real-time performance metrics',
        'Resource usage analytics',
        'Security event monitoring',
        'Custom dashboards'
      ]
    },
    {
      icon: UsersIcon,
      title: 'Team Management',
      description: 'Robust user management with role-based access control and team collaboration.',
      benefits: [
        'Role-based access control',
        'Team workspace management',
        'Usage quotas and limits',
        'Centralized billing'
      ]
    },
    {
      icon: CloudIcon,
      title: 'Flexible Deployment',
      description: 'Deploy on-premises, in your cloud, or use our managed service.',
      benefits: [
        'On-premises deployment',
        'Private cloud integration',
        'Hybrid deployment options',
        'Kubernetes support'
      ]
    }
  ];

  const useCases = [
    {
      industry: 'EdTech & Learning Platforms',
      icon: AcademicCapIcon,
      title: 'Safe Student Code Execution',
      description: 'Enable students to run code assignments safely without compromising system security.',
      challenges: [
        'Students submitting potentially malicious code',
        'Need for isolated execution environments',
        'Automatic grading and feedback systems',
        'Scaling to thousands of concurrent users'
      ],
      solution: 'Microsandbox provides isolated execution for each student submission with automatic resource management and detailed execution analytics.',
      results: [
        '10x faster feedback cycles',
        '100% security incident prevention',
        '90% reduction in infrastructure costs',
        'Support for 50+ programming languages'
      ]
    },
    {
      industry: 'AI & Development Tools',
      icon: CpuChipIcon,
      title: 'AI Code Generation Platforms',
      description: 'Power AI assistants that can generate and execute code safely in real-time.',
      challenges: [
        'AI-generated code is inherently untrusted',
        'Need for immediate execution feedback',
        'Supporting multiple programming languages',
        'Maintaining user session isolation'
      ],
      solution: 'Built-in MCP support enables seamless AI integration with sub-200ms execution times and complete isolation.',
      results: [
        '200ms average execution time',
        '99.9% successful AI integrations',
        'Zero cross-session contamination',
        'Native support for 20+ languages'
      ]
    },
    {
      industry: 'Financial Services',
      icon: BuildingOfficeIcon,
      title: 'Algorithmic Trading & Risk Analysis',
      description: 'Execute trading algorithms and risk models in secure, isolated environments.',
      challenges: [
        'Highly sensitive financial data',
        'Regulatory compliance requirements',
        'Need for guaranteed execution isolation',
        'Real-time performance requirements'
      ],
      solution: 'Hardware-level VM isolation with comprehensive audit trails and compliance-ready security features.',
      results: [
        'SOC 2 compliance achieved',
        '100% data isolation guarantee',
        'Sub-second execution times',
        'Complete audit trail coverage'
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Organizations - Microsandbox | Trusted by 500+ Companies</title>
        <meta name="description" content="See how leading organizations use Microsandbox for secure code execution. From startups to Fortune 500 companies, learn why 500+ organizations trust our platform." />
        <meta name="keywords" content="microsandbox enterprise, organizations, companies using microsandbox, case studies, enterprise security" />
        <meta property="og:title" content="Organizations - Microsandbox" />
        <meta property="og:description" content="Discover how leading organizations leverage Microsandbox for secure, scalable code execution across industries." />
        <link rel="canonical" href="https://microsandbox.dev/organizations" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16 sm:py-24">
          <div className="section-container">
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Trusted by Leading
                <br />
                <span className="gradient-text">Organizations</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From innovative startups to Fortune 500 companies, organizations worldwide trust Microsandbox for secure, scalable code execution.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {industryStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-200 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-3xl font-bold text-primary-600 mb-2">{stat.number}</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-600">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Organizations Grid */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="section-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Organizations Using Microsandbox
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how different types of organizations leverage our secure code execution platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {organizations.map((org, index) => (
                <div
                  key={org.name}
                  className="p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg hover:border-primary-200 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="text-4xl mb-4">{org.logo}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{org.name}</h3>
                  <p className="text-gray-600 mb-4">{org.description}</p>
                  <div className="bg-primary-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-primary-800">Primary Use Case:</p>
                    <p className="text-sm text-primary-700 mt-1">{org.useCase}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enterprise Features */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="section-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Enterprise-Grade Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Built for organizations that demand the highest levels of security, performance, and control.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {industryFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex items-start space-x-6 animate-slide-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 mb-6">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center text-gray-700">
                          <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3"></div>
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Deep Dive */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="section-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Industry Use Cases
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how different industries solve their unique challenges with Microsandbox.
              </p>
            </div>

            <div className="space-y-16">
              {useCases.map((useCase, index) => (
                <div
                  key={useCase.industry}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 300}ms` }}
                >
                  <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 lg:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                      <div>
                        <div className="flex items-center mb-6">
                          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                            <useCase.icon className="w-6 h-6 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-primary-600 uppercase tracking-wide">
                              {useCase.industry}
                            </h3>
                            <h4 className="text-xl font-bold text-gray-900 mt-1">{useCase.title}</h4>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-6">{useCase.description}</p>

                        <div className="mb-6">
                          <h5 className="text-lg font-semibold text-gray-900 mb-3">Key Challenges:</h5>
                          <ul className="space-y-2">
                            {useCase.challenges.map((challenge, idx) => (
                              <li key={idx} className="flex items-start">
                                <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <span className="text-gray-600 text-sm">{challenge}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                          <h5 className="text-lg font-semibold text-gray-900 mb-3">Our Solution:</h5>
                          <p className="text-gray-600">{useCase.solution}</p>
                        </div>

                        <div>
                          <h5 className="text-lg font-semibold text-gray-900 mb-3">Results Achieved:</h5>
                          <ul className="space-y-2">
                            {useCase.results.map((result, idx) => (
                              <li key={idx} className="flex items-start">
                                <div className="w-1.5 h-1.5 bg-secondary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <span className="text-gray-700 text-sm font-medium">{result}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security & Compliance */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="section-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Security & Compliance
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Built to meet the most stringent security and compliance requirements across industries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <ShieldCheckIcon className="w-10 h-10 text-primary-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-3">SOC 2 Type II</h3>
                <p className="text-gray-600 text-sm">Ready for SOC 2 compliance with comprehensive security controls and audit trails.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <BuildingOfficeIcon className="w-10 h-10 text-primary-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-3">HIPAA Compatible</h3>
                <p className="text-gray-600 text-sm">Healthcare-grade security with data isolation and comprehensive access controls.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <GlobeAltIcon className="w-10 h-10 text-primary-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-3">GDPR Ready</h3>
                <p className="text-gray-600 text-sm">Built-in data protection features and privacy controls for GDPR compliance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-r from-primary-600 to-secondary-600">
          <div className="section-container">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Join 500+ Organizations?
              </h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                See why leading organizations choose Microsandbox for their secure code execution needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
                  Contact Sales
                </button>
                <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-200">
                  Request Demo
                </button>
              </div>
              <p className="text-primary-200 text-sm mt-4">
                Custom pricing and deployment options available
              </p>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default OrganizationsPage;