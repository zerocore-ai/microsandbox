import React from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const PricingPage: React.FC = () => {
  const plans = [
    {
      name: 'Open Source',
      price: 'Free',
      description: 'Perfect for individual developers and small projects',
      features: [
        'Self-hosted deployment',
        'All core features',
        'Community support',
        'Up to 10 concurrent sandboxes',
        'Basic monitoring',
        'Open source license'
      ],
      limitations: [
        'No SLA guarantees',
        'Community support only',
        'Basic resource management'
      ],
      cta: 'Get Started',
      href: 'https://github.com/microsandbox/microsandbox',
      popular: false
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      description: 'Ideal for growing teams and production workloads',
      features: [
        'Everything in Open Source',
        'Up to 100 concurrent sandboxes',
        'Advanced monitoring & analytics',
        'Priority email support',
        'Resource usage insights',
        'Custom environment templates',
        'API rate limiting controls',
        'Enhanced security features'
      ],
      limitations: [],
      cta: 'Start Free Trial',
      href: '#contact',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations with specific requirements',
      features: [
        'Everything in Professional',
        'Unlimited concurrent sandboxes',
        'Dedicated support team',
        'Custom SLA agreements',
        'On-premise deployment assistance',
        'Custom integrations',
        'Advanced security auditing',
        'Multi-region deployment',
        'Custom training sessions'
      ],
      limitations: [],
      cta: 'Contact Sales',
      href: '#contact',
      popular: false
    }
  ];

  const addOns = [
    {
      name: 'Priority Support',
      description: '24/7 technical support with guaranteed response times',
      price: '$99/month'
    },
    {
      name: 'Advanced Analytics',
      description: 'Detailed usage analytics and performance insights',
      price: '$49/month'
    },
    {
      name: 'Custom Environments',
      description: 'Pre-built custom environments for your specific use cases',
      price: '$149/month'
    }
  ];

  const faqs = [
    {
      question: 'Is the open source version really free?',
      answer: 'Yes! microsandbox is licensed under Apache 2.0 and completely free to use. You can deploy it on your own infrastructure without any licensing costs.'
    },
    {
      question: 'What\'s the difference between self-hosted and managed versions?',
      answer: 'The open source version is self-hosted, meaning you deploy and manage it yourself. Our paid plans include managed hosting, support, and additional features.'
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.'
    },
    {
      question: 'What kind of support is included?',
      answer: 'Open source users get community support via GitHub and Discord. Paid plans include email support with guaranteed response times.'
    },
    {
      question: 'Do you offer custom enterprise solutions?',
      answer: 'Yes! We work with enterprise customers to create custom solutions that meet their specific security, compliance, and performance requirements.'
    },
    {
      question: 'Is there a limit on execution time or resource usage?',
      answer: 'You can configure resource limits per sandbox. Our paid plans include monitoring tools to help you optimize resource usage and costs.'
    }
  ];

  const usageExamples = [
    {
      use_case: 'Educational Platform',
      scenario: '1,000 students, 50 concurrent executions',
      recommendation: 'Professional',
      monthly_cost: '$29'
    },
    {
      use_case: 'AI Agent Platform',
      scenario: '10,000 code executions/day, 200 concurrent',
      recommendation: 'Enterprise',
      monthly_cost: 'Custom pricing'
    },
    {
      use_case: 'Development Team',
      scenario: '20 developers, testing untrusted code',
      recommendation: 'Professional',
      monthly_cost: '$29'
    },
    {
      use_case: 'Security Research',
      scenario: 'Malware analysis, isolated execution',
      recommendation: 'Open Source',
      monthly_cost: 'Free'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Simple, transparent{' '}
              <span className="gradient-text">pricing</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Start free with open source, scale with managed solutions. 
              No hidden fees, no vendor lock-in.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? 'ring-2 ring-primary-600 bg-primary-50'
                    : 'bg-gray-50'
                } shadow-sm`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline justify-center gap-x-2">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-lg font-semibold text-gray-600">{plan.period}</span>
                    )}
                  </div>
                  <p className="mt-4 text-gray-600">{plan.description}</p>
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation) => (
                    <li key={limitation} className="flex items-start gap-3">
                      <XMarkIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-500">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <a
                    href={plan.href}
                    target={plan.href.startsWith('http') ? '_blank' : undefined}
                    rel={plan.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                      plan.popular
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Which plan is right for you?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Here are some common use cases and our recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {usageExamples.map((example) => (
              <div key={example.use_case} className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{example.use_case}</h3>
                <p className="text-gray-600 text-sm mb-4">{example.scenario}</p>
                <div className="flex justify-between items-center">
                  <span className="text-primary-600 font-semibold">
                    Recommended: {example.recommendation}
                  </span>
                  <span className="text-gray-900 font-bold">{example.monthly_cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Optional Add-ons
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Extend your microsandbox capabilities with these optional services
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {addOns.map((addon) => (
              <div key={addon.name} className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{addon.name}</h3>
                <p className="text-gray-600 mb-4">{addon.description}</p>
                <div className="text-2xl font-bold text-primary-600">{addon.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {faqs.map((faq) => (
              <div key={faq.question} className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Contact */}
      <section id="contact" className="py-20 bg-primary-600">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Need something custom?
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              We work with enterprise customers to create tailored solutions
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:sales@microsandbox.dev"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Contact Sales
              </a>
              <a
                href="https://calendly.com/microsandbox/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Schedule a Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-6">Trusted by developers worldwide</p>
            <div className="flex justify-center items-center space-x-8 text-gray-400">
              <div className="text-xs">
                <div className="font-semibold">Apache 2.0</div>
                <div>Open Source</div>
              </div>
              <div className="text-xs">
                <div className="font-semibold">SOC 2</div>
                <div>Compliant</div>
              </div>
              <div className="text-xs">
                <div className="font-semibold">GDPR</div>
                <div>Ready</div>
              </div>
              <div className="text-xs">
                <div className="font-semibold">99.9%</div>
                <div>Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
