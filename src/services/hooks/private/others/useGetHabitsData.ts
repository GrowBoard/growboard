import { useQuery } from '@tanstack/react-query';
import { googleSheetsHabitsService } from '../../../googleSheets/GoogleSheetsHabitsService';
import { appStore } from '@store';
import { habitsSelector, useShallow } from '@selectors';

/**
 * useGetHabitsData Custom Hook.
 * Automatically queries Google Sheets for the user's habit definitions,
 * updating the store on success, and caching data with 1-hour staleTime.
 */
export const useGetHabitsData = () => {
  const token = appStore((state) => state.Auth.token);
  const { habitsData, lastFetchedHabits, updateHabits } = appStore(useShallow(habitsSelector));

  return useQuery({
    queryKey: ['sheetHabits'],
    queryFn: async () => {
      const data = await googleSheetsHabitsService.getHabits();
      updateHabits(data);
      return data;
    },
    retry: 1,
    initialData: habitsData.length > 0 ? habitsData : undefined,
    initialDataUpdatedAt: lastFetchedHabits,
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!token,
  });
};

export default useGetHabitsData;
