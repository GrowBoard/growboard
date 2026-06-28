import { useSaveProfileData } from '@services/hooks/private';
import { useSuccessToast, useErrorToast } from '@components';

/**
 * The input fields structure representing form state in ProfileForm.
 */
export interface ProfileFormValues {
  /** Brief description of the user. */
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
  /** Hobbies tags list. */
  hobbies: string[];
}

/**
 * Properties expected by the ProfileForm component.
 */
export interface ProfileFormProps {
  /** The initial user profile data fetched from the API. */
  initialData: ProfileFormValues;
  /** The user's displayName retrieved from the authentication store. */
  name: string;
  /** Mutation trigger to save updated profile data. */
  saveMutation: ReturnType<typeof useSaveProfileData>;
  /** Success callback trigger to display a confirmation toast. */
  successToast: ReturnType<typeof useSuccessToast>;
  /** Error callback trigger to display a failure toast. */
  errorToast: ReturnType<typeof useErrorToast>;
}
