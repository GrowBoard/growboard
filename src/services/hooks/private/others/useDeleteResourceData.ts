import { useMutation, useQueryClient } from '@tanstack/react-query';
import { googleSheetsResourceService } from '../../../googleSheets/GoogleSheetsResourceService';

/**
 * useDeleteResourceData Custom Hook.
 * Provides a mutation trigger to delete a resource from Google Sheets by its ID
 * and invalidates the resources query to trigger a fresh list fetch.
 *
 * @returns React Query mutation handle.
 */
export const useDeleteResourceData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => googleSheetsResourceService.deleteResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sheetResources'] });
    },
  });
};

export default useDeleteResourceData;
