import { AppStoreSlice } from '@store';
import { AuthDataState, AuthStateSlice } from './types';

export const initialState: AuthDataState = {
  token: '',
  name: '',
  email: '',
  picture: '',
};

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
