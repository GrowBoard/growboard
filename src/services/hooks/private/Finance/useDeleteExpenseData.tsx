import { useCallSBMutation } from '../../common';
import { useErrorToast, useSuccessToast } from '@components';
import { googleSheetsExpenseService } from '../../../googleSheetsExpenseService';
import { useQueryClient } from '@tanstack/react-query';

const useDeleteExpenseData = () => {
  const errorToast = useErrorToast();
  const successToast = useSuccessToast();
  const queryClient = useQueryClient();

  return useCallSBMutation({
    method: async (data: { expenseId: string; dateStr: string }) => {
      await googleSheetsExpenseService.deleteExpense(
        data.expenseId,
        data.dateStr,
      );
      return { success: true };
    },
    mutationOptions: {
      onSuccess: () => {
        successToast('Deleted expense successfully.');
        queryClient.invalidateQueries();
      },
      onError: (error: any) => {
        errorToast(error.message || 'Failed to delete expense');
      },
    },
  });
};

export default useDeleteExpenseData;
