import { useQuery } from '@tanstack/react-query';
import { googleDriveGoalsService } from '../../../googleDriveGoalsService';
import { appStore } from '@store';
import { useEffect } from 'react';
import { goalsSelector, useShallow } from '@selectors';

/**
 * useGetGoalsData Custom Hook.
 * Automatically queries Google Drive for user goals data
 * and updates the central store goals state slice upon a successful query response.
 *
 * @returns React Query result handle containing loading state, data, and errors.
 */
export const useGetGoalsData = () => {
  const { goalsData, updateGoals } = appStore(useShallow(goalsSelector));

  const query = useQuery({
    queryKey: ['driveGoals'],
    queryFn: () => googleDriveGoalsService.readAllGoals(),
    retry: 1,
    initialData: goalsData.length > 0 ? goalsData : undefined,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.data) {
      updateGoals(query.data);
    }
  }, [query.data, updateGoals]);

  return query;
};

export default useGetGoalsData;
