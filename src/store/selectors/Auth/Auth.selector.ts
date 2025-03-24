import { AppStoreState } from '@store';

export const isUserLoggedInSelector = (state: AppStoreState) =>
  state.Auth.token !== '' && state.Auth.token !== null;

export const setAuthSelector = (state: AppStoreState) => state.Auth.setAuthData;

export const removeAuthDataSelector = (state: AppStoreState) =>
  state.Auth.removeAuthToken;

export const authNameSelector = (state: AppStoreState) => state.Auth.name;
