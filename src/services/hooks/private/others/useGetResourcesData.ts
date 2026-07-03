import { useQuery } from '@tanstack/react-query';
import { googleSheetsResourceService } from '../../../googleSheets/GoogleSheetsResourceService';
import { appStore } from '@store';
import { useEffect } from 'react';
import { resourcesSelector, useShallow } from '@selectors';

/**
 * useGetResourcesData Custom Hook.
 * Automatically queries Google Sheets for user resources data
 * and updates the central store resources state slice upon a successful query response.
 *
 * @returns React Query result handle containing loading state, data, and errors.
 */
export const useGetResourcesData = () => {
  const { resourcesData, updateResources } = appStore(
    useShallow(resourcesSelector),
  );

  const query = useQuery({
    queryKey: ['sheetResources'],
    queryFn: () => googleSheetsResourceService.getResources(),
    retry: 1,
    initialData:
      resourcesData.length > 0
        ? {
            data: resourcesData,
            status: 'SUCCESS',
            successMessage: 'Cached resources loaded.',
          }
        : undefined,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.data?.data) {
      updateResources(query.data.data);
    }
  }, [query.data, updateResources]);

  return query;
};

export default useGetResourcesData;
