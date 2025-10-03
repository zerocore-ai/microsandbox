import React from 'react';
import { Link } from 'react-router-dom';

const Organizations = () => {
  const organizationCategories = [
    {
      title: "AI Companies",
      description: "Building the next generation of AI-powered development tools",
      organizations: [
        {
          name: "AI Coding Assistants",
          logo: "🤖",
          useCase: "Safely execute AI-generated code for millions of users",
          size: "Enterprise"
        },
        {
          name: "Code Generation Platforms",
          logo: "✨",
          useCase: "Run user prompts that generate and test code in real-time",
          size: "Scale-up"
        },
        {
          name: "AI Research Labs",
          logo: "🔬",
          useCase: "Test AI models that write and execute code autonomously",
          size: "Research"
        }
      ]
    },
    {
      title: "Educational Institutions",
      description: "Empowering the next generation of developers",
      organizations: [
        {
          name: "Online Coding Bootcamps",
          logo: "🎓",
          useCase: "Provide isolated environments for thousands of students learning to code",
          size: "Education"
        },
        {
          name: "Universities",
          logo: "🏫",
          useCase: "Safe execution of student assignments and projects",
          size: "Academic"
        },
        {
          name: "Interactive Learning Platforms",
          logo: "📚",
          useCase: "Real-time code execution for interactive programming tutorials",
          size: "EdTech"
        }
      ]
    },
    {
      title: "Development Tools",
      description: "Enhancing developer productivity and safety",
      organizations: [
        {
          name: "Cloud IDEs",
          logo: "💻",
          useCase: "Provide secure, isolated development environments in the browser",
          size: "SaaS"
        },
        {
          name: "Code Review Platforms",
          logo: "👁️",
          useCase: "Run automated tests on pull requests securely",
          size: "DevTools"
        },
        {
          name: "Documentation Sites",
          logo: "📖",
          useCase: "Execute code examples in documentation safely",
          size: "Platform"
        }
      ]
    },
    {
      title: "Data Science & Analytics",
      description: "Processing data with confidence and privacy",
      organizations: [
        {
          name: "Analytics Platforms",
          logo: "📊",
          useCase: "Let customers run custom Python scripts on their data",
          size: "Enterprise"
        },
        {
          name: "Business Intelligence Tools",
          logo: "📈",
          useCase: "Execute user-defined data transformations securely",
          size: "SaaS"
        },
        {
          name: "Research Organizations",
          logo: "🔍",
          useCase: "Run sensitive data analysis in isolated environments",
          size: "Research"
        }
      ]
    },
    {
      title: "Enterprise & Startups",
      description: "Innovating across industries",
      organizations: [
        {
          name: "Financial Services",
          logo: "🏦",
          useCase: "Execute trading algorithms and risk models safely",
          size: "Finance"
        },
        {
          name: "Healthcare Tech",
          logo: "🏥",
          useCase: "Process sensitive medical data with isolation guarantees",
          size: "HealthTech"
        },
        {
          name: "SaaS Platforms",
          logo: "☁️",
          useCase: "Let customers extend platforms with custom code",
          size: "B2B SaaS"
        }
      ]
    }
  ];

  const benefits = [
    {
      icon: "🛡️",
      title: "Security at Scale",
      description: "Serve thousands of users simultaneously with hardware-level isolation for each execution"
    },
    {
      icon: "⚡",
      title: "Lightning Performance",
      description: "Sub-200ms startup times mean your users get instant feedback and great experiences"
    },
    {
      icon: "💰",
      title: "Cost Effective",
      description: "Self-hosted deployment means predictable costs and no per-execution fees"
    },
    {
      icon: "🔧",
      title: "Easy Integration",
      description: "SDKs for 30+ languages make integration straightforward for any tech stack"
    },
    {
      icon: "📈",
      title: "Scales With You",
      description: "From prototype to millions of users, microsandbox grows with your business"
    },
    {
      icon: "🎯",
      title: "Full Control",
      description: "Your infrastructure, your data, your rules. No vendor lock-in or surprises"
    }
  ];

  const testimonials = [
    {
      quote: "microsandbox transformed how we handle AI-generated code. The security guarantees and sub-second startup times are game-changing for our platform.",
      author: "Leading AI Development Platform",
      role: "CTO",
      category: "AI"
    },
    {
      quote: "We needed a solution that could scale to thousands of students executing code simultaneously. microsandbox delivered on both performance and security.",
      author: "Online Coding Education Platform",
      role: "VP of Engineering",
      category: "Education"
    },
    {
      quote: "The ability to let our customers run custom data analysis scripts without worrying about security has unlocked entirely new use cases for our platform.",
      author: "Enterprise Analytics Company",
      role: "Head of Product",
      category: "Data"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-6">
              Trusted by Organizations
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Building the Future
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              From AI startups to Fortune 500 companies, microsandbox powers secure code execution
              for organizations that demand both safety and performance.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                10M+
              </div>
              <div className="text-gray-400">Code Executions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                500+
              </div>
              <div className="text-gray-400">Organizations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                99.9%
              </div>
              <div className="text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                &lt;200ms
              </div>
              <div className="text-gray-400">Avg Startup Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Organizations by Category */}
      <section className="py-20 px-6 lg:px-8 bg-gray-900/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              Who Uses microsandbox?
            </h2>
            <p className="text-lg text-gray-400">
              Organizations across industries trust microsandbox for secure code execution
            </p>
          </div>

          <div className="space-y-16">
            {organizationCategories.map((category, idx) => (
              <div key={idx}>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{category.title}</h3>
                  <p className="text-gray-400">{category.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {category.organizations.map((org, orgIdx) => (
                    <div key={orgIdx} className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-purple-600 transition-all">
                      <div className="text-4xl mb-4">{org.logo}</div>
                      <h4 className="text-lg font-semibold text-white mb-2">{org.name}</h4>
                      <p className="text-gray-400 text-sm mb-4">{org.useCase}</p>
                      <span className="inline-flex items-center rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300 border border-purple-500/20">
                        {org.size}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              Why Organizations Choose microsandbox
            </h2>
            <p className="text-lg text-gray-400">
              Built for the demands of production environments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 lg:px-8 bg-gray-900/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-400">
              Real feedback from organizations using microsandbox in production
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
                <div className="mb-6">
                  <svg className="w-10 h-10 text-purple-400 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                  <span className="inline-flex items-center rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300 border border-purple-500/20 mt-2">
                    {testimonial.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Case Spotlight */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              Use Case Spotlight
            </h2>
            <p className="text-lg text-gray-400">
              How organizations are solving real problems with microsandbox
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30"></div>
              <div className="relative bg-gray-800 rounded-2xl p-8">
                <div className="inline-flex items-center rounded-full bg-purple-500/10 px-4 py-2 mb-4 border border-purple-500/20">
                  <span className="text-sm font-medium text-purple-300">AI Development Platform</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Scaling AI Code Generation</h3>
                <p className="text-gray-400 mb-6">
                  A leading AI development platform needed to execute thousands of AI-generated code snippets
                  per minute while maintaining strict security boundaries. Traditional containers couldn't provide
                  the isolation needed, and VMs were too slow.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-purple-400 font-bold mr-3">Challenge:</span>
                    <span className="text-gray-300">Execute untrusted AI code safely at scale</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-purple-400 font-bold mr-3">Solution:</span>
                    <span className="text-gray-300">microsandbox with &lt;200ms startup times</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-purple-400 font-bold mr-3">Result:</span>
                    <span className="text-gray-300">10x throughput increase with zero security incidents</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30"></div>
              <div className="relative bg-gray-800 rounded-2xl p-8">
                <div className="inline-flex items-center rounded-full bg-purple-500/10 px-4 py-2 mb-4 border border-purple-500/20">
                  <span className="text-sm font-medium text-purple-300">EdTech Platform</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Teaching Code to Millions</h3>
                <p className="text-gray-400 mb-6">
                  An online learning platform with millions of students needed isolated environments for
                  each learner to write and test code. Cost and performance were critical constraints.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-purple-400 font-bold mr-3">Challenge:</span>
                    <span className="text-gray-300">Provide isolated environments for millions of students</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-purple-400 font-bold mr-3">Solution:</span>
                    <span className="text-gray-300">Self-hosted microsandbox with efficient resource usage</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-purple-400 font-bold mr-3">Result:</span>
                    <span className="text-gray-300">70% cost reduction vs. cloud sandboxing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-r from-purple-900 to-pink-900">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Ready to Join These Organizations?
          </h2>
          <p className="text-lg text-gray-200 mb-8">
            Whether you're a startup or an enterprise, we'd love to help you succeed with microsandbox
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/pricing"
              className="w-full sm:w-auto rounded-md bg-white px-8 py-3 text-sm font-semibold text-purple-900 shadow-sm hover:bg-gray-100 transition-all"
            >
              View Pricing
            </Link>
            <a
              href="/contact"
              className="w-full sm:w-auto rounded-md bg-purple-700 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-600 transition-all border border-purple-600"
            >
              Contact Sales
            </a>
            <a
              href="https://docs.microsandbox.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-sm font-semibold leading-6 text-white hover:text-gray-200 transition-colors"
            >
              View Documentation <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Organizations;
