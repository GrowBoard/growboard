import { useMutation, useQueryClient } from '@tanstack/react-query';
import { googleSheetsPlanService } from '../../../googleSheets/GoogleSheetsPlanService';

/**
 * useDeletePlanData Custom Hook.
 * Provides a mutation trigger to delete a plan from Google Sheets by its ID
 * and invalidates the plans query to trigger a fresh sync.
 *
 * @returns React Query mutation handle.
 */
export const useDeletePlanData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => googleSheetsPlanService.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sheetPlans'] });
    },
  });
};

export default useDeletePlanData;
