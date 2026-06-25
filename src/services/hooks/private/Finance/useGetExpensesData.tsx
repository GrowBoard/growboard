import { googleSheetsExpenseService } from '../../../googleSheetsExpenseService';
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
  const [yearStr, monthStr] = start_date.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // 0-11

  return useCallQuery({
    method: () => googleSheetsExpenseService.getExpensesForMonth(year, month),
    queryOptions: {
      queryKey: ['start_date_' + start_date, 'end_date_' + end_date],
      // Since it's Google Sheets, enable retry but not too aggressively
      retry: 1,
    },
  });
};

export default useGetExpensesData;
