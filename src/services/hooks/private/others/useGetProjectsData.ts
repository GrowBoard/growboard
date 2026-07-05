import { useQuery } from '@tanstack/react-query';
import { googleSheetsProjectService } from '../../../googleSheets/GoogleSheetsProjectService';
import { appStore } from '@store';
import { projectsSelector, useShallow } from '@selectors';

/**
 * useGetProjectsData Custom Hook.
 * Queries Google Sheets for projects, updating the store on success,
 * and caches data locally with a 1-hour staleTime.
 */
export const useGetProjectsData = () => {
  const token = appStore((state) => state.Auth.token);
  const { projectData, lastFetched, addProjects } = appStore(useShallow(projectsSelector));

  return useQuery({
    queryKey: ['sheetProjects'],
    queryFn: async () => {
      const response = await googleSheetsProjectService.getProjects();
      if (response?.data) {
        addProjects(response.data);
      }
      return response;
    },
    retry: 1,
    initialData:
      projectData.length > 0
        ? {
            data: projectData,
            status: 'SUCCESS',
            successMessage: 'Cached projects loaded.',
          }
        : undefined,
    initialDataUpdatedAt: lastFetched,
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!token,
  });
};

export default useGetProjectsData;
