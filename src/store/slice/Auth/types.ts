export type UserData = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type AuthDataState = {
  authToken: string;
  userData: UserData;
};

export interface AuthStateAction {
  setLoginData: (authData: AuthDataState) => void;
  removeLoginData: () => void;
}

export type AuthStateSlice = AuthDataState & AuthStateAction;
