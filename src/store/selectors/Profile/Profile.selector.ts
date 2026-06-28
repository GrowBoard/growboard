import { AppStoreState } from 'src/store/store';

/**
 * profileSelector.
 * Selects the user profile configuration details and actions from the store.
 *
 * @param state The AppStoreState.
 * @returns Object holding profileData, removeProfile action, and updateProfile action.
 */
export const profileSelector = (state: AppStoreState) => ({
  /**
   * The user profile details object.
   */
  profileData: state.Profile.userData,
  /**
   * Action trigger to purge/clear current profile data.
   */
  removeProfile: state.Profile.removeProfile,
  /**
   * Action trigger to modify/update current profile data.
   */
  updateProfile: state.Profile.updateProfile,
});
export default profileSelector;
