import React from 'react';
import {
  CodeBracketIcon,
  ChartBarIcon,
  GlobeAltIcon,
  RocketLaunchIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const UseCases: React.FC = () => {
  const useCases = [
    {
      icon: CodeBracketIcon,
      title: 'AI Code Generation',
      description: 'Enable AI assistants to generate, test, and iterate on code safely in real-time.',
      features: ['Built-in MCP support', 'Sub-200ms execution', 'Multi-language support', 'Session persistence'],
      gradient: 'from-blue-50 to-indigo-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: ChartBarIcon,
      title: 'Data Analysis',
      description: 'Run complex data processing and analysis tasks with complete isolation and security.',
      features: ['Jupyter notebook support', 'Large dataset handling', 'Visualization libraries', 'Memory optimization'],
      gradient: 'from-green-50 to-emerald-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: AcademicCapIcon,
      title: 'Educational Platforms',
      description: 'Provide safe environments for students to learn and experiment with code.',
      features: ['Student isolation', 'Automatic grading', 'Resource limits', 'Progress tracking'],
      gradient: 'from-purple-50 to-violet-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: GlobeAltIcon,
      title: 'Web Automation',
      description: 'Securely automate web tasks, scraping, and browser interactions.',
      features: ['Browser automation', 'Proxy support', 'Screenshot capture', 'Form automation'],
      gradient: 'from-orange-50 to-red-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Security Testing',
      description: 'Execute potentially malicious code for security analysis and threat research.',
      features: ['Malware analysis', 'Penetration testing', 'Vulnerability research', 'Forensic analysis'],
      gradient: 'from-red-50 to-pink-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      icon: RocketLaunchIcon,
      title: 'Instant App Hosting',
      description: 'Deploy and share applications instantly without complex setup or configuration.',
      features: ['Zero-config deployment', 'Automatic scaling', 'URL sharing', 'Resource monitoring'],
      gradient: 'from-yellow-50 to-amber-50',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    }
  ];

  return (
    <section id="use-cases" className="py-16 sm:py-24 bg-gray-50">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Endless <span className="gradient-text">Possibilities</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From AI development to education, Microsandbox enables secure code execution across industries and use cases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={useCase.title}
              className={`bg-gradient-to-br ${useCase.gradient} p-8 rounded-2xl border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-slide-up`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={`w-12 h-12 ${useCase.iconBg} rounded-xl flex items-center justify-center mb-6`}>
                <useCase.icon className={`w-6 h-6 ${useCase.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{useCase.title}</h3>
              <p className="text-gray-600 mb-6">{useCase.description}</p>
              <ul className="space-y-2">
                {useCase.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Development Workflow?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of developers and organizations using Microsandbox for secure, fast code execution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary text-lg px-8 py-4">
              Get Started Free
            </button>
            <button className="btn-secondary text-lg px-8 py-4">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;