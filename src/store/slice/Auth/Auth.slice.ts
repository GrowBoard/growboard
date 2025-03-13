import { AppStoreSlice } from '@store';
import { AuthDataState, AuthStateSlice } from './types';

export const initialState: AuthDataState = {
  authToken: '',
};

const createAuthSlice: AppStoreSlice<AuthStateSlice> = (set) => ({
  ...initialState,
  setAuthToken: (authToken: string) =>
    set((appState) => {
      appState.Auth.authToken = authToken;
    }),
  removeAuthToken: () =>
    set((appState) => {
      appState.Auth.authToken = initialState.authToken;
    }),
});

export default createAuthSlice;
