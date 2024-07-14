import {
  SocialType,
  UserProfileData,
} from '@service/supabase/supastore/user_profile/UserCollection';
import { AppStoreSlice } from 'src/store/store';
import { ProfileStateSlice, UserProfileState } from './types';
import {
  getProfileKeyData,
  storeProfileKeyData,
} from '@service/local_storage/profile/ProfileStorageApi';
import { userProfileDataRead } from '@service/supabase/supastore/user_profile/UserProfileStoreApi';
import { getAuthKeyData } from '@service/local_storage/auth/AuthStorageApi';
import { UserData } from '../Auth';

const userProfileData: UserProfileData = {
  userId: '',
  firstName: '',
  lastName: '',
  email: '',
  profile: '',
  place: '',
  dateOfBirth: '',
  designation: '',
  yearOfExp: 0,
  socialLinks: [
    {
      type: SocialType.Facebook,
      link: '',
    },
    {
      type: SocialType.Instagram,
      link: '',
    },
    {
      type: SocialType.Github,
      link: '',
    },
    {
      type: SocialType.X,
      link: '',
    },
    {
      type: SocialType.Linkedin,
      link: '',
    },
    {
      type: SocialType.Youtube,
      link: '',
    },
    {
      type: SocialType.Website,
      link: '',
    },
  ],
};

const initialState: UserProfileState = {
  data: userProfileData,
};

const createProfileSlice: AppStoreSlice<ProfileStateSlice> = (set) => ({
  ...initialState,
  updateProfile: (profile: UserProfileData) =>
    set((state) => {
      storeProfileKeyData(profile);
      state.Profile.data = profile;
    }),
  removeProfile: () => {
    set((state) => {
      storeProfileKeyData(initialState.data);
      state.Profile.data = initialState.data;
    });
  },
});

function getUserAuthData(): UserData {
  const authData = getAuthKeyData();

  if (authData) {
    return authData.userData;
  }

  return {
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
  };
}

/**
 * Check if local storage has profile data, if not then fetch from the server database.
 * If the profile data is not available in the server database then add the initial profile data.
 * Then once the profile data is available in the server database, store it in the local storage.
 * Finally return the profile data from the local storage.
 *
 * @returns The profile data from the local storage.
 */
function syncForTheFirstTime(
  setProfileCallback: (data: UserProfileData) => void,
): UserProfileData | void {
  const profileData = getProfileKeyData();
  if (
    profileData != null &&
    profileData?.userId !== '' &&
    profileData?.userId !== undefined
  ) {
    return profileData as UserProfileData;
  }

  userProfileDataRead(getUserAuthData(), setProfileCallback);
}

export default createProfileSlice;
export { syncForTheFirstTime, getUserAuthData };
