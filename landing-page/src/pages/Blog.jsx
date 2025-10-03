import React from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const posts = [
    {
      id: 1,
      slug: "why-microsandbox-better-than-containers",
      title: "Why microsandbox is Better Than Containers for Running Untrusted Code",
      excerpt: "Containers revolutionized deployment, but when it comes to running untrusted code, they fall short. Learn why hardware-level isolation is the future of secure code execution.",
      author: "microsandbox Team",
      date: "October 2, 2025",
      readTime: "8 min read",
      category: "Security",
      image: "🛡️",
      tags: ["Security", "Containers", "MicroVMs"]
    },
    {
      id: 2,
      slug: "building-ai-coding-assistant-with-microsandbox",
      title: "Building an AI Coding Assistant with microsandbox: A Complete Guide",
      excerpt: "From ChatGPT to Claude, AI coding assistants are everywhere. Learn how to build your own secure AI coding assistant that can execute code safely using microsandbox.",
      author: "microsandbox Team",
      date: "October 1, 2025",
      readTime: "12 min read",
      category: "Tutorial",
      image: "🤖",
      tags: ["AI", "Tutorial", "MCP"]
    }
  ];

  const categories = ["All", "Security", "Tutorial", "Performance", "Use Cases"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-6">
              microsandbox
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Blog
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              Insights, tutorials, and updates on secure code execution, microVMs, and building with microsandbox
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, idx) => (
              <button
                key={idx}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  category === "All"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
                <article className="relative bg-gray-800/90 backdrop-blur-lg rounded-2xl border border-gray-700 overflow-hidden h-full flex flex-col">
                  <div className="p-8 flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex items-center rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300 border border-purple-500/20">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-400">{post.readTime}</span>
                    </div>

                    <div className="text-5xl mb-4">{post.image}</div>

                    <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-gray-400 mb-6">{post.excerpt}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs text-gray-500 bg-gray-900/50 px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="px-8 py-4 border-t border-gray-700 flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      <div className="font-medium text-gray-300">{post.author}</div>
                      <div>{post.date}</div>
                    </div>
                    <div className="text-purple-400 group-hover:text-purple-300 transition-colors">
                      Read more →
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-6 lg:px-8 bg-gray-900/50">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Stay Updated
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Get the latest articles, tutorials, and microsandbox updates delivered to your inbox
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 transition-colors"
            />
            <button
              type="submit"
              className="rounded-md bg-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Start using microsandbox today for secure code execution
          </p>
          <div className="flex items-center justify-center gap-x-6">
            <Link
              to="/"
              className="rounded-md bg-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 transition-all"
            >
              Get Started
            </Link>
            <a
              href="https://docs.microsandbox.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold leading-6 text-white hover:text-purple-300 transition-colors"
            >
              View Documentation <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
