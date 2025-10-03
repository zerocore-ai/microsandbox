import React from 'react';
import Link from 'next/link';
import {
  RocketLaunchIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

const CTA: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-r from-primary-600 to-secondary-600">
      <div className="section-container">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Experience Secure Code Execution?
          </h2>
          <p className="text-xl text-primary-100 mb-12 max-w-3xl mx-auto">
            Join thousands of developers using Microsandbox to execute untrusted code safely.
            Start with our free tier and experience the future of secure computing.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link
              href="/get-started"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold text-lg hover:bg-gray-50 hover:shadow-lg transition-all duration-200"
            >
              <RocketLaunchIcon className="w-5 h-5 mr-2" />
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all duration-200"
            >
              View Pricing
            </Link>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Link
              href="https://docs.microsandbox.dev"
              className="flex items-center justify-center p-6 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all duration-200 group"
            >
              <DocumentTextIcon className="w-8 h-8 mr-4 group-hover:scale-110 transition-transform duration-200" />
              <div className="text-left">
                <div className="font-semibold text-lg">Documentation</div>
                <div className="text-primary-200 text-sm">Complete guides and API reference</div>
              </div>
            </Link>

            <a
              href="https://github.com/microsandbox/microsandbox"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-6 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all duration-200 group"
            >
              <div className="w-8 h-8 mr-4 text-2xl group-hover:scale-110 transition-transform duration-200">⭐</div>
              <div className="text-left">
                <div className="font-semibold text-lg">Star on GitHub</div>
                <div className="text-primary-200 text-sm">Open source and community driven</div>
              </div>
            </a>

            <a
              href="https://discord.gg/T95Y3XnEAK"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-6 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all duration-200 group"
            >
              <ChatBubbleLeftRightIcon className="w-8 h-8 mr-4 group-hover:scale-110 transition-transform duration-200" />
              <div className="text-left">
                <div className="font-semibold text-lg">Join Discord</div>
                <div className="text-primary-200 text-sm">Community support and discussions</div>
              </div>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-12 border-t border-white/20">
            <p className="text-primary-200 mb-6">Trusted by developers at</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-75">
              <div className="text-white/80 text-2xl">🚀</div>
              <div className="text-white/80 font-semibold">Startups</div>
              <div className="text-white/80">•</div>
              <div className="text-white/80 text-2xl">🎓</div>
              <div className="text-white/80 font-semibold">Universities</div>
              <div className="text-white/80">•</div>
              <div className="text-white/80 text-2xl">🏢</div>
              <div className="text-white/80 font-semibold">Enterprises</div>
              <div className="text-white/80">•</div>
              <div className="text-white/80 text-2xl">🤖</div>
              <div className="text-white/80 font-semibold">AI Companies</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;