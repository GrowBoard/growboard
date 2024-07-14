import { UserProfileData } from '@service/supabase/supastore/user_profile/UserCollection';

export type UserProfileState = {
  data: UserProfileData;
};

export interface ProfileStateActions {
  updateProfile: (profile: UserProfileData) => void;
  removeProfile: () => void;
}

export type ProfileStateSlice = UserProfileState & ProfileStateActions;
