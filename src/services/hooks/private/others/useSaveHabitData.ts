import { useMutation, useQueryClient } from '@tanstack/react-query';
import { googleSheetsHabitsService } from '../../../googleSheets/GoogleSheetsHabitsService';
import { HabitItem } from '@store';

/**
 * useSaveHabitData Custom Hook.
 * Provides a mutation trigger to add or update a habit definition in Google Sheets
 * and invalidates the habits query to trigger a fresh sync.
 *
 * @returns React Query mutation handle.
 */
export const useSaveHabitData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (habit: Omit<HabitItem, 'id'> & { id?: string }) => {
      if (habit.id) {
        return googleSheetsHabitsService.updateHabit(habit.id, habit);
      }
      return googleSheetsHabitsService.addHabit(habit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sheetHabits'] });
    },
  });
};

export default useSaveHabitData;
