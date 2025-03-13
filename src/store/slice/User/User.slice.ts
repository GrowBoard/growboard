import { AppStoreSlice } from 'src/store/store';
import { ProfileStateSlice, UserProfileData, UserProfileState } from './types';

const userProfileData: UserProfileData = {
  firstName: '',
  lastName: '',
  bio: '',
  phoneNumber: '',
  profilePicture: '',
  linkedin: '',
  instagram: '',
  github: '',
  twitter: '',
  facebook: '',
  medium: '',
  website: '',
};

const initialState: UserProfileState = {
  userData: userProfileData,
};

const createProfileSlice: AppStoreSlice<ProfileStateSlice> = (set) => ({
  ...initialState,
  updateProfile: (profile: UserProfileData) =>
    set((state) => {
      state.Profile.userData = profile;
    }),
  removeProfile: () => {
    set((state) => {
      state.Profile.userData = initialState.userData;
    });
  },
});

export default createProfileSlice;
