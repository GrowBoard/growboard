import { useMutation, useQueryClient } from '@tanstack/react-query';
import { googleDriveLearningsService } from '../../../googleDriveLearningsService';

/**
 * useDeleteLearningData Custom Hook.
 * Provides a mutation trigger to delete a learning from Google Drive
 * and invalidates the learnings query to trigger a fresh list fetch.
 *
 * @returns React Query mutation handle.
 */
export const useDeleteLearningData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) =>
      googleDriveLearningsService.deleteLearning(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driveLearnings'] });
    },
  });
};

export default useDeleteLearningData;
