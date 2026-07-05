import { useQuery } from '@tanstack/react-query';
import { googleDriveLearningsService } from '../../../googleDriveLearningsService';
import { appStore } from '@store';
import { learningsSelector, useShallow } from '@selectors';

/**
 * useGetLearningsData Custom Hook.
 * Queries Google Drive for learnings, updating the store on success,
 * and caches data locally with a 1-hour staleTime.
 */
export const useGetLearningsData = () => {
  const token = appStore((state) => state.Auth.token);
  const { learningsData, lastFetched, updateLearnings } = appStore(
    useShallow(learningsSelector),
  );

  return useQuery({
    queryKey: ['driveLearnings'],
    queryFn: async () => {
      const data = await googleDriveLearningsService.readAllLearnings();
      updateLearnings(data);
      return data;
    },
    retry: 1,
    initialData: learningsData.length > 0 ? learningsData : undefined,
    initialDataUpdatedAt: lastFetched,
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!token,
  });
};

export default useGetLearningsData;
