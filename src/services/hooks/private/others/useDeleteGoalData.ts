import { useMutation, useQueryClient } from '@tanstack/react-query';
import { googleDriveGoalsService } from '../../../googleDriveGoalsService';

/**
 * useDeleteGoalData Custom Hook.
 * Provides a mutation trigger to delete a goal from Google Drive
 * and invalidates the goals query to trigger a fresh list fetch.
 *
 * @returns React Query mutation handle.
 */
export const useDeleteGoalData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) =>
      googleDriveGoalsService.deleteGoal(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driveGoals'] });
    },
  });
};

export default useDeleteGoalData;
