import { AppStoreState } from 'src/store/store';

export const profileSelector = (state: AppStoreState) => ({
  profileData: state.Profile.userData,
  removeProfile: state.Profile.removeProfile,
  updateProfile: state.Profile.updateProfile,
});
