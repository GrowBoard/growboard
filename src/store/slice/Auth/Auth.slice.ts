import { AppStoreSlice } from '@store';
import { AuthDataState, AuthStateSlice } from './types';

export const initialState: AuthDataState = {
  token: '',
  name: '',
  email: '',
};

const createAuthSlice: AppStoreSlice<AuthStateSlice> = (set) => ({
  ...initialState,
  setAuthData: ({ token, name, email }) =>
    set((appState) => {
      appState.Auth.email = email;
      appState.Auth.token = token;
      appState.Auth.name = name;
    }),
  removeAuthToken: () =>
    set((appState) => {
      appState.Auth.token = initialState.token;
      appState.Auth.name = initialState.name;
      appState.Auth.email = initialState.email;
    }),
});

export default createAuthSlice;
