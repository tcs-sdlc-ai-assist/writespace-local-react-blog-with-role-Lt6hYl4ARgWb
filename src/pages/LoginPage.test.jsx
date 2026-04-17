import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import * as auth from '../utils/auth';
import * as storage from '../utils/storage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderLoginPage() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <LoginPage />
    </MemoryRouter>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    mockNavigate.mockReset();
    vi.spyOn(auth, 'getSession').mockReturnValue(null);
  });

  describe('rendering', () => {
    it('renders the login form with username and password fields', () => {
      renderLoginPage();

      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders a link to the registration page', () => {
      renderLoginPage();

      const registerLink = screen.getByRole('link', { name: /create one/i });
      expect(registerLink).toBeInTheDocument();
      expect(registerLink).toHaveAttribute('href', '/register');
    });
  });

  describe('successful admin login', () => {
    it('navigates to /admin when admin credentials are provided', async () => {
      const setSessionSpy = vi.spyOn(auth, 'setSession');
      const user = userEvent.setup();

      renderLoginPage();

      await user.type(screen.getByLabelText(/username/i), 'admin');
      await user.type(screen.getByLabelText(/password/i), 'admin123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(setSessionSpy).toHaveBeenCalledWith({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });
  });

  describe('successful user login', () => {
    it('navigates to /blogs when valid user credentials are provided', async () => {
      const testUser = {
        id: 'user-abc123',
        displayName: 'Jane Doe',
        username: 'janedoe',
        password: 'password123',
        role: 'user',
        createdAt: '2024-01-15T10:00:00.000Z',
      };

      vi.spyOn(storage, 'getUsers').mockReturnValue([testUser]);
      const setSessionSpy = vi.spyOn(auth, 'setSession');
      const user = userEvent.setup();

      renderLoginPage();

      await user.type(screen.getByLabelText(/username/i), 'janedoe');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(setSessionSpy).toHaveBeenCalledWith({
        userId: 'user-abc123',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });

    it('navigates to /admin when a user with admin role logs in', async () => {
      const adminUser = {
        id: 'user-admin2',
        displayName: 'Second Admin',
        username: 'admin2',
        password: 'securepass',
        role: 'admin',
        createdAt: '2024-01-15T10:00:00.000Z',
      };

      vi.spyOn(storage, 'getUsers').mockReturnValue([adminUser]);
      const setSessionSpy = vi.spyOn(auth, 'setSession');
      const user = userEvent.setup();

      renderLoginPage();

      await user.type(screen.getByLabelText(/username/i), 'admin2');
      await user.type(screen.getByLabelText(/password/i), 'securepass');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(setSessionSpy).toHaveBeenCalledWith({
        userId: 'user-admin2',
        username: 'admin2',
        displayName: 'Second Admin',
        role: 'admin',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });
  });

  describe('failed login', () => {
    it('displays an error message when credentials are invalid', async () => {
      vi.spyOn(storage, 'getUsers').mockReturnValue([]);
      const user = userEvent.setup();

      renderLoginPage();

      await user.type(screen.getByLabelText(/username/i), 'wronguser');
      await user.type(screen.getByLabelText(/password/i), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalledWith('/blogs', expect.anything());
      expect(mockNavigate).not.toHaveBeenCalledWith('/admin', expect.anything());
    });

    it('displays an error message when fields are empty', async () => {
      const user = userEvent.setup();

      renderLoginPage();

      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(screen.getByText(/username and password are required/i)).toBeInTheDocument();
    });

    it('displays an error message when only username is provided', async () => {
      const user = userEvent.setup();

      renderLoginPage();

      await user.type(screen.getByLabelText(/username/i), 'someuser');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(screen.getByText(/username and password are required/i)).toBeInTheDocument();
    });

    it('displays an error message when password is wrong for existing user', async () => {
      const testUser = {
        id: 'user-abc123',
        displayName: 'Jane Doe',
        username: 'janedoe',
        password: 'correctpassword',
        role: 'user',
        createdAt: '2024-01-15T10:00:00.000Z',
      };

      vi.spyOn(storage, 'getUsers').mockReturnValue([testUser]);
      const user = userEvent.setup();

      renderLoginPage();

      await user.type(screen.getByLabelText(/username/i), 'janedoe');
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
    });
  });

  describe('redirect for already-authenticated users', () => {
    it('redirects admin users to /admin if already logged in', async () => {
      vi.spyOn(auth, 'getSession').mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderLoginPage();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
      });
    });

    it('redirects regular users to /blogs if already logged in', async () => {
      vi.spyOn(auth, 'getSession').mockReturnValue({
        userId: 'user-abc123',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      });

      renderLoginPage();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
      });
    });
  });
});