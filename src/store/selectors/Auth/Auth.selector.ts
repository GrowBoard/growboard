import { AppStoreState } from '@store';

/**
 * isUserLoggedInSelector.
 * Checks whether the current user is logged in by validating token presence.
 *
 * @param state The AppStoreState.
 * @returns Boolean flag denoting log-in status.
 */
export const isUserLoggedInSelector = (state: AppStoreState) =>
  state.Auth.token !== '' && state.Auth.token !== null;

/**
 * setAuthSelector.
 * Retrieves the function to set user authentication data.
 *
 * @param state The AppStoreState.
 * @returns Method trigger to register auth session details.
 */
export const setAuthSelector = (state: AppStoreState) => state.Auth.setAuthData;

/**
 * removeAuthDataSelector.
 * Retrieves the function to delete/clear authentication data on log out.
 *
 * @param state The AppStoreState.
 * @returns Method trigger to remove the auth session.
 */
export const removeAuthDataSelector = (state: AppStoreState) =>
  state.Auth.removeAuthToken;

/**
 * authNameSelector.
 * Retrieves the user's name from active authentication data.
 *
 * @param state The AppStoreState.
 * @returns The user's name string.
 */
export const authNameSelector = (state: AppStoreState) => state.Auth.name;

/**
 * authPictureSelector.
 * Retrieves the user's profile picture URL from active authentication data.
 *
 * @param state The AppStoreState.
 * @returns The profile picture URL or null.
 */
export const authPictureSelector = (state: AppStoreState) => state.Auth.picture;

/**
 * authEmailSelector.
 * Retrieves the user's email address from active authentication data.
 *
 * @param state The AppStoreState.
 * @returns The user's email string.
 */
export const authEmailSelector = (state: AppStoreState) => state.Auth.email;
