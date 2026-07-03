import { useMutation, useQueryClient } from '@tanstack/react-query';
import { googleDriveGoalsService } from '../../../googleDriveGoalsService';
import { GoalItem } from '@store';

/**
 * useSaveGoalData Custom Hook.
 * Provides a mutation trigger to persist a goal back to Google Drive
 * and invalidates the goals query to trigger a fresh sync from Google Drive.
 *
 * @returns React Query mutation handle.
 */
export const useSaveGoalData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goal: GoalItem) => googleDriveGoalsService.saveGoal(goal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driveGoals'] });
    },
  });
};

export default useSaveGoalData;
