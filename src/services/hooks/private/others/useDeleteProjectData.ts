import { useMutation, useQueryClient } from '@tanstack/react-query';
import { googleSheetsProjectService } from '../../../googleSheets/GoogleSheetsProjectService';

/**
 * useDeleteProjectData Custom Hook.
 * Provides a mutation trigger to delete a project from Google Sheets by its ID
 * and invalidates the projects query to trigger a fresh sync.
 *
 * @returns React Query mutation handle.
 */
export const useDeleteProjectData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => googleSheetsProjectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sheetProjects'] });
    },
  });
};

export default useDeleteProjectData;
