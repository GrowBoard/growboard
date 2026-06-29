import { useMutation, useQueryClient } from '@tanstack/react-query';
import { googleSheetsProjectService } from '../../../googleSheets/GoogleSheetsProjectService';
import { ProjectItem } from '@store';

/**
 * useSaveProjectData Custom Hook.
 * Provides a mutation trigger to add or update a project back to Google Sheets
 * and invalidates the projects query to trigger a fresh sync.
 *
 * @returns React Query mutation handle.
 */
export const useSaveProjectData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (project: Omit<ProjectItem, 'Id'> & { Id?: string }) => {
      if (project.Id) {
        return googleSheetsProjectService.updateProject(project.Id, project);
      } else {
        return googleSheetsProjectService.addProject(project);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sheetProjects'] });
    },
  });
};

export default useSaveProjectData;
