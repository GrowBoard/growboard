import { useMutation, useQueryClient } from '@tanstack/react-query';
import { googleSheetsPlanService } from '../../../googleSheets/GoogleSheetsPlanService';
import { PlanItem } from '@store';

/**
 * useSavePlanData Custom Hook.
 * Provides a mutation trigger to add or update a plan back to Google Sheets
 * and invalidates the plans query to trigger a fresh sync.
 *
 * @returns React Query mutation handle.
 */
export const useSavePlanData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (plan: Omit<PlanItem, 'Id'> & { Id?: string }) => {
      if (plan.Id) {
        return googleSheetsPlanService.updatePlan(plan.Id, plan);
      } else {
        return googleSheetsPlanService.addPlan(plan);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sheetPlans'] });
    },
  });
};

export default useSavePlanData;
