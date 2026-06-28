import { useMutation, useQueryClient } from '@tanstack/react-query';
import { googleDriveCredsService } from '../../../googleDriveCredsService';
import { appStore, CredentialItem } from '@store';
import { credsSelector, useShallow } from '@selectors';

/**
 * useSaveCredsData Custom Hook.
 * Provides a mutation trigger to persist updated credentials back to Google Drive
 * and synchronizes the local store state and React Query cache on a successful write.
 *
 * @returns React Query mutation handle.
 */
export const useSaveCredsData = () => {
  const queryClient = useQueryClient();
  const { updateCreds } = appStore(useShallow(credsSelector));

  return useMutation({
    mutationFn: (credsData: CredentialItem[]) =>
      googleDriveCredsService.saveCreds(credsData),
    onSuccess: (_, variables) => {
      updateCreds(variables);
      queryClient.setQueryData(['driveCreds'], variables);
    },
  });
};

export default useSaveCredsData;
