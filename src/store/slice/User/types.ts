export type UserSocialData = {
  linkedin: string;
  instagram: string;
  github: string;
  twitter: string;
  facebook: string;
  medium: string;
  website: string;
};
export type UserProfileData = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePicture: string;
  bio: string;
} & UserSocialData;

export type UserProfileState = {
  userData: UserProfileData;
};

export interface ProfileStateActions {
  updateProfile: (profile: UserProfileData) => void;
  removeProfile: () => void;
}

export type ProfileStateSlice = UserProfileState & ProfileStateActions;
