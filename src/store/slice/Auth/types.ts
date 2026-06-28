/**
 * AuthDataState type definition.
 * Holds active authentication metadata details.
 */
export type AuthDataState = {
  /** Google authentication access token. */
  token: string;
  /** Display name of the user. */
  name: string;
  /** Email address of the user. */
  email: string;
  /** Profile picture URL. */
  picture?: string;
  /** Epoch timestamp (ms) when the token expires. */
  expiresAt?: number;
};

/**
 * AuthStateAction interface.
 * Defines action callback triggers to mutate authentication state.
 */
export interface AuthStateAction {
  /** Callback action to save authentication metadata. */
  setAuthData: (data: AuthDataState) => void;
  /** Callback action to clear/remove authentication token and details. */
  removeAuthToken: () => void;
}

/**
 * Combined authentication slice containing both state and actions.
 */
export type AuthStateSlice = AuthDataState & AuthStateAction;
