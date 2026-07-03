import { useQuery } from '@tanstack/react-query';
import { googleSheetsHabitsService } from '../../../googleSheets/GoogleSheetsHabitsService';
import { appStore } from '@store';
import { habitsSelector, useShallow } from '@selectors';

/**
 * useGetHabitLogsData Custom Hook.
 * Automatically queries Google Sheets for the user's daily habit log entries,
 * updating the store on success, and caching data with 1-hour staleTime.
 */
export const useGetHabitLogsData = () => {
  const { habitLogsData, lastFetchedLogs, updateHabitLogs } = appStore(
    useShallow(habitsSelector),
  );

  return useQuery({
    queryKey: ['sheetHabitLogs'],
    queryFn: async () => {
      const data = await googleSheetsHabitsService.getLogs();
      updateHabitLogs(data);
      return data;
    },
    retry: 1,
    initialData: habitLogsData.length > 0 ? habitLogsData : undefined,
    initialDataUpdatedAt: lastFetchedLogs,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export default useGetHabitLogsData;
