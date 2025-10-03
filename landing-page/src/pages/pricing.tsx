import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import {
  CheckIcon,
  XMarkIcon,
  StarIcon,
  ShieldCheckIcon,
  BoltIcon,
  ServerIcon,
  CpuChipIcon,
  CloudIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Developer',
      description: 'Perfect for individual developers and small projects',
      priceMonthly: 0,
      priceYearly: 0,
      popular: false,
      features: [
        'Up to 100 executions/day',
        '2 concurrent sandboxes',
        '500MB memory per sandbox',
        '30-second execution limit',
        'Community support',
        'All language SDKs',
        'Basic monitoring',
      ],
      notIncluded: [
        'Priority support',
        'Custom environments',
        'Advanced monitoring',
        'SLA guarantees',
      ]
    },
    {
      name: 'Professional',
      description: 'For growing teams and production applications',
      priceMonthly: 49,
      priceYearly: 39,
      popular: true,
      features: [
        'Up to 10,000 executions/day',
        '10 concurrent sandboxes',
        '2GB memory per sandbox',
        '5-minute execution limit',
        'Email support',
        'All language SDKs',
        'Advanced monitoring',
        'Custom environments',
        'Resource analytics',
        'API rate limit: 1000/min',
      ],
      notIncluded: [
        'Phone support',
        'Custom SLA',
        'Dedicated infrastructure',
      ]
    },
    {
      name: 'Enterprise',
      description: 'For large teams requiring maximum performance and control',
      priceMonthly: 199,
      priceYearly: 159,
      popular: false,
      features: [
        'Unlimited executions',
        'Unlimited concurrent sandboxes',
        'Up to 8GB memory per sandbox',
        '30-minute execution limit',
        'Priority phone & email support',
        'All language SDKs',
        'Advanced monitoring & alerting',
        'Custom environments',
        'Detailed analytics',
        'API rate limit: 10000/min',
        '99.9% uptime SLA',
        'Dedicated account manager',
        'Custom integrations',
      ],
      notIncluded: []
    }
  ];

  const features = [
    {
      category: 'Core Features',
      items: [
        { name: 'Hardware-level VM isolation', developer: true, professional: true, enterprise: true },
        { name: 'Sub-200ms startup times', developer: true, professional: true, enterprise: true },
        { name: 'Multi-language SDK support', developer: true, professional: true, enterprise: true },
        { name: 'OCI container compatibility', developer: true, professional: true, enterprise: true },
        { name: 'Built-in MCP support for AI', developer: true, professional: true, enterprise: true },
      ]
    },
    {
      category: 'Resource Limits',
      items: [
        { name: 'Daily executions', developer: '100', professional: '10,000', enterprise: 'Unlimited' },
        { name: 'Concurrent sandboxes', developer: '2', professional: '10', enterprise: 'Unlimited' },
        { name: 'Memory per sandbox', developer: '500MB', professional: '2GB', enterprise: '8GB' },
        { name: 'Execution time limit', developer: '30s', professional: '5min', enterprise: '30min' },
        { name: 'API rate limit', developer: '100/min', professional: '1000/min', enterprise: '10000/min' },
      ]
    },
    {
      category: 'Support & SLA',
      items: [
        { name: 'Community support', developer: true, professional: false, enterprise: false },
        { name: 'Email support', developer: false, professional: true, enterprise: true },
        { name: 'Priority phone support', developer: false, professional: false, enterprise: true },
        { name: 'Uptime SLA', developer: 'None', professional: 'Best effort', enterprise: '99.9%' },
        { name: 'Dedicated account manager', developer: false, professional: false, enterprise: true },
      ]
    },
    {
      category: 'Advanced Features',
      items: [
        { name: 'Basic monitoring', developer: true, professional: false, enterprise: false },
        { name: 'Advanced monitoring & analytics', developer: false, professional: true, enterprise: true },
        { name: 'Custom environments', developer: false, professional: true, enterprise: true },
        { name: 'Custom integrations', developer: false, professional: false, enterprise: true },
        { name: 'Compliance features', developer: false, professional: false, enterprise: true },
      ]
    }
  ];

  const faqs = [
    {
      question: 'Is Microsandbox really free for developers?',
      answer: 'Yes! Our Developer plan is completely free and includes 100 executions per day, which is perfect for learning, experimenting, and small projects. No credit card required.'
    },
    {
      question: 'What happens if I exceed my plan limits?',
      answer: 'We\'ll notify you when you approach your limits. For the Developer plan, executions will be queued until the next day. For paid plans, you can upgrade or purchase additional capacity.'
    },
    {
      question: 'Can I use my own infrastructure?',
      answer: 'Yes! Microsandbox is designed to be self-hosted. All plans include the ability to run on your own servers. Our cloud offering is optional and provided for convenience.'
    },
    {
      question: 'Do you offer custom pricing for large enterprises?',
      answer: 'Absolutely. For organizations with unique requirements or high-volume needs, we offer custom pricing and deployment options. Contact our sales team for details.'
    },
    {
      question: 'What kind of support is included?',
      answer: 'Developer plan includes community support via GitHub and Discord. Professional includes email support with 24-hour response time. Enterprise includes priority phone and email support with dedicated account management.'
    },
    {
      question: 'Can I switch plans anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate billing accordingly.'
    }
  ];

  return (
    <>
      <Head>
        <title>Pricing - Microsandbox | Simple, Transparent Pricing</title>
        <meta name="description" content="Choose the perfect Microsandbox plan for your needs. Free Developer plan, Professional for teams, and Enterprise for large organizations. Transparent pricing with no hidden fees." />
        <meta name="keywords" content="microsandbox pricing, plans, developer free, professional, enterprise, secure code execution pricing" />
        <meta property="og:title" content="Pricing - Microsandbox" />
        <meta property="og:description" content="Simple, transparent pricing for secure code execution. Start free, scale as you grow." />
        <link rel="canonical" href="https://microsandbox.dev/pricing" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16 sm:py-24">
          <div className="section-container">
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Simple, Transparent
                <br />
                <span className="gradient-text">Pricing</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Start free and scale as you grow. No hidden fees, no surprises—just powerful secure code execution at every level.
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center mb-12">
              <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      billingCycle === 'monthly'
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      billingCycle === 'yearly'
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Yearly
                    <span className="ml-1 text-xs bg-secondary-100 text-secondary-700 px-2 py-0.5 rounded-full">
                      Save 20%
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <div
                  key={plan.name}
                  className={`relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-xl animate-slide-up ${
                    plan.popular
                      ? 'border-primary-200 bg-primary-50 shadow-lg scale-105'
                      : 'border-gray-200 bg-white hover:border-primary-200'
                  }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                        <StarIcon className="w-4 h-4 mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                    <p className="text-gray-600 mb-8">{plan.description}</p>

                    <div className="mb-8">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-gray-900">
                          ${billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly}
                        </span>
                        <span className="text-lg text-gray-600 ml-2">/month</span>
                      </div>
                      {billingCycle === 'yearly' && plan.priceYearly < plan.priceMonthly && (
                        <p className="text-sm text-secondary-600 mt-2">
                          Save ${(plan.priceMonthly - plan.priceYearly) * 12}/year
                        </p>
                      )}
                    </div>

                    <button
                      className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                        plan.popular
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {plan.priceMonthly === 0 ? 'Get Started Free' : 'Start Free Trial'}
                    </button>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">What's included:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckIcon className="w-5 h-5 text-secondary-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                      {plan.notIncluded.map((feature, idx) => (
                        <li key={idx} className="flex items-start opacity-50">
                          <XMarkIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-500 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="section-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Feature Comparison</h2>
              <p className="text-xl text-gray-600">Compare all features across our plans</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Features</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-900">Developer</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-900">Professional</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-900">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((category, categoryIndex) => (
                      <React.Fragment key={category.category}>
                        <tr className="bg-gray-50">
                          <td colSpan={4} className="py-3 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                            {category.category}
                          </td>
                        </tr>
                        {category.items.map((item, itemIndex) => (
                          <tr key={item.name} className="border-t border-gray-100">
                            <td className="py-4 px-6 text-gray-900">{item.name}</td>
                            <td className="py-4 px-4 text-center">
                              {typeof item.developer === 'boolean' ? (
                                item.developer ? (
                                  <CheckIcon className="w-5 h-5 text-secondary-500 mx-auto" />
                                ) : (
                                  <XMarkIcon className="w-5 h-5 text-gray-400 mx-auto" />
                                )
                              ) : (
                                <span className="text-gray-700">{item.developer}</span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-center">
                              {typeof item.professional === 'boolean' ? (
                                item.professional ? (
                                  <CheckIcon className="w-5 h-5 text-secondary-500 mx-auto" />
                                ) : (
                                  <XMarkIcon className="w-5 h-5 text-gray-400 mx-auto" />
                                )
                              ) : (
                                <span className="text-gray-700">{item.professional}</span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-center">
                              {typeof item.enterprise === 'boolean' ? (
                                item.enterprise ? (
                                  <CheckIcon className="w-5 h-5 text-secondary-500 mx-auto" />
                                ) : (
                                  <XMarkIcon className="w-5 h-5 text-gray-400 mx-auto" />
                                )
                              ) : (
                                <span className="text-gray-700">{item.enterprise}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="section-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to know about Microsandbox pricing and plans.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-6 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-r from-primary-600 to-secondary-600">
          <div className="section-container">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Join thousands of developers using Microsandbox to execute untrusted code safely and efficiently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
                  Start Free Trial
                </button>
                <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-200">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default PricingPage;