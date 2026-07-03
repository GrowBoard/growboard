import { useQuery } from '@tanstack/react-query';
import { googleSheetsHabitsService } from '../../../googleSheets/GoogleSheetsHabitsService';
import { appStore } from '@store';
import { useEffect } from 'react';
import { habitsSelector, useShallow } from '@selectors';

/**
 * useGetHabitsData Custom Hook.
 * Automatically queries Google Sheets for the user's habit definitions
 * and updates the central Habits store slice upon a successful response.
 *
 * @returns React Query result handle containing loading state, data, and errors.
 */
export const useGetHabitsData = () => {
  const { habitsData, updateHabits } = appStore(useShallow(habitsSelector));

  const query = useQuery({
    queryKey: ['sheetHabits'],
    queryFn: () => googleSheetsHabitsService.getHabits(),
    retry: 1,
    initialData: habitsData.length > 0 ? habitsData : undefined,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.data) {
      updateHabits(query.data);
    }
  }, [query.data, updateHabits]);

  return query;
};

export default useGetHabitsData;
