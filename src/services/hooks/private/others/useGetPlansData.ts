import { useQuery } from '@tanstack/react-query';
import { googleSheetsPlanService } from '../../../googleSheets/GoogleSheetsPlanService';
import { appStore } from '@store';
import { plansSelector, useShallow } from '@selectors';

/**
 * useGetPlansData Custom Hook.
 * Queries Google Sheets for plans, updating the store on success,
 * and caches data locally with a 1-hour staleTime.
 */
export const useGetPlansData = () => {
  const token = appStore((state) => state.Auth.token);
  const { plansData, lastFetched, updatePlans } = appStore(useShallow(plansSelector));

  return useQuery({
    queryKey: ['sheetPlans'],
    queryFn: async () => {
      const response = await googleSheetsPlanService.getPlans();
      if (response?.data) {
        updatePlans(response.data);
      }
      return response;
    },
    retry: 1,
    initialData:
      plansData.length > 0
        ? {
            data: plansData,
            status: 'SUCCESS',
            successMessage: 'Cached plans loaded.',
          }
        : undefined,
    initialDataUpdatedAt: lastFetched,
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!token,
  });
};

export default useGetPlansData;
