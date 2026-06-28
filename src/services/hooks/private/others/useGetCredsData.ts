import { useQuery } from '@tanstack/react-query';
import { googleDriveCredsService } from '../../../googleDriveCredsService';
import { appStore } from '@store';
import { useEffect } from 'react';
import { credsSelector, useShallow } from '@selectors';

/**
 * useGetCredsData Custom Hook.
 * Automatically queries Google Drive for user credentials data
 * and updates the central store credentials state slice upon a successful query response.
 *
 * @returns React Query result handle containing loading state, data, and errors.
 */
export const useGetCredsData = () => {
  const { updateCreds } = appStore(useShallow(credsSelector));

  const query = useQuery({
    queryKey: ['driveCreds'],
    queryFn: () => googleDriveCredsService.readCreds(),
    retry: 1,
  });

  useEffect(() => {
    if (query.data) {
      updateCreds(query.data);
    }
  }, [query.data, updateCreds]);

  return query;
};

export default useGetCredsData;
