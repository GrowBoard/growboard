import { AppStoreSlice } from 'src/store/store';
import { ProfileStateSlice, UserProfileData, UserProfileState } from './types';

/**
 * Default empty values for the user profile data.
 */
const userProfileData: UserProfileData = {
  bio: '',
  phone_number: [],
  socialLink: {
    facebook: '',
    instagram: '',
    github: '',
    x: '',
    website: '',
  },
  hobbies: [],
};

/**
 * The initial profile state representation.
 */
const initialState: UserProfileState = {
  userData: userProfileData,
};

/**
 * createProfileSlice.
 * Initializes the state and action reducers for the user profile data slice.
 *
 * @param set Central store setter callback.
 * @returns The initialized slice object.
 */
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
