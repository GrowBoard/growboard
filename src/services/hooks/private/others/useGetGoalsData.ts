import { useQuery } from '@tanstack/react-query';
import { googleDriveGoalsService } from '../../../googleDriveGoalsService';
import { appStore } from '@store';
import { goalsSelector, useShallow } from '@selectors';

/**
 * useGetGoalsData Custom Hook.
 * Queries Google Drive for goals, updating the store on success,
 * and caches data locally with a 1-hour staleTime.
 */
export const useGetGoalsData = () => {
  const token = appStore((state) => state.Auth.token);
  const { goalsData, lastFetched, updateGoals } = appStore(useShallow(goalsSelector));

  return useQuery({
    queryKey: ['driveGoals'],
    queryFn: async () => {
      const data = await googleDriveGoalsService.readAllGoals();
      updateGoals(data);
      return data;
    },
    retry: 1,
    initialData: goalsData.length > 0 ? goalsData : undefined,
    initialDataUpdatedAt: lastFetched,
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!token,
  });
};

export default useGetGoalsData;
