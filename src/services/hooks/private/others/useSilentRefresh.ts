import { useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { appStore } from '@store';
import { setAuthSelector, useShallow } from '@selectors';
import { registerSilentRefresh } from '@services/auth';

/** Google OAuth scopes required for Growboard operations. */
const GOOGLE_SCOPES = [
  'openid',
  'profile',
  'email',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/drive.file',
].join(' ');

/**
 * Registers a silent Google OAuth token refresh handler at app startup.
 * When the access token expires, the service layer calls this handler to
 * silently re-issue a token without showing the consent screen.
 *
 * Must be mounted once inside a component that is always rendered while
 * the user is authenticated (e.g. the private router or app shell).
 */
const useSilentRefresh = (): void => {
  const setAuthData = appStore(useShallow(setAuthSelector));

  const silentLogin = useGoogleLogin({
    scope: GOOGLE_SCOPES,
    // Empty prompt string attempts a silent refresh — no popup shown
    prompt: '',
    flow: 'implicit',

    onSuccess: async (tokenResponse) => {
      const expiresAt = tokenResponse.expires_in
        ? Date.now() + tokenResponse.expires_in * 1000
        : undefined;

      // Preserve existing profile data, only update the token
      const currentState = appStore.getState().Auth;
      setAuthData({
        token: tokenResponse.access_token,
        name: currentState.name,
        email: currentState.email,
        picture: currentState.picture,
        expiresAt,
      });
    },

    onError: () => {
      // Silent refresh failed — the caller in fetchAPI will handle the error
    },
  });

  useEffect(() => {
    /**
     * Wraps the silent login in a Promise so that the service layer can
     * await it before retrying the failed request.
     */
    const silentRefreshFn = (): Promise<void> =>
      new Promise((resolve, reject) => {
        try {
          silentLogin();
          // Poll the token store until the token updates (max 5s)
          const previousToken = appStore.getState().Auth.token;
          const POLL_INTERVAL_MS = 200;
          const MAX_WAIT_MS = 5000;
          let elapsed = 0;

          const interval = setInterval(() => {
            elapsed += POLL_INTERVAL_MS;
            const newToken = appStore.getState().Auth.token;
            if (newToken && newToken !== previousToken) {
              clearInterval(interval);
              resolve();
            } else if (elapsed >= MAX_WAIT_MS) {
              clearInterval(interval);
              reject(new Error('Silent refresh timed out.'));
            }
          }, POLL_INTERVAL_MS);
        } catch (err) {
          reject(err);
        }
      });

    registerSilentRefresh(silentRefreshFn);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useSilentRefresh;
