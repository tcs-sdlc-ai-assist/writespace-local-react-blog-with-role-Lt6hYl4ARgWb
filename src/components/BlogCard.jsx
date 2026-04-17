import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getAvatar } from './Avatar';
import { getSession } from '../utils/auth';

const BORDER_COLORS = [
  'border-t-rose-500',
  'border-t-sky-500',
  'border-t-amber-500',
  'border-t-emerald-500',
  'border-t-violet-500',
  'border-t-pink-500',
  'border-t-teal-500',
  'border-t-orange-500',
];

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

export function BlogCard({ post, index }) {
  const session = getSession();
  const borderColor = BORDER_COLORS[index % BORDER_COLORS.length];

  const isAdmin = session && session.role === 'admin';
  const isOwner = session && session.userId === post.authorId;
  const canEdit = isAdmin || isOwner;

  return (
    <div
      className={`relative flex flex-col rounded-lg border-t-4 ${borderColor} bg-white shadow-md transition-shadow hover:shadow-lg`}
    >
      <Link to={`/blog/${post.id}`} className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-lg font-bold text-gray-800 line-clamp-2">
          {post.title}
        </h3>
        <p className="mb-4 flex-1 text-sm text-gray-600">
          {truncate(post.content)}
        </p>
        <div className="mt-auto flex items-center gap-3">
          {getAvatar(post.authorRole || 'user')}
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

      {canEdit && (
        <Link
          to={`/edit/${post.id}`}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-indigo-100 hover:text-indigo-600"
          title="Edit post"
          onClick={(e) => e.stopPropagation()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </Link>
      )}
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
    authorRole: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
};