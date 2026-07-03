import { useQuery } from '@tanstack/react-query';
import { googleSheetsPlanService } from '../../../googleSheets/GoogleSheetsPlanService';
import { appStore } from '@store';
import { useEffect } from 'react';
import { plansSelector, useShallow } from '@selectors';

/**
 * useGetPlansData Custom Hook.
 * Automatically queries Google Sheets for user plans data
 * and updates the central store plans state slice upon a successful query response.
 *
 * @returns React Query result handle containing loading state, data, and errors.
 */
export const useGetPlansData = () => {
  const { plansData, updatePlans } = appStore(useShallow(plansSelector));

  const query = useQuery({
    queryKey: ['sheetPlans'],
    queryFn: () => googleSheetsPlanService.getPlans(),
    retry: 1,
    initialData:
      plansData.length > 0
        ? {
            data: plansData,
            status: 'SUCCESS',
            successMessage: 'Cached plans loaded.',
          }
        : undefined,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.data?.data) {
      updatePlans(query.data.data);
    }
  }, [query.data, updatePlans]);

  return query;
};

export default useGetPlansData;
