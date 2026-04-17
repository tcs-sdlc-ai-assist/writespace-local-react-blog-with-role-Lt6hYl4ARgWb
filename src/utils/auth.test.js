import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getSession, setSession, clearSession } from './auth';

const SESSION_KEY = 'writespace_session';

const validSession = {
  userId: 'usr_abc123',
  username: 'janedoe',
  displayName: 'Jane Doe',
  role: 'admin',
};

describe('auth utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getSession', () => {
    it('returns null when no session exists in localStorage', () => {
      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns the session object when a valid session is stored', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify(validSession));
      const result = getSession();
      expect(result).toEqual(validSession);
    });

    it('returns null when localStorage contains invalid JSON', () => {
      localStorage.setItem(SESSION_KEY, '{not valid json!!!');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = getSession();
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('returns null when session object is missing required fields', () => {
      const incomplete = { userId: 'usr_abc123', username: 'janedoe' };
      localStorage.setItem(SESSION_KEY, JSON.stringify(incomplete));
      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when session has fields of wrong types', () => {
      const wrongTypes = {
        userId: 123,
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'admin',
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(wrongTypes));
      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when localStorage contains a non-object value', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify('just a string'));
      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when localStorage contains null', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify(null));
      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null and logs error when localStorage.getItem throws', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage access denied');
      });
      const result = getSession();
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to read session from localStorage:',
        expect.any(Error)
      );
    });
  });

  describe('setSession', () => {
    it('saves a valid session to localStorage under the correct key', () => {
      setSession(validSession);
      const stored = JSON.parse(localStorage.getItem(SESSION_KEY));
      expect(stored).toEqual(validSession);
    });

    it('only stores userId, username, displayName, and role fields', () => {
      const sessionWithExtra = {
        ...validSession,
        extraField: 'should not be stored',
        token: 'secret',
      };
      setSession(sessionWithExtra);
      const stored = JSON.parse(localStorage.getItem(SESSION_KEY));
      expect(stored).toEqual(validSession);
      expect(stored.extraField).toBeUndefined();
      expect(stored.token).toBeUndefined();
    });

    it('does not save when session is null', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      setSession(null);
      expect(localStorage.getItem(SESSION_KEY)).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('does not save when session is missing required fields', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      setSession({ userId: 'usr_abc123' });
      expect(localStorage.getItem(SESSION_KEY)).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('does not save when session has wrong field types', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      setSession({
        userId: 123,
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'admin',
      });
      expect(localStorage.getItem(SESSION_KEY)).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('logs error when localStorage.setItem throws', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      setSession(validSession);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to write session to localStorage:',
        expect.any(Error)
      );
    });
  });

  describe('clearSession', () => {
    it('removes the session from localStorage', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify(validSession));
      clearSession();
      expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    });

    it('does not throw when no session exists', () => {
      expect(() => clearSession()).not.toThrow();
    });

    it('logs error when localStorage.removeItem throws', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage access denied');
      });
      clearSession();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to clear session from localStorage:',
        expect.any(Error)
      );
    });
  });

  describe('key usage', () => {
    it('uses the writespace_session key in localStorage', () => {
      setSession(validSession);
      expect(localStorage.getItem(SESSION_KEY)).not.toBeNull();
      expect(localStorage.getItem('writespace_session')).not.toBeNull();
    });
  });
});