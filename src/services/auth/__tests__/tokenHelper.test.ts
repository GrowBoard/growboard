import { getValidAccessToken, registerSilentRefresh, triggerSilentRefresh } from '../tokenHelper';

import { appStore } from '@store';

/** Reset module state between tests by re-importing the module. */
jest.mock('@store', () => ({
  appStore: {
    getState: jest.fn(),
  },
}));

/** Helper to configure the mocked store state. */
const mockAuthState = (token: string, expiresAt?: number) => {
  (appStore.getState as jest.Mock).mockReturnValue({
    Auth: { token, expiresAt },
  });
};

describe('tokenHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── getValidAccessToken ────────────────────────────────────────────────────

  describe('getValidAccessToken', () => {
    it('throws when no token is in the store', () => {
      mockAuthState('');
      expect(() => getValidAccessToken()).toThrow(
        'No Google Access Token available',
      );
    });

    it('throws when the token has expired', () => {
      mockAuthState('valid-token', Date.now() - 1000);
      expect(() => getValidAccessToken()).toThrow(
        'Google Access Token expired',
      );
    });

    it('returns the token when it is valid and not expired', () => {
      mockAuthState('valid-token', Date.now() + 60_000);
      expect(getValidAccessToken()).toBe('valid-token');
    });

    it('returns the token when expiresAt is undefined (no expiry check)', () => {
      mockAuthState('valid-token', undefined);
      expect(getValidAccessToken()).toBe('valid-token');
    });
  });

  // ── registerSilentRefresh / triggerSilentRefresh ───────────────────────────

  describe('registerSilentRefresh', () => {
    it('registers a refresh function that triggerSilentRefresh calls', async () => {
      const refreshFn = jest.fn().mockResolvedValue(undefined);
      registerSilentRefresh(refreshFn);
      await triggerSilentRefresh();
      expect(refreshFn).toHaveBeenCalledTimes(1);
    });

    it('allows replacing the registered handler', async () => {
      const first = jest.fn().mockResolvedValue(undefined);
      const second = jest.fn().mockResolvedValue(undefined);
      registerSilentRefresh(first);
      registerSilentRefresh(second);
      await triggerSilentRefresh();
      expect(first).not.toHaveBeenCalled();
      expect(second).toHaveBeenCalledTimes(1);
    });
  });

  describe('triggerSilentRefresh', () => {
    it('propagates errors thrown by the refresh handler', async () => {
      const refreshFn = jest.fn().mockRejectedValue(new Error('Refresh failed'));
      registerSilentRefresh(refreshFn);
      await expect(triggerSilentRefresh()).rejects.toThrow('Refresh failed');
    });
  });
});
