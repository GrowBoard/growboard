import { useCallSBMutation } from '../../common';
import { useErrorToast, useSuccessToast } from '@components';
import { addExpenseData } from '@services/backend';

const useAddExpenseData = () => {
  const errorToast = useErrorToast();
  const successToast = useSuccessToast();
  return useCallSBMutation({
    method: (data: {
      amount: number;
      category: string;
      date_time: string;
      comment: string;
    }) => addExpenseData(data),
    mutationOptions: {
      onSuccess: () => {
        successToast('Added expense successfully.');
      },
      onError: (error) => {
        errorToast(error.message);
      },
    },
  });
};

export default useAddExpenseData;
