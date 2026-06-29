import { useMutation, useQueryClient } from '@tanstack/react-query';
import { googleDriveLearningsService } from '../../../googleDriveLearningsService';
import { LearningItem } from '@store';

/**
 * useSaveLearningData Custom Hook.
 * Provides a mutation trigger to persist a learning back to Google Drive
 * and invalidates the learnings query to trigger a fresh sync from Google Drive.
 *
 * @returns React Query mutation handle.
 */
export const useSaveLearningData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      learning,
      originalTitle,
    }: {
      learning: LearningItem;
      originalTitle?: string;
    }) => googleDriveLearningsService.saveLearning(learning, originalTitle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driveLearnings'] });
    },
  });
};

export default useSaveLearningData;
