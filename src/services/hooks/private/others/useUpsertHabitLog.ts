import { useMutation, useQueryClient } from '@tanstack/react-query';
import { googleSheetsHabitsService } from '../../../googleSheets/GoogleSheetsHabitsService';
import { HabitLogItem } from '@store';

/**
 * useUpsertHabitLog Custom Hook.
 * Provides a mutation trigger to insert or update a daily habit log entry.
 * Invalidates the habit logs query on success to trigger a fresh sync.
 *
 * @returns React Query mutation handle.
 */
export const useUpsertHabitLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (log: Omit<HabitLogItem, 'id'>) =>
      googleSheetsHabitsService.upsertLog(log),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sheetHabitLogs'] });
    },
  });
};

export default useUpsertHabitLog;
