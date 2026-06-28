import { useQuery } from '@tanstack/react-query';
import { googleDriveProfileService } from '../../../googleDriveProfileService';
import { appStore } from '@store';
import { useEffect } from 'react';
import { profileSelector, useShallow } from '@selectors';

/**
 * useGetProfileData Custom Hook.
 * Automatically queries Google Drive for user profile configuration data
 * and updates the central store profile state slice upon a successful query response.
 *
 * @returns React Query result handle containing loading state, data, and errors.
 */
export const useGetProfileData = () => {
  const { updateProfile } = appStore(useShallow(profileSelector));

  const query = useQuery({
    queryKey: ['driveProfile'],
    queryFn: () => googleDriveProfileService.readProfile(),
    retry: 1,
  });

  useEffect(() => {
    if (query.data) {
      updateProfile(query.data);
    }
  }, [query.data, updateProfile]);

  return query;
};

export default useGetProfileData;
