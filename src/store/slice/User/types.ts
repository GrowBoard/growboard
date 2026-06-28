/**
 * UserProfileData type definition.
 * Holds fields representing all user profile configuration settings.
 */
export type UserProfileData = {
  /** The user bio text. */
  bio: string;
  /** List of user phone numbers. */
  phone_number: string[];
  /** Embedded social media profile links. */
  socialLink: {
    facebook: string;
    instagram: string;
    github: string;
    x: string;
    website: string;
  };
  /** List of user hobbies. */
  hobbies: string[];
};

/**
 * UserProfileState type definition.
 * Holds the state object structure for user profile.
 */
export type UserProfileState = {
  /** The current user profile data. */
  userData: UserProfileData;
};

/**
 * ProfileStateActions interface.
 * Defines callback mutation handlers to update store state.
 */
export interface ProfileStateActions {
  /** Callback action to update the user profile. */
  updateProfile: (profile: UserProfileData) => void;
  /** Callback action to clear/remove the current profile. */
  removeProfile: () => void;
}

/**
 * Combined profile slice holding both state and actions.
 */
export type ProfileStateSlice = UserProfileState & ProfileStateActions;
