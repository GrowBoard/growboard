import { AppStoreSlice } from '@store';
import { AuthDataState, AuthStateSlice } from './types';

/**
 * The initial state configuration for the authentication slice.
 */
export const initialState: AuthDataState = {
  token: '',
  name: '',
  email: '',
  picture: '',
  expiresAt: undefined,
};

/**
 * createAuthSlice.
 * Initializes the state slice and action reducers for managing authentication metadata.
 *
 * @param set Central store setter callback.
 * @returns The authentication state and actions slice.
 */
const createAuthSlice: AppStoreSlice<AuthStateSlice> = (set) => ({
  ...initialState,
  setAuthData: ({ token, name, email, picture }) =>
    set((appState) => {
      appState.Auth.email = email;
      appState.Auth.token = token;
      appState.Auth.name = name;
      appState.Auth.picture = picture || '';
    }),
  removeAuthToken: () =>
    set((appState) => {
      appState.Auth.token = initialState.token;
      appState.Auth.name = initialState.name;
      appState.Auth.email = initialState.email;
      appState.Auth.picture = initialState.picture;
    }),
});

export default createAuthSlice;
