import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getPosts } from '../utils/storage';
import { BlogCard } from '../components/BlogCard';

export default function Home() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      navigate('/login', { replace: true });
      return;
    }
    setSession(currentSession);

    const allPosts = getPosts();
    const sorted = [...allPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setPosts(sorted);
  }, [navigate]);

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold">All Blog Posts</h1>
          <p className="mt-1 text-indigo-200">
            Browse the latest posts from the WriteSpace community.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg bg-white py-16 shadow-md">
            <span className="text-5xl">📝</span>
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              No posts yet
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Be the first to share something with the community!
            </p>
            <Link
              to="/write"
              className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-indigo-700 transition-colors"
            >
              ✍️ Write Your First Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}