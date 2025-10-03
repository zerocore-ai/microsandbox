import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CTO',
      company: 'AI Development Platform',
      avatar: '👩‍💻',
      content: 'Microsandbox transformed how we handle AI-generated code. The sub-200ms execution times mean our users get instant feedback, and the VM-level isolation gives us complete confidence in security.',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Principal Engineer',
      company: 'EdTech Startup',
      avatar: '👨‍🎓',
      content: 'We process thousands of student code submissions daily. Microsandbox handles the scale effortlessly while keeping every execution completely isolated. It\'s been a game-changer for our platform.',
      rating: 5
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Security Researcher',
      company: 'University Research Lab',
      avatar: '👩‍🔬',
      content: 'For malware analysis and security research, we needed true isolation without performance penalties. Microsandbox delivers both perfectly. The hardware-level isolation is exactly what we needed.',
      rating: 5
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by <span className="gradient-text">Developers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what developers and organizations are saying about Microsandbox.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <div className="text-3xl mr-4">{testimonial.avatar}</div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 sm:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-700">Organizations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">50M+</div>
              <div className="text-gray-700">Executions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">99.9%</div>
              <div className="text-gray-700">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-700">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;