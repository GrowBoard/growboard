import { useCallSBMutation } from '../../common';
import { useErrorToast, useSuccessToast } from '@components';
import { googleSheetsExpenseService } from '../../../googleSheetsExpenseService';
import { useQueryClient } from '@tanstack/react-query';
import { ExpenseDataPoint } from './types';

const useEditExpenseData = () => {
  const errorToast = useErrorToast();
  const successToast = useSuccessToast();
  const queryClient = useQueryClient();

  return useCallSBMutation({
    method: (data: ExpenseDataPoint) =>
      googleSheetsExpenseService.updateExpense(data),
    mutationOptions: {
      onSuccess: () => {
        successToast('Updated expense successfully.');
        queryClient.invalidateQueries();
      },
      onError: (error: any) => {
        errorToast(error.message || 'Failed to update expense');
      },
    },
  });
};

export default useEditExpenseData;
