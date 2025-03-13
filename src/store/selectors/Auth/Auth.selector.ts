import { AppStoreState } from '@store';

export const authTokenSelector = (state: AppStoreState) => state.Auth.authToken;

export const setAuthTokenSelector = (state: AppStoreState) =>
  state.Auth.setAuthToken;

export const removeAuthDataSelector = (state: AppStoreState) =>
  state.Auth.removeAuthToken;
