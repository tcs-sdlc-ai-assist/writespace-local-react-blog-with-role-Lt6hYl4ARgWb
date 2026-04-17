import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BlogCard } from './BlogCard';

vi.mock('../utils/auth', () => ({
  getSession: vi.fn(),
}));

import { getSession } from '../utils/auth';

const basePost = {
  id: 'post-abc123',
  title: 'Test Blog Post Title',
  content: 'This is the content of the test blog post that should be displayed as an excerpt on the card.',
  createdAt: '2024-06-15T10:30:00.000Z',
  authorId: 'user-1',
  authorName: 'Jane Doe',
  authorRole: 'user',
};

function renderBlogCard(post = basePost, index = 0) {
  return render(
    <MemoryRouter>
      <BlogCard post={post} index={index} />
    </MemoryRouter>
  );
}

describe('BlogCard', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    getSession.mockReturnValue(null);
  });

  describe('rendering post content', () => {
    it('renders the post title', () => {
      renderBlogCard();
      expect(screen.getByText('Test Blog Post Title')).toBeInTheDocument();
    });

    it('renders the post content as an excerpt', () => {
      renderBlogCard();
      expect(
        screen.getByText(
          'This is the content of the test blog post that should be displayed as an excerpt on the card.'
        )
      ).toBeInTheDocument();
    });

    it('truncates long content with ellipsis', () => {
      const longContent = 'A'.repeat(200);
      const post = { ...basePost, content: longContent };
      renderBlogCard(post);
      const truncated = longContent.slice(0, 120) + '…';
      expect(screen.getByText(truncated)).toBeInTheDocument();
    });

    it('renders the author name', () => {
      renderBlogCard();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    it('renders the formatted date', () => {
      renderBlogCard();
      expect(screen.getByText('Jun 15, 2024')).toBeInTheDocument();
    });

    it('renders a link to the blog post', () => {
      renderBlogCard();
      const link = screen.getByRole('link', { name: /Test Blog Post Title/i });
      expect(link).toHaveAttribute('href', '/blog/post-abc123');
    });
  });

  describe('avatar rendering', () => {
    it('renders user avatar for regular user posts', () => {
      renderBlogCard();
      expect(screen.getByText('📖')).toBeInTheDocument();
    });

    it('renders admin avatar for admin author posts', () => {
      const adminPost = { ...basePost, authorRole: 'admin' };
      renderBlogCard(adminPost);
      expect(screen.getByText('👑')).toBeInTheDocument();
    });
  });

  describe('edit icon visibility', () => {
    it('does not show edit icon when user is not logged in', () => {
      getSession.mockReturnValue(null);
      renderBlogCard();
      expect(screen.queryByTitle('Edit post')).not.toBeInTheDocument();
    });

    it('does not show edit icon when logged-in user is not the owner and not admin', () => {
      getSession.mockReturnValue({
        userId: 'user-other',
        username: 'otheruser',
        displayName: 'Other User',
        role: 'user',
      });
      renderBlogCard();
      expect(screen.queryByTitle('Edit post')).not.toBeInTheDocument();
    });

    it('shows edit icon when logged-in user is the post owner', () => {
      getSession.mockReturnValue({
        userId: 'user-1',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      });
      renderBlogCard();
      expect(screen.getByTitle('Edit post')).toBeInTheDocument();
    });

    it('shows edit icon when logged-in user is an admin', () => {
      getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });
      renderBlogCard();
      expect(screen.getByTitle('Edit post')).toBeInTheDocument();
    });

    it('edit icon links to the correct edit page', () => {
      getSession.mockReturnValue({
        userId: 'user-1',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      });
      renderBlogCard();
      const editLink = screen.getByTitle('Edit post');
      expect(editLink).toHaveAttribute('href', '/edit/post-abc123');
    });
  });

  describe('border color cycling', () => {
    it('applies different border colors based on index', () => {
      const { container: container0 } = render(
        <MemoryRouter>
          <BlogCard post={basePost} index={0} />
        </MemoryRouter>
      );
      const card0 = container0.firstChild;
      expect(card0.className).toContain('border-t-rose-500');

      const { container: container1 } = render(
        <MemoryRouter>
          <BlogCard post={basePost} index={1} />
        </MemoryRouter>
      );
      const card1 = container1.firstChild;
      expect(card1.className).toContain('border-t-sky-500');
    });

    it('cycles border colors when index exceeds array length', () => {
      const { container } = render(
        <MemoryRouter>
          <BlogCard post={basePost} index={8} />
        </MemoryRouter>
      );
      const card = container.firstChild;
      expect(card.className).toContain('border-t-rose-500');
    });
  });

  describe('edge cases', () => {
    it('renders empty string for empty content', () => {
      const post = { ...basePost, content: '' };
      renderBlogCard(post);
      expect(screen.getByText('Test Blog Post Title')).toBeInTheDocument();
    });

    it('handles missing authorRole gracefully by defaulting to user avatar', () => {
      const post = {
        id: 'post-no-role',
        title: 'No Role Post',
        content: 'Some content here',
        createdAt: '2024-03-01T00:00:00.000Z',
        authorId: 'user-2',
        authorName: 'Bob',
      };
      renderBlogCard(post);
      expect(screen.getByText('📖')).toBeInTheDocument();
    });

    it('handles invalid date gracefully', () => {
      const post = { ...basePost, createdAt: 'not-a-date' };
      renderBlogCard(post);
      // Should not crash; title should still render
      expect(screen.getByText('Test Blog Post Title')).toBeInTheDocument();
    });
  });
});