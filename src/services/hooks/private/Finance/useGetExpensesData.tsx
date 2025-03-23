import { getExpenseData } from '@services/backend';
import { useCallQuery } from '../../common';
import { UseQueryResult } from '@tanstack/react-query';
import { ExpenseDataPoint } from './types';

const useGetExpensesData = ({
  start_date,
  end_date,
}: {
  start_date: string;
  end_date: string;
}): UseQueryResult<{
  data: ExpenseDataPoint[];
  status: string;
  successMessage: string;
}> => {
  return useCallQuery({
    method: () =>
      getExpenseData({
        start_date,
        end_date,
      }),
    queryOptions: {
      queryKey: ['start_date' + start_date, 'end_date' + end_date],
    },
  });
};

export default useGetExpensesData;
