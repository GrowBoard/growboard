import { AppStoreState } from 'src/store/store';

export const profileSelector = (state: AppStoreState) => ({
  profileData: state.Profile.data,
  removeProfile: state.Profile.removeProfile,
  updateProfile: state.Profile.updateProfile,
});
