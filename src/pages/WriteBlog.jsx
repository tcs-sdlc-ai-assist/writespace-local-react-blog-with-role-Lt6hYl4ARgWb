import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPosts, savePosts } from '../utils/storage';
import { getSession } from '../utils/auth';

export default function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }

    if (isEditMode) {
      const posts = getPosts();
      const post = posts.find((p) => p.id === id);

      if (!post) {
        navigate('/blogs', { replace: true });
        return;
      }

      if (session.role !== 'admin' && post.authorId !== session.userId) {
        navigate('/blogs', { replace: true });
        return;
      }

      setTitle(post.title);
      setContent(post.content);
      setLoading(false);
    }
  }, [id, isEditMode, navigate, session]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError('Title and content are both required.');
      return;
    }

    if (trimmedTitle.length > 100) {
      setError('Title must be 100 characters or fewer.');
      return;
    }

    if (trimmedContent.length > 2000) {
      setError('Content must be 2000 characters or fewer.');
      return;
    }

    const posts = getPosts();

    if (isEditMode) {
      const updatedPosts = posts.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            title: trimmedTitle,
            content: trimmedContent,
          };
        }
        return p;
      });
      savePosts(updatedPosts);
    } else {
      const newPost = {
        id: 'post-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9),
        title: trimmedTitle,
        content: trimmedContent,
        createdAt: new Date().toISOString(),
        authorId: session.userId,
        authorName: session.displayName,
      };
      savePosts([newPost, ...posts]);
    }

    navigate('/blogs', { replace: true });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          {isEditMode ? 'Edit Post' : 'Write a New Post'}
        </h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              maxLength={100}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-400">{title.length}/100 characters</p>
          </div>

          <div>
            <label htmlFor="content" className="mb-1 block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here..."
              maxLength={2000}
              rows={12}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
            />
            <p className="mt-1 text-xs text-gray-400">{content.length}/2000 characters</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              {isEditMode ? 'Update Post' : 'Publish Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/blogs')}
              className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}