import { useQuery } from '@tanstack/react-query';
import { googleSheetsResourceService } from '../../../googleSheets/GoogleSheetsResourceService';
import { appStore } from '@store';
import { resourcesSelector, useShallow } from '@selectors';

/**
 * useGetResourcesData Custom Hook.
 * Queries Google Sheets for resources, updating the store on success,
 * and caches data locally with a 1-hour staleTime.
 */
export const useGetResourcesData = () => {
  const token = appStore((state) => state.Auth.token);
  const { resourcesData, lastFetched, updateResources } = appStore(
    useShallow(resourcesSelector),
  );

  return useQuery({
    queryKey: ['sheetResources'],
    queryFn: async () => {
      const response = await googleSheetsResourceService.getResources();
      if (response?.data) {
        updateResources(response.data);
      }
      return response;
    },
    retry: 1,
    initialData:
      resourcesData.length > 0
        ? {
            data: resourcesData,
            status: 'SUCCESS',
            successMessage: 'Cached resources loaded.',
          }
        : undefined,
    initialDataUpdatedAt: lastFetched,
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!token,
  });
};

export default useGetResourcesData;
