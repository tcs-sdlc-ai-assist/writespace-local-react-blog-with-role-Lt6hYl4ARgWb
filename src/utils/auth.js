const SESSION_KEY = 'writespace_session';

/**
 * Retrieves the current session from localStorage.
 * @returns {{ userId: string, username: string, displayName: string, role: string } | null} The session object or null if not found/invalid.
 */
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }
    const session = JSON.parse(raw);
    if (
      session &&
      typeof session.userId === 'string' &&
      typeof session.username === 'string' &&
      typeof session.displayName === 'string' &&
      typeof session.role === 'string'
    ) {
      return session;
    }
    return null;
  } catch (e) {
    console.error('Failed to read session from localStorage:', e);
    return null;
  }
}

/**
 * Saves a session object to localStorage.
 * @param {{ userId: string, username: string, displayName: string, role: string }} session - The session to persist.
 */
export function setSession(session) {
  try {
    if (
      !session ||
      typeof session.userId !== 'string' ||
      typeof session.username !== 'string' ||
      typeof session.displayName !== 'string' ||
      typeof session.role !== 'string'
    ) {
      console.error('Invalid session object:', session);
      return;
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      userId: session.userId,
      username: session.username,
      displayName: session.displayName,
      role: session.role,
    }));
  } catch (e) {
    console.error('Failed to write session to localStorage:', e);
  }
}

/**
 * Clears the current session from localStorage.
 */
export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error('Failed to clear session from localStorage:', e);
  }
}