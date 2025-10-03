import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const plans = [
    {
      name: "Open Source",
      price: "Free",
      period: "forever",
      description: "Perfect for individual developers and small projects",
      features: [
        "Self-hosted deployment",
        "Unlimited sandboxes",
        "All core features",
        "Community support",
        "Apache 2.0 license",
        "All SDK languages",
        "MCP integration",
        "OCI image support"
      ],
      cta: "Get Started",
      ctaLink: "https://docs.microsandbox.dev",
      popular: false,
      highlight: false
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For teams and organizations with advanced needs",
      features: [
        "Everything in Open Source",
        "Priority support (24/7)",
        "SLA guarantees",
        "Custom integrations",
        "Training & onboarding",
        "Architecture consultation",
        "Security audit support",
        "Dedicated account manager",
        "Custom feature development",
        "On-premise installation help"
      ],
      cta: "Contact Sales",
      ctaLink: "/contact",
      popular: true,
      highlight: true
    }
  ];

  const addOns = [
    {
      name: "Professional Support",
      description: "Get priority support with faster response times",
      features: [
        "Email support (24-48h response)",
        "Bug fix priority",
        "Architecture guidance",
        "Best practices consultation"
      ]
    },
    {
      name: "Training & Onboarding",
      description: "Expert-led training for your team",
      features: [
        "Custom training sessions",
        "Team onboarding",
        "Best practices workshop",
        "Architecture review"
      ]
    },
    {
      name: "Custom Development",
      description: "Need a specific feature? We can build it for you",
      features: [
        "Custom feature development",
        "Integration development",
        "SDK for new languages",
        "Custom image creation"
      ]
    }
  ];

  const faqs = [
    {
      question: "Is microsandbox really free?",
      answer: "Yes! microsandbox is open source under the Apache 2.0 license. You can use it completely free for any purpose, including commercial use. All core features are available in the open source version."
    },
    {
      question: "What's included in Enterprise support?",
      answer: "Enterprise support includes 24/7 priority support with SLA guarantees, dedicated account management, custom integrations, training, and consultation services. We work closely with enterprise customers to ensure successful deployment and operation."
    },
    {
      question: "Can I run microsandbox in production for free?",
      answer: "Absolutely! The open source version includes all core features you need for production deployments. Many companies run microsandbox in production using the free open source version. Enterprise support is available for those who need guaranteed SLAs and dedicated assistance."
    },
    {
      question: "Do you offer cloud hosting?",
      answer: "microsandbox is designed to be self-hosted on your infrastructure, giving you complete control and data privacy. We can help you deploy on any cloud provider (AWS, GCP, Azure) or on-premise infrastructure through our Enterprise support."
    },
    {
      question: "What payment methods do you accept?",
      answer: "For Enterprise customers, we accept wire transfers, purchase orders, and major credit cards. Contact our sales team to discuss payment options that work for your organization."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Since the open source version is always free, there's nothing to upgrade from! If you're interested in Enterprise support, you can contact us anytime. Enterprise contracts are typically annual with flexible terms."
    },
    {
      question: "Do you offer academic or non-profit discounts?",
      answer: "Yes! We offer special pricing for academic institutions, non-profits, and open source projects. Contact us to discuss your specific needs."
    },
    {
      question: "What if I need help getting started?",
      answer: "We have comprehensive documentation and an active Discord community for free users. Enterprise customers get dedicated onboarding and training. We also offer professional services for custom deployments."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-6">
              Simple,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Transparent Pricing
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              Start for free with full-featured open source. Scale to Enterprise when you need dedicated support.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 max-w-5xl mx-auto">
            {plans.map((plan, idx) => (
              <div key={idx} className="relative">
                {plan.popular && (
                  <div className="absolute -top-5 left-0 right-0 flex justify-center">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className={`relative h-full ${plan.highlight ? 'mt-5' : ''}`}>
                  {plan.highlight && (
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-50"></div>
                  )}
                  <div className={`relative bg-gray-800 rounded-2xl p-8 border h-full flex flex-col ${
                    plan.highlight ? 'border-purple-600' : 'border-gray-700'
                  }`}>
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                      <div className="flex items-baseline">
                        <span className="text-5xl font-bold text-white">{plan.price}</span>
                        {plan.period && (
                          <span className="text-gray-400 ml-2">/ {plan.period}</span>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8 flex-grow">
                      {plan.features.map((feature, featureIdx) => (
                        <li key={featureIdx} className="flex items-start">
                          <svg className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={plan.ctaLink}
                      className={`block text-center rounded-md px-8 py-3 text-sm font-semibold shadow-sm transition-all ${
                        plan.highlight
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {plan.cta}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 px-6 lg:px-8 bg-gray-900/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              Professional Services
            </h2>
            <p className="text-lg text-gray-400">
              Additional services to help you succeed with microsandbox
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {addOns.map((addon, idx) => (
              <div key={idx} className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 hover:border-purple-600 transition-colors">
                <h3 className="text-xl font-bold text-white mb-3">{addon.name}</h3>
                <p className="text-gray-400 mb-6">{addon.description}</p>
                <ul className="space-y-3">
                  {addon.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start text-sm">
                      <svg className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">
              Interested in professional services?
            </p>
            <a
              href="/contact"
              className="inline-flex items-center rounded-md bg-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              Detailed Comparison
            </h2>
            <p className="text-lg text-gray-400">
              See what's included in each option
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-purple-600">
                  <th className="py-4 px-6 text-white font-semibold">Feature</th>
                  <th className="py-4 px-6 text-white font-semibold text-center">Open Source</th>
                  <th className="py-4 px-6 text-white font-semibold text-center bg-purple-900/20">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-6 text-gray-300">Self-hosted deployment</td>
                  <td className="py-4 px-6 text-center text-green-400">✓</td>
                  <td className="py-4 px-6 text-center text-green-400 bg-purple-900/10">✓</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-6 text-gray-300">Unlimited sandboxes</td>
                  <td className="py-4 px-6 text-center text-green-400">✓</td>
                  <td className="py-4 px-6 text-center text-green-400 bg-purple-900/10">✓</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-6 text-gray-300">All core features</td>
                  <td className="py-4 px-6 text-center text-green-400">✓</td>
                  <td className="py-4 px-6 text-center text-green-400 bg-purple-900/10">✓</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-6 text-gray-300">Multi-language SDKs</td>
                  <td className="py-4 px-6 text-center text-green-400">✓</td>
                  <td className="py-4 px-6 text-center text-green-400 bg-purple-900/10">✓</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-6 text-gray-300">Community support</td>
                  <td className="py-4 px-6 text-center text-green-400">✓</td>
                  <td className="py-4 px-6 text-center text-green-400 bg-purple-900/10">✓</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-6 text-gray-300">Priority support (24/7)</td>
                  <td className="py-4 px-6 text-center text-gray-600">-</td>
                  <td className="py-4 px-6 text-center text-green-400 bg-purple-900/10">✓</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-6 text-gray-300">SLA guarantees</td>
                  <td className="py-4 px-6 text-center text-gray-600">-</td>
                  <td className="py-4 px-6 text-center text-green-400 bg-purple-900/10">✓</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-6 text-gray-300">Dedicated account manager</td>
                  <td className="py-4 px-6 text-center text-gray-600">-</td>
                  <td className="py-4 px-6 text-center text-green-400 bg-purple-900/10">✓</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-6 text-gray-300">Custom integrations</td>
                  <td className="py-4 px-6 text-center text-gray-600">-</td>
                  <td className="py-4 px-6 text-center text-green-400 bg-purple-900/10">✓</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-6 text-gray-300">Training & onboarding</td>
                  <td className="py-4 px-6 text-center text-gray-600">-</td>
                  <td className="py-4 px-6 text-center text-green-400 bg-purple-900/10">✓</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-6 text-gray-300">Security audit support</td>
                  <td className="py-4 px-6 text-center text-gray-600">-</td>
                  <td className="py-4 px-6 text-center text-green-400 bg-purple-900/10">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 lg:px-8 bg-gray-900/50">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-400">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-r from-purple-900 to-pink-900">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-200 mb-8">
            Start with open source today, or talk to us about Enterprise support
          </p>
          <div className="flex items-center justify-center gap-x-6">
            <a
              href="https://docs.microsandbox.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-white px-8 py-3 text-sm font-semibold text-purple-900 shadow-sm hover:bg-gray-100 transition-all"
            >
              Get Started Free
            </a>
            <a
              href="/contact"
              className="text-sm font-semibold leading-6 text-white hover:text-gray-200 transition-colors"
            >
              Contact Sales <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
