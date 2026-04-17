import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getPosts, savePosts, getUsers } from '../utils/storage';
import { StatCard } from '../components/StatCard';
import { getAvatar } from '../components/Avatar';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      navigate('/login');
      return;
    }
    setSession(currentSession);
    setPosts(getPosts());
    setUsers(getUsers());
  }, [navigate]);

  const totalPosts = posts.length;
  const totalUsers = users.length + 1; // +1 for the hardcoded admin
  const adminCount = users.filter((u) => u.role === 'admin').length + 1;
  const userCount = users.filter((u) => u.role === 'user').length;

  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  function handleDeletePost(postId) {
    const updated = posts.filter((p) => p.id !== postId);
    savePosts(updated);
    setPosts(updated);
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3">
            {getAvatar('admin')}
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {session.displayName}!
              </h1>
              <p className="mt-1 text-violet-200">
                Here&apos;s an overview of your WriteSpace platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon="📝"
            label="Total Posts"
            value={totalPosts}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            icon="👥"
            label="Total Users"
            value={totalUsers}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            icon="👑"
            label="Admins"
            value={adminCount}
            color="bg-violet-100 text-violet-600"
          />
          <StatCard
            icon="📖"
            label="Users"
            value={userCount}
            color="bg-indigo-100 text-indigo-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
          <div className="mt-4 flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/write')}
              className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-violet-700 transition-colors"
            >
              ✍️ Write New Post
            </button>
            <button
              onClick={() => navigate('/users')}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-indigo-700 transition-colors"
            >
              👥 Manage Users
            </button>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-800">Recent Posts</h2>
          {recentPosts.length === 0 ? (
            <p className="mt-4 text-gray-500">
              No posts yet. Start by writing your first post!
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/read/${post.id}`}
                      className="text-base font-medium text-gray-800 hover:text-violet-600 transition-colors truncate block"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-1 text-sm text-gray-500">
                      by {post.authorName} &middot;{' '}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0 items-center gap-2">
                    <button
                      onClick={() => navigate(`/edit/${post.id}`)}
                      className="rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}