import { appStore } from '@store';

/**
 * Module-level holder for the silent token refresh callback.
 * Registered at app startup by a React component via {@link registerSilentRefresh}.
 */
let silentRefreshFn: (() => Promise<void>) | null = null;

/**
 * Registers a callback that performs a silent Google OAuth token refresh.
 * Should be called once at app startup from a React component that has
 * access to the `useGoogleLogin` hook.
 * @param fn - Async function that silently fetches and stores a new token.
 */
export const registerSilentRefresh = (fn: () => Promise<void>): void => {
  silentRefreshFn = fn;
};

/**
 * Attempts a silent token refresh.
 * Resolves when a new token has been stored, or rejects if refresh fails.
 * @throws If no refresh handler is registered or the silent refresh fails.
 */
export const triggerSilentRefresh = async (): Promise<void> => {
  if (!silentRefreshFn) {
    throw new Error('No silent refresh handler registered.');
  }
  await silentRefreshFn();
};

/**
 * Retrieves a valid Google access token from the Redux store.
 * Throws an error if no token is present or if the token has expired
 * (callers should catch and trigger a silent refresh before re-trying).
 */
export const getValidAccessToken = (): string => {
  const state = appStore.getState();
  const { token, expiresAt } = state.Auth;
  if (!token) {
    throw new Error('No Google Access Token available. Please log in.');
  }
  if (expiresAt && Date.now() > expiresAt) {
    throw new Error('Google Access Token expired.');
  }
  return token;
};
