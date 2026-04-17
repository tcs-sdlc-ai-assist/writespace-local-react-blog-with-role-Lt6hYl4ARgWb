import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getPosts, savePosts, getUsers, saveUsers } from './storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getPosts', () => {
    it('returns an empty array when no posts exist in localStorage', () => {
      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns parsed posts array when valid data exists', () => {
      const posts = [
        {
          id: 'post_1',
          title: 'Test Post',
          content: 'Hello world',
          createdAt: '2024-01-15T10:00:00.000Z',
          authorId: 'usr_1',
          authorName: 'Jane Doe',
        },
        {
          id: 'post_2',
          title: 'Another Post',
          content: 'More content',
          createdAt: '2024-01-16T12:00:00.000Z',
          authorId: 'usr_2',
          authorName: 'John Smith',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(posts));

      const result = getPosts();
      expect(result).toEqual(posts);
      expect(result).toHaveLength(2);
    });

    it('returns an empty array when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_posts', '{not valid json!!!');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = getPosts();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to read posts from localStorage:',
        expect.any(Error)
      );
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_posts', JSON.stringify({ not: 'an array' }));

      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage contains a string value', () => {
      localStorage.setItem('writespace_posts', JSON.stringify('just a string'));

      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage.getItem throws', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage access denied');
      });

      const result = getPosts();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to read posts from localStorage:',
        expect.any(Error)
      );
    });
  });

  describe('savePosts', () => {
    it('saves posts array to localStorage', () => {
      const posts = [
        {
          id: 'post_1',
          title: 'Test Post',
          content: 'Hello world',
          createdAt: '2024-01-15T10:00:00.000Z',
          authorId: 'usr_1',
          authorName: 'Jane Doe',
        },
      ];

      savePosts(posts);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual(posts);
    });

    it('saves an empty array to localStorage', () => {
      savePosts([]);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual([]);
    });

    it('handles localStorage.setItem throwing gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => savePosts([{ id: 'post_1' }])).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save posts to localStorage:',
        expect.any(Error)
      );
    });

    it('overwrites existing posts in localStorage', () => {
      const initialPosts = [{ id: 'post_1', title: 'Old' }];
      const newPosts = [{ id: 'post_2', title: 'New' }];

      savePosts(initialPosts);
      savePosts(newPosts);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual(newPosts);
    });
  });

  describe('getUsers', () => {
    it('returns an empty array when no users exist in localStorage', () => {
      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns parsed users array when valid data exists', () => {
      const users = [
        {
          id: 'usr_1',
          displayName: 'Jane Doe',
          username: 'janedoe',
          password: 'hashed123',
          role: 'admin',
          createdAt: '2024-01-15T10:00:00.000Z',
        },
        {
          id: 'usr_2',
          displayName: 'John Smith',
          username: 'johnsmith',
          password: 'hashed456',
          role: 'user',
          createdAt: '2024-01-16T12:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(users));

      const result = getUsers();
      expect(result).toEqual(users);
      expect(result).toHaveLength(2);
    });

    it('returns an empty array when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_users', '%%%corrupted%%%');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = getUsers();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to read users from localStorage:',
        expect.any(Error)
      );
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_users', JSON.stringify(42));

      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage.getItem throws', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage access denied');
      });

      const result = getUsers();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to read users from localStorage:',
        expect.any(Error)
      );
    });
  });

  describe('saveUsers', () => {
    it('saves users array to localStorage', () => {
      const users = [
        {
          id: 'usr_1',
          displayName: 'Jane Doe',
          username: 'janedoe',
          password: 'hashed123',
          role: 'admin',
          createdAt: '2024-01-15T10:00:00.000Z',
        },
      ];

      saveUsers(users);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual(users);
    });

    it('saves an empty array to localStorage', () => {
      saveUsers([]);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual([]);
    });

    it('handles localStorage.setItem throwing gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => saveUsers([{ id: 'usr_1' }])).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save users to localStorage:',
        expect.any(Error)
      );
    });

    it('overwrites existing users in localStorage', () => {
      const initialUsers = [{ id: 'usr_1', displayName: 'Old' }];
      const newUsers = [{ id: 'usr_2', displayName: 'New' }];

      saveUsers(initialUsers);
      saveUsers(newUsers);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual(newUsers);
    });
  });
});