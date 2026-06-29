import { useMutation, useQueryClient } from '@tanstack/react-query';
import { googleSheetsResourceService } from '../../../googleSheets/GoogleSheetsResourceService';
import { ResourceItem } from '@store';

/**
 * useSaveResourceData Custom Hook.
 * Provides a mutation trigger to add a resource back to Google Sheets
 * and invalidates the resources query to trigger a fresh sync from Google Sheets.
 *
 * @returns React Query mutation handle.
 */
export const useSaveResourceData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resource: Omit<ResourceItem, 'Id'>) =>
      googleSheetsResourceService.addResource(resource),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sheetResources'] });
    },
  });
};

export default useSaveResourceData;
