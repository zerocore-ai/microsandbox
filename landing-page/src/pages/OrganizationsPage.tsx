import React from 'react';

const OrganizationsPage: React.FC = () => {
  const organizations = [
    {
      name: 'EduTech Solutions',
      category: 'Education',
      logo: 'ET',
      description: 'Leading online coding education platform serving 50,000+ students',
      useCase: 'Safe code execution for student assignments and interactive coding lessons',
      results: [
        '99.9% sandbox reliability for student code',
        '10x faster execution than previous VM solution',
        'Zero security incidents in 18 months'
      ],
      quote: 'microsandbox transformed our platform. Students can now experiment fearlessly with code while we maintain complete security.',
      author: 'Sarah Chen',
      title: 'CTO, EduTech Solutions'
    },
    {
      name: 'SecureCode Analytics',
      category: 'Security',
      logo: 'SC',
      description: 'Cybersecurity firm specializing in automated malware analysis',
      useCase: 'Isolated malware execution and behavioral analysis',
      results: [
        '1M+ malware samples analyzed safely',
        'Complete isolation prevents lab contamination',
        '50% reduction in analysis infrastructure costs'
      ],
      quote: 'The hardware-level isolation gives us confidence to analyze the most sophisticated threats without risk.',
      author: 'Dr. Michael Rodriguez',
      title: 'Security Researcher, SecureCode Analytics'
    },
    {
      name: 'AI Dynamics',
      category: 'AI/ML',
      logo: 'AD',
      description: 'AI platform enabling businesses to deploy intelligent agents',
      useCase: 'Secure execution of AI-generated code and user scripts',
      results: [
        '500K+ AI-generated scripts executed safely',
        'Sub-second response times for agent workflows',
        'Seamless integration with existing AI pipelines'
      ],
      quote: 'Our AI agents can now generate and execute code in real-time without compromising security.',
      author: 'Lisa Wang',
      title: 'Head of Engineering, AI Dynamics'
    },
    {
      name: 'DevCloud Platform',
      category: 'Development',
      logo: 'DC',
      description: 'Cloud development environment provider for enterprise teams',
      useCase: 'Isolated development sandboxes for remote teams',
      results: [
        '2,000+ developers using daily',
        '95% reduction in environment setup time',
        'Complete project isolation and security'
      ],
      quote: 'microsandbox enabled us to offer instant, secure development environments that scale with our customers.',
      author: 'James Thompson',
      title: 'Founder, DevCloud Platform'
    },
    {
      name: 'FinTech Innovations',
      category: 'Financial Services',
      logo: 'FI',
      description: 'Financial services company providing algorithmic trading solutions',
      useCase: 'Safe execution of customer trading algorithms and strategies',
      results: [
        '10,000+ trading algorithms tested safely',
        'Zero market exposure from untrusted code',
        'Regulatory compliance maintained'
      ],
      quote: 'We can now safely test customer algorithms without risking our trading infrastructure or market position.',
      author: 'Robert Kim',
      title: 'Chief Risk Officer, FinTech Innovations'
    },
    {
      name: 'Research Institute',
      category: 'Research',
      logo: 'RI',
      description: 'Academic research institution studying distributed systems',
      useCase: 'Reproducible research experiments and student projects',
      results: [
        '100+ research projects using microsandbox',
        'Reproducible experiment environments',
        'Easy collaboration between research teams'
      ],
      quote: 'microsandbox made our distributed systems research reproducible and shareable across institutions.',
      author: 'Prof. Elena Vasquez',
      title: 'Director of Systems Research'
    }
  ];

  const industries = [
    {
      name: 'Education',
      count: '250+',
      description: 'Schools, universities, and online learning platforms',
      examples: ['Coding bootcamps', 'University CS departments', 'Online course platforms']
    },
    {
      name: 'Security',
      count: '180+',
      description: 'Cybersecurity firms and security research organizations',
      examples: ['Malware analysis labs', 'Penetration testing firms', 'Security consultancies']
    },
    {
      name: 'AI/ML',
      count: '120+',
      description: 'AI platforms and machine learning companies',
      examples: ['AI agent platforms', 'ML model training', 'Automated code generation']
    },
    {
      name: 'Enterprise',
      count: '300+',
      description: 'Large corporations and development teams',
      examples: ['Fortune 500 companies', 'Software development firms', 'DevOps teams']
    }
  ];

  const stats = [
    { label: 'Organizations', value: '850+', description: 'Trust microsandbox' },
    { label: 'Code Executions', value: '10M+', description: 'Processed monthly' },
    { label: 'Countries', value: '45+', description: 'Using microsandbox' },
    { label: 'Uptime', value: '99.9%', description: 'Reliability record' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Trusted by organizations{' '}
              <span className="gradient-text">worldwide</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              From startups to Fortune 500 companies, organizations choose microsandbox 
              for secure, fast, and reliable code execution.
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

      {/* Industries Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Serving Every Industry
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              microsandbox adapts to the unique needs of different industries
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry) => (
              <div key={industry.name} className="bg-gray-50 p-6 rounded-xl">
                <div className="text-2xl font-bold text-primary-600 mb-2">{industry.count}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{industry.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{industry.description}</p>
                <ul className="space-y-1">
                  {industry.examples.map((example) => (
                    <li key={example} className="text-xs text-gray-500 flex items-center">
                      <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></span>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Success Stories
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              See how organizations are using microsandbox to transform their operations
            </p>
          </div>

          <div className="space-y-16">
            {organizations.map((org, index) => (
              <div key={org.name} className={`flex flex-col lg:flex-row items-start gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {org.logo}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{org.name}</h3>
                      <div className="text-primary-600 font-semibold text-sm">{org.category}</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{org.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Use Case:</h4>
                    <p className="text-gray-600">{org.useCase}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Results:</h4>
                    <ul className="space-y-2">
                      {org.results.map((result) => (
                        <li key={result} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex-1 bg-white p-8 rounded-xl shadow-sm">
                  <div className="text-4xl text-primary-600 mb-4">"</div>
                  <blockquote className="text-lg text-gray-700 mb-6">
                    {org.quote}
                  </blockquote>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="font-semibold text-gray-900">{org.author}</div>
                    <div className="text-primary-600 text-sm">{org.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Enterprise-Grade Security & Compliance
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Built to meet the highest security and compliance standards
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">SOC 2 Type II</h3>
              <p className="text-gray-600 text-sm">Comprehensive security controls and regular audits</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">GDPR Compliant</h3>
              <p className="text-gray-600 text-sm">Full compliance with data protection regulations</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">ISO 27001</h3>
              <p className="text-gray-600 text-sm">International standard for information security</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="py-20 bg-primary-600">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Join the microsandbox community
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              Thousands of organizations trust microsandbox for secure code execution
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/microsandbox/microsandbox"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Start Free Today
              </a>
              <a
                href="mailto:sales@microsandbox.dev"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Contact Enterprise Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              What Organizations Say
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-primary-600 text-xl mb-3">"</div>
              <p className="text-gray-700 mb-4">
                "microsandbox solved our biggest challenge - running student code safely at scale."
              </p>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">CodeAcademy Pro</div>
                <div className="text-gray-600">Education Platform</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-primary-600 text-xl mb-3">"</div>
              <p className="text-gray-700 mb-4">
                "The hardware isolation gives us confidence to analyze the most dangerous malware."
              </p>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">ThreatGuard Security</div>
                <div className="text-gray-600">Cybersecurity Firm</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-primary-600 text-xl mb-3">"</div>
              <p className="text-gray-700 mb-4">
                "Our AI agents can now execute code safely without compromising our infrastructure."
              </p>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">AutoBot Systems</div>
                <div className="text-gray-600">AI Platform</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrganizationsPage;
