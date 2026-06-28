import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  googleDriveProfileService,
  ProfileJSONData,
} from '../../../googleDriveProfileService';
import { appStore } from '@store';
import { profileSelector, useShallow } from '@selectors';

/**
 * useSaveProfileData Custom Hook.
 * Provides a mutation trigger to persist updated profile information back to Google Drive
 * and synchronizes the local store state and React Query cache on a successful write.
 *
 * @returns React Query mutation handle.
 */
export const useSaveProfileData = () => {
  const queryClient = useQueryClient();
  const { updateProfile } = appStore(useShallow(profileSelector));

  return useMutation({
    mutationFn: (profileData: ProfileJSONData) =>
      googleDriveProfileService.saveProfile(profileData),
    onSuccess: (_, variables) => {
      updateProfile(variables);
      queryClient.setQueryData(['driveProfile'], variables);
    },
  });
};

export default useSaveProfileData;
