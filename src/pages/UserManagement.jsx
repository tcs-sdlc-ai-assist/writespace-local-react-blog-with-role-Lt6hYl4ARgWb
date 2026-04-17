import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getUsers, saveUsers } from '../utils/storage';
import { UserRow } from '../components/UserRow';

export default function UserManagement() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [users, setUsers] = useState([]);

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      navigate('/login', { replace: true });
      return;
    }
    if (currentSession.role !== 'admin') {
      navigate('/blogs', { replace: true });
      return;
    }
    setSession(currentSession);
    setUsers(getUsers());
  }, [navigate]);

  function handleCreateUser(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword) {
      setError('All fields are required.');
      return;
    }

    if (trimmedUsername.toLowerCase() === 'admin') {
      setError('Username is already taken.');
      return;
    }

    const currentUsers = getUsers();
    const duplicate = currentUsers.some(
      (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
    );

    if (duplicate) {
      setError('Username is already taken.');
      return;
    }

    const newUser = {
      id: 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8),
      displayName: trimmedDisplayName,
      username: trimmedUsername,
      password: trimmedPassword,
      role: role,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...currentUsers, newUser];
    saveUsers(updatedUsers);
    setUsers(updatedUsers);

    setDisplayName('');
    setUsername('');
    setPassword('');
    setRole('user');
    setSuccess(`User "${newUser.displayName}" created successfully.`);
  }

  function handleDeleteRequest(userId) {
    setConfirmDeleteId(userId);
  }

  function handleConfirmDelete() {
    if (!confirmDeleteId) return;

    const currentUsers = getUsers();
    const updatedUsers = currentUsers.filter((u) => u.id !== confirmDeleteId);
    saveUsers(updatedUsers);
    setUsers(updatedUsers);
    setConfirmDeleteId(null);
    setSuccess('User deleted successfully.');
    setError('');
  }

  function handleCancelDelete() {
    setConfirmDeleteId(null);
  }

  if (!session) {
    return null;
  }

  const allUsers = [
    {
      id: 'admin',
      displayName: 'Admin',
      username: 'admin',
      role: 'admin',
      createdAt: '2024-01-15T00:00:00.000Z',
    },
    ...users,
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="mt-1 text-indigo-200">
            Create, view, and manage user accounts.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Create User Form */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Create New User</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="displayName"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter display name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create User
            </button>
          </form>
        </div>

        {/* Confirmation Dialog */}
        {confirmDeleteId && (
          <div className="mt-6 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
            <p className="text-sm text-yellow-800">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={handleConfirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="mt-8 rounded-lg bg-white shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              All Users ({allUsers.length})
            </h2>
          </div>

          {allUsers.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Joined
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      currentUserId={session.userId}
                      onDelete={handleDeleteRequest}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}