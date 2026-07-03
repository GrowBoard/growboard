import { useQuery } from '@tanstack/react-query';
import { googleSheetsHabitsService } from '../../../googleSheets/GoogleSheetsHabitsService';
import { appStore } from '@store';
import { useEffect } from 'react';
import { habitsSelector, useShallow } from '@selectors';

/**
 * useGetHabitLogsData Custom Hook.
 * Automatically queries Google Sheets for the user's daily habit log entries
 * and updates the central Habits store slice upon a successful response.
 *
 * @returns React Query result handle containing loading state, data, and errors.
 */
export const useGetHabitLogsData = () => {
  const { habitLogsData, updateHabitLogs } = appStore(
    useShallow(habitsSelector),
  );

  const query = useQuery({
    queryKey: ['sheetHabitLogs'],
    queryFn: () => googleSheetsHabitsService.getLogs(),
    retry: 1,
    initialData: habitLogsData.length > 0 ? habitLogsData : undefined,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.data) {
      updateHabitLogs(query.data);
    }
  }, [query.data, updateHabitLogs]);

  return query;
};

export default useGetHabitLogsData;
