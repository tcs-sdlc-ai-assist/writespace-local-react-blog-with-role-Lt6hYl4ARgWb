import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPosts, savePosts } from '../utils/storage';
import { getSession } from '../utils/auth';
import { getAvatar } from '../components/Avatar';

export default function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const session = getSession();

  useEffect(() => {
    const posts = getPosts();
    const found = posts.find((p) => p.id === id);
    if (found) {
      setPost(found);
    } else {
      setNotFound(true);
    }
  }, [id]);

  const isOwnerOrAdmin =
    session && post && (session.role === 'admin' || session.userId === post.authorId);

  function handleDelete() {
    const posts = getPosts();
    const updated = posts.filter((p) => p.id !== id);
    savePosts(updated);
    navigate('/blogs');
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <h1 className="text-4xl font-bold text-gray-800">404</h1>
        <p className="mt-2 text-lg text-gray-600">Post not found.</p>
        <Link
          to="/blogs"
          className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/blogs"
          className="mb-6 inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          ← Back to Blogs
        </Link>

        <article className="rounded-lg bg-white p-8 shadow-md">
          <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>

          <div className="mt-4 flex items-center gap-3">
            {getAvatar(post.authorId === 'admin' ? 'admin' : 'user')}
            <div>
              <p className="text-sm font-medium text-gray-800">{post.authorName}</p>
              <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
          </div>

          <div className="mt-8 whitespace-pre-wrap text-gray-700 leading-relaxed">
            {post.content}
          </div>

          {isOwnerOrAdmin && (
            <div className="mt-8 flex items-center gap-3 border-t border-gray-100 pt-6">
              <Link
                to={`/edit/${post.id}`}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                Edit
              </Link>
              {!showConfirm ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Are you sure?</span>
                  <button
                    onClick={handleDelete}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}