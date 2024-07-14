import { AppStoreSlice } from '@store';
import { AuthDataState, AuthStateSlice } from './types';
import { getAuthKeyData } from '@service/local_storage/auth/AuthStorageApi';

export const initialState: AuthDataState = {
  authToken: '',
  userData: {
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
  },
};

const getAuthData = (): AuthDataState => {
  const authData = getAuthKeyData();
  if (authData) {
    return authData;
  }

  return initialState;
};

const createAuthSlice: AppStoreSlice<AuthStateSlice> = (set) => ({
  ...getAuthData(),
  setLoginData(authData) {
    set((state) => {
      state.Auth.userData = authData.userData;
      state.Auth.authToken = authData.authToken;
    });
  },
  removeLoginData() {
    set((state) => {
      state.Auth.authToken = initialState.authToken;
      state.Auth.userData = initialState.userData;
    });
  },
});

export default createAuthSlice;
