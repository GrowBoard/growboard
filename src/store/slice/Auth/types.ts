export type UserAuthData = {
  userId: string;
};

export type AuthDataState = {
  authToken: string;
};

export interface AuthStateAction {
  setAuthToken: (authToken: string) => void;
  removeAuthToken: () => void;
}

export type AuthStateSlice = AuthDataState & AuthStateAction;
