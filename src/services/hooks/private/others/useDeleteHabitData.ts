import { useMutation, useQueryClient } from '@tanstack/react-query';
import { googleSheetsHabitsService } from '../../../googleSheets/GoogleSheetsHabitsService';

/**
 * useDeleteHabitData Custom Hook.
 * Provides a mutation trigger to delete a habit (and all its associated logs)
 * from Google Sheets, then invalidates both the habits and habit logs queries.
 *
 * @returns React Query mutation handle.
 */
export const useDeleteHabitData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (habitId: string) =>
      googleSheetsHabitsService.deleteHabit(habitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sheetHabits'] });
      queryClient.invalidateQueries({ queryKey: ['sheetHabitLogs'] });
    },
  });
};

export default useDeleteHabitData;
