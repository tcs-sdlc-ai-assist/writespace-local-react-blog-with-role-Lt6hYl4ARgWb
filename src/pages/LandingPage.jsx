import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar';
import { getPosts } from '../utils/storage';
import { getAvatar } from '../components/Avatar';

/**
 * Formats an ISO date string into a human-readable format.
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date string
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * Truncates content to a maximum character length, appending ellipsis if needed.
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum number of characters
 * @returns {string} Truncated text
 */
function truncate(text, maxLength = 120) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

const FEATURES = [
  {
    icon: '🔒',
    title: 'Privacy First',
    description:
      'All your data stays in your browser. No servers, no tracking, no third-party access. Your writing belongs to you.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: '👥',
    title: 'Role-Based Access',
    description:
      'Admins manage users and all content. Regular users create and manage their own posts. Clear permissions, zero confusion.',
    color: 'bg-violet-100 text-violet-600',
  },
  {
    icon: '⚡',
    title: 'Instant Setup',
    description:
      'No backend to configure, no database to provision. Register and start writing in seconds. It just works.',
    color: 'bg-amber-100 text-amber-600',
  },
];

export default function LandingPage() {
  const [latestPosts, setLatestPosts] = useState([]);

  useEffect(() => {
    const posts = getPosts();
    const sorted = [...posts]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
    setLatestPosts(sorted);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-20 text-center text-white sm:py-28">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            WriteSpace
          </h1>
          <p className="mt-4 text-lg text-violet-100 sm:text-xl">
            A clean, distraction-free writing workspace. Create, manage, and share
            your blog posts — all stored privately in your browser.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-md transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-block rounded-lg border-2 border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-gray-800 sm:text-3xl">
            Why WriteSpace?
          </h2>
          <p className="mt-2 text-center text-gray-500">
            Everything you need to start writing, nothing you don&apos;t.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${feature.color}`}
                >
                  <span className="text-xl">{feature.icon}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-800">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-gray-800 sm:text-3xl">
            Latest Posts
          </h2>
          <p className="mt-2 text-center text-gray-500">
            See what people are writing about.
          </p>

          {latestPosts.length === 0 ? (
            <div className="mt-10 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
              <p className="text-gray-500">
                No posts yet. Be the first to{' '}
                <Link
                  to="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  create an account
                </Link>{' '}
                and start writing!
              </p>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="flex flex-col rounded-lg bg-gray-50 p-5 shadow-md transition-shadow hover:shadow-lg"
                >
                  <h3 className="mb-2 text-lg font-bold text-gray-800 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mb-4 flex-1 text-sm text-gray-600">
                    {truncate(post.content)}
                  </p>
                  <div className="mt-auto flex items-center gap-3">
                    {getAvatar(post.authorId === 'admin' ? 'admin' : 'user')}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">
                        {post.authorName}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-indigo-600">WriteSpace</span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="text-sm text-gray-600 transition hover:text-indigo-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm text-gray-600 transition hover:text-indigo-600"
              >
                Register
              </Link>
              <Link
                to="/blogs"
                className="text-sm text-gray-600 transition hover:text-indigo-600"
              >
                Blogs
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}