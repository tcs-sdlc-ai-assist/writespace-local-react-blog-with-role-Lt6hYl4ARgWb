import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { clearSession } from '../utils/auth.js';
import { getAvatar } from './Avatar.jsx';

export function Navbar({ session }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const isAdmin = session && session.role === 'admin';

  const navLinks = isAdmin
    ? [
        { to: '/admin', label: 'Dashboard' },
        { to: '/admin/users', label: 'Users' },
        { to: '/blogs', label: 'Blogs' },
        { to: '/write', label: 'Write' },
      ]
    : [
        { to: '/blogs', label: 'Blogs' },
        { to: '/write', label: 'Write' },
      ];

  return (
    <nav className="bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to={isAdmin ? '/admin' : '/blogs'} className="flex items-center gap-2">
            <span className="text-xl font-bold text-indigo-600">WriteSpace</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-gray-700 transition hover:text-indigo-600"
              >
                {link.label}
              </Link>
            ))}

            {/* Avatar chip with dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 transition hover:bg-gray-50"
              >
                {getAvatar(session.role)}
                <span className="text-sm font-medium text-gray-700">
                  {session.displayName}
                </span>
                <svg
                  className={`h-4 w-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 z-10 mt-2 w-44 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="border-b border-gray-100 px-4 py-2">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="truncate text-sm font-medium text-gray-800">
                      {session.username}
                    </p>
                    <p className="text-xs capitalize text-gray-400">{session.role}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <span>🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 transition hover:bg-gray-100 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition hover:bg-gray-100 hover:text-indigo-600"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-200 px-4 pb-3 pt-3">
            <div className="flex items-center gap-3">
              {getAvatar(session.role)}
              <div>
                <p className="text-sm font-medium text-gray-800">{session.displayName}</p>
                <p className="text-xs capitalize text-gray-500">{session.role}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

Navbar.propTypes = {
  session: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
};

export default Navbar;