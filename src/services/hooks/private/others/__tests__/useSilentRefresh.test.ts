import { renderHook } from '@testing-library/react';
import useSilentRefresh from '../useSilentRefresh';
import { useGoogleLogin } from '@react-oauth/google';
import { registerSilentRefresh } from '@services/auth';
import { appStore } from '@store';

jest.mock('@react-oauth/google', () => ({
  useGoogleLogin: jest.fn(),
}));

jest.mock('@services/auth', () => ({
  registerSilentRefresh: jest.fn(),
}));

jest.mock('@store', () => {
  const mockSetAuthData = jest.fn();
  const mockStore = jest.fn((selector) => {
    // Return mock selector output
    return mockSetAuthData;
  });
  (mockStore as any).getState = jest.fn(() => ({
    Auth: {
      token: 'old-token',
      name: 'John Doe',
      email: 'john@example.com',
      picture: 'pic-url',
    },
  }));
  return {
    appStore: mockStore,
  };
});

jest.mock('@selectors', () => ({
  setAuthSelector: 'setAuthSelector',
  useShallow: (val: any) => val,
}));

describe('useSilentRefresh hook', () => {
  let mockGoogleLoginTrigger: jest.Mock;
  let googleLoginConfig: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGoogleLoginTrigger = jest.fn();
    (useGoogleLogin as jest.Mock).mockImplementation((config) => {
      googleLoginConfig = config;
      return mockGoogleLoginTrigger;
    });
  });

  it('registers the silent refresh function on mount', () => {
    renderHook(() => useSilentRefresh());

    expect(useGoogleLogin).toHaveBeenCalledTimes(1);
    expect(registerSilentRefresh).toHaveBeenCalledWith(expect.any(Function));
  });

  it('successfully updates auth token when silent refresh succeeds', async () => {
    jest.useRealTimers();
    renderHook(() => useSilentRefresh());

    const registeredFn = (registerSilentRefresh as jest.Mock).mock.calls[0][0];

    // Simulate store update during interval polling
    let tokenUpdated = false;
    (appStore.getState as jest.Mock).mockImplementation(() => {
      if (tokenUpdated) {
        return {
          Auth: {
            token: 'new-token',
            name: 'John Doe',
            email: 'john@example.com',
            picture: 'pic-url',
          },
        };
      }
      return {
        Auth: {
          token: 'old-token',
          name: 'John Doe',
          email: 'john@example.com',
          picture: 'pic-url',
        },
      };
    });

    mockGoogleLoginTrigger.mockImplementation(() => {
      // Simulate OAuth success callback asynchronously to allow the hook
      // to capture the previous token value before the store updates.
      setTimeout(() => {
        googleLoginConfig.onSuccess({
          access_token: 'new-token',
          expires_in: 3600,
        });
        tokenUpdated = true;
      }, 50);
    });

    const refreshPromise = registeredFn();
    await expect(refreshPromise).resolves.toBeUndefined();

    // Verify setAuthData was called with new token and preserved profile details
    const setAuthData = appStore('setAuthSelector' as any);
    expect(setAuthData).toHaveBeenCalledWith(
      expect.objectContaining({
        token: 'new-token',
        name: 'John Doe',
        email: 'john@example.com',
        picture: 'pic-url',
        expiresAt: expect.any(Number),
      }),
    );
  });

  it('rejects when silent refresh fails or times out', async () => {
    // Speed up timers to test timeout behavior
    jest.useFakeTimers();
    renderHook(() => useSilentRefresh());

    const registeredFn = (registerSilentRefresh as jest.Mock).mock.calls[0][0];

    // Trigger OAuth failure/error
    mockGoogleLoginTrigger.mockImplementation(() => {
      googleLoginConfig.onError({
        error: 'immediate_error',
      });
    });

    const refreshPromise = registeredFn();
    jest.advanceTimersByTime(5000);

    await expect(refreshPromise).rejects.toThrow('Silent refresh timed out.');
    jest.useRealTimers();
  });
});
