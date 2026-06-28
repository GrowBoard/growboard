import { useCallSBMutation } from '../../common';
import { useErrorToast, useSuccessToast } from '@components';
import { googleSheetsExpenseService } from '@services/googleSheets';
import { useQueryClient } from '@tanstack/react-query';
import { ExpenseType } from '@screens/private/screens/expenses/expense_preview/types';

const useAddExpenseData = () => {
  const errorToast = useErrorToast();
  const successToast = useSuccessToast();
  const queryClient = useQueryClient();

  return useCallSBMutation({
    method: (data: {
      amount: number;
      category: ExpenseType;
      date_time: string;
      comment: string;
    }) => googleSheetsExpenseService.addExpense(data),
    mutationOptions: {
      onSuccess: () => {
        successToast('Added expense successfully.');
        queryClient.invalidateQueries();
      },
      onError: (error: any) => {
        errorToast(error.message || 'Failed to add expense');
      },
    },
  });
};

export default useAddExpenseData;
