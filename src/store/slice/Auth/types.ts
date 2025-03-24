export type AuthDataState = {
  token: string;
  name: string;
  email: string;
};

export interface AuthStateAction {
  setAuthData: (data: AuthDataState) => void;
  removeAuthToken: () => void;
}

export type AuthStateSlice = AuthDataState & AuthStateAction;
