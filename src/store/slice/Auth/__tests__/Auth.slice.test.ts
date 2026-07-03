import { appStore } from '../../../store';
import { act } from '@testing-library/react';

describe('Auth slice', () => {
  it('should have initial state values', () => {
    const state = appStore.getState().Auth;
    expect(state.token).toBe('');
    expect(state.name).toBe('');
    expect(state.email).toBe('');
    expect(state.picture).toBe('');
    expect(state.expiresAt).toBeUndefined();
  });

  it('should set auth data successfully', () => {
    act(() => {
      appStore.getState().Auth.setAuthData({
        token: 'mock-token',
        name: 'John Doe',
        email: 'john@example.com',
        picture: 'profile.jpg',
      });
    });

    const state = appStore.getState().Auth;
    expect(state.token).toBe('mock-token');
    expect(state.name).toBe('John Doe');
    expect(state.email).toBe('john@example.com');
    expect(state.picture).toBe('profile.jpg');
  });

  it('should remove auth token and reset to initial values', () => {
    act(() => {
      appStore.getState().Auth.setAuthData({
        token: 'mock-token',
        name: 'John Doe',
        email: 'john@example.com',
        picture: 'profile.jpg',
      });
    });

    act(() => {
      appStore.getState().Auth.removeAuthToken();
    });

    const state = appStore.getState().Auth;
    expect(state.token).toBe('');
    expect(state.name).toBe('');
    expect(state.email).toBe('');
    expect(state.picture).toBe('');
  });
});
