import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

vi.mock('../utils/auth', () => ({
  getSession: vi.fn(),
}));

import { getSession } from '../utils/auth';

function renderWithRouter(ui, { initialEntries = ['/protected'] } = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/login" element={<p>Login Page</p>} />
        <Route path="/blogs" element={<p>Blogs Page</p>} />
        <Route
          path="/protected"
          element={ui}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('when no session exists', () => {
    it('redirects to /login when user is not authenticated', () => {
      getSession.mockReturnValue(null);

      renderWithRouter(
        <ProtectedRoute>
          <p>Protected Content</p>
        </ProtectedRoute>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('when session exists with user role', () => {
    it('renders children when no role restriction is specified', () => {
      getSession.mockReturnValue({
        userId: 'user-1',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      });

      renderWithRouter(
        <ProtectedRoute>
          <p>Protected Content</p>
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('redirects to /blogs when non-admin user accesses admin route', () => {
      getSession.mockReturnValue({
        userId: 'user-1',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      });

      renderWithRouter(
        <ProtectedRoute role="admin">
          <p>Admin Content</p>
        </ProtectedRoute>
      );

      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });
  });

  describe('when session exists with admin role', () => {
    it('renders children when admin accesses admin route', () => {
      getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderWithRouter(
        <ProtectedRoute role="admin">
          <p>Admin Content</p>
        </ProtectedRoute>
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });

    it('renders children when admin accesses a non-role-restricted route', () => {
      getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderWithRouter(
        <ProtectedRoute>
          <p>General Content</p>
        </ProtectedRoute>
      );

      expect(screen.getByText('General Content')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('redirects to /login when getSession returns null (e.g., corrupted storage)', () => {
      getSession.mockReturnValue(null);

      renderWithRouter(
        <ProtectedRoute role="admin">
          <p>Admin Content</p>
        </ProtectedRoute>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });

    it('renders children when role prop is undefined and user is authenticated', () => {
      getSession.mockReturnValue({
        userId: 'user-2',
        username: 'johnsmith',
        displayName: 'John Smith',
        role: 'user',
      });

      renderWithRouter(
        <ProtectedRoute role={undefined}>
          <p>Accessible Content</p>
        </ProtectedRoute>
      );

      expect(screen.getByText('Accessible Content')).toBeInTheDocument();
    });
  });
});