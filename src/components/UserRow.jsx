import PropTypes from 'prop-types';
import { getAvatar } from './Avatar';

export function UserRow({ user, currentUserId, onDelete }) {
  const isAdmin = user.username === 'admin';
  const isSelf = user.id === currentUserId;
  const deleteDisabled = isAdmin || isSelf;

  const roleBadge =
    user.role === 'admin' ? (
      <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
        Admin
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
        User
      </span>
    );

  const formattedDate = (() => {
    try {
      return new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Unknown';
    }
  })();

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {getAvatar(user.role)}
          <div>
            <p className="text-sm font-medium text-gray-800">{user.displayName}</p>
            <p className="text-xs text-gray-500">@{user.username}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        {roleBadge}
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-gray-600">{formattedDate}</span>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={() => onDelete(user.id)}
          disabled={deleteDisabled}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            deleteDisabled
              ? 'cursor-not-allowed bg-gray-100 text-gray-400'
              : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'
          }`}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  currentUserId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};