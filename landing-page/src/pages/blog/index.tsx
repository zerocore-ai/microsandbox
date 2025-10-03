import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const BlogIndex: React.FC = () => {
  const blogPosts = [
    {
      id: 'why-microvm-isolation-matters',
      title: 'Why MicroVM Isolation Matters: The Future of Secure Code Execution',
      excerpt: 'Explore how microVM technology revolutionizes code execution security by providing hardware-level isolation with container-like performance. Learn why traditional sandboxing methods fall short and how Microsandbox achieves the perfect balance.',
      author: 'Microsandbox Team',
      date: '2024-01-15',
      readTime: '8 min read',
      category: 'Technology',
      featured: true,
      tags: ['Security', 'MicroVM', 'Isolation', 'Architecture']
    },
    {
      id: 'ai-powered-development-secure-execution',
      title: 'AI-Powered Development Meets Secure Execution: Building the Next Generation of Coding Tools',
      excerpt: 'Discover how AI code generation platforms are leveraging secure execution environments to enable safe, real-time code testing. From Claude integrations to custom AI assistants, see how Microsandbox powers the AI development revolution.',
      author: 'Microsandbox Team',
      date: '2024-01-08',
      readTime: '6 min read',
      category: 'AI & Development',
      featured: false,
      tags: ['AI', 'Development', 'Code Generation', 'MCP']
    }
  ];

  const categories = [
    { name: 'All', count: 2 },
    { name: 'Technology', count: 1 },
    { name: 'AI & Development', count: 1 },
  ];

  return (
    <>
      <Head>
        <title>Blog - Microsandbox | Insights on Secure Code Execution</title>
        <meta name="description" content="Read the latest insights on secure code execution, microVM technology, AI development, and more from the Microsandbox team. Stay updated with industry trends and best practices." />
        <meta name="keywords" content="microsandbox blog, secure code execution, microvm, ai development, security insights, technology articles" />
        <meta property="og:title" content="Blog - Microsandbox" />
        <meta property="og:description" content="Latest insights on secure code execution and microVM technology from the Microsandbox team." />
        <link rel="canonical" href="https://microsandbox.dev/blog" />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16 sm:py-24">
          <div className="section-container">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Insights & Updates
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Stay updated with the latest developments in secure code execution, microVM technology, and AI-powered development tools.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Content */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Featured Post */}
                {blogPosts.filter(post => post.featured).map((post, index) => (
                  <div
                    key={post.id}
                    className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 mb-12 animate-slide-up"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="flex items-center mb-4">
                      <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </span>
                      <span className="ml-3 text-primary-600 text-sm font-medium">{post.category}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                      <Link href={`/blog/${post.id}`} className="hover:text-primary-600 transition-colors duration-200">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <UserIcon className="w-4 h-4 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {post.readTime}
                        </div>
                      </div>
                      <Link
                        href={`/blog/${post.id}`}
                        className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors duration-200"
                      >
                        Read More
                        <ArrowRightIcon className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                ))}

                {/* All Posts */}
                <div className="space-y-8">
                  {blogPosts.map((post, index) => (
                    <article
                      key={post.id}
                      className="border-b border-gray-200 pb-8 last:border-b-0 animate-slide-up"
                      style={{ animationDelay: `${(index + 1) * 200}ms` }}
                    >
                      <div className="flex items-center mb-4">
                        <span className="text-primary-600 text-sm font-medium">{post.category}</span>
                        <span className="ml-2 text-gray-400">•</span>
                        <span className="ml-2 text-gray-500 text-sm">{post.readTime}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                        <Link href={`/blog/${post.id}`} className="hover:text-primary-600 transition-colors duration-200">
                          {post.title}
                        </Link>
                      </h2>
                      <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <UserIcon className="w-4 h-4 mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-8">
                  {/* Categories */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                    <ul className="space-y-2">
                      {categories.map(category => (
                        <li key={category.name}>
                          <button className="flex items-center justify-between w-full text-left text-gray-600 hover:text-primary-600 transition-colors duration-200">
                            <span>{category.name}</span>
                            <span className="text-sm bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                              {category.count}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Newsletter Signup */}
                  <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Stay Updated</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Get the latest updates on secure code execution and microVM technology.
                    </p>
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <button className="w-full btn-primary text-sm">
                        Subscribe
                      </button>
                    </div>
                  </div>

                  {/* Recent Tags */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Security', 'MicroVM', 'AI', 'Development', 'Isolation', 'Architecture', 'MCP'].map(tag => (
                        <button
                          key={tag}
                          className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-xs rounded-full hover:border-primary-300 hover:text-primary-600 transition-colors duration-200"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default BlogIndex;