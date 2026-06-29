import { useQuery } from '@tanstack/react-query';
import { googleSheetsProjectService } from '../../../googleSheets/GoogleSheetsProjectService';
import { appStore } from '@store';
import { useEffect } from 'react';
import { projectsSelector, useShallow } from '@selectors';

/**
 * useGetProjectsData Custom Hook.
 * Automatically queries Google Sheets for user projects data
 * and updates the central store projects state slice upon a successful query response.
 *
 * @returns React Query result handle containing loading state, data, and errors.
 */
export const useGetProjectsData = () => {
  const { projectData, addProjects } = appStore(useShallow(projectsSelector));

  const query = useQuery({
    queryKey: ['sheetProjects'],
    queryFn: () => googleSheetsProjectService.getProjects(),
    retry: 1,
    initialData: projectData.length > 0
      ? { data: projectData, status: 'SUCCESS', successMessage: 'Cached projects loaded.' }
      : undefined,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.data?.data) {
      addProjects(query.data.data);
    }
  }, [query.data, addProjects]);

  return query;
};

export default useGetProjectsData;
