import { useQuery } from '@tanstack/react-query';
import { googleDriveLearningsService } from '../../../googleDriveLearningsService';
import { appStore } from '@store';
import { useEffect } from 'react';
import { learningsSelector, useShallow } from '@selectors';

/**
 * useGetLearningsData Custom Hook.
 * Automatically queries Google Drive for user learnings data
 * and updates the central store learnings state slice upon a successful query response.
 *
 * @returns React Query result handle containing loading state, data, and errors.
 */
export const useGetLearningsData = () => {
  const { learningsData, updateLearnings } = appStore(useShallow(learningsSelector));

  const query = useQuery({
    queryKey: ['driveLearnings'],
    queryFn: () => googleDriveLearningsService.readAllLearnings(),
    retry: 1,
    initialData: learningsData.length > 0 ? learningsData : undefined,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.data) {
      updateLearnings(query.data);
    }
  }, [query.data, updateLearnings]);

  return query;
};

export default useGetLearningsData;
