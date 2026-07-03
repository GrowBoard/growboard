import { googleSheetsExpenseService } from '@services/googleSheets';
import { appStore } from '@store';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
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
  const expensesData = appStore((state) => state.Expense.expensesData);
  const lastFetched = appStore((state) => state.Expense.lastFetched);
  const updateExpenses = appStore((state) => state.Expense.updateExpenses);
  const updateExpenseLastFetched = appStore((state) => state.Expense.updateExpenseLastFetched);

  const [yearStr, monthStr] = start_date.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // 0-11
  const monthKey = `${year}-${month + 1}`;

  // Filter local state for the target month
  const localFiltered = (expensesData || []).filter((exp) => {
    const expDate = new Date(exp.date_time);
    return expDate.getFullYear() === year && expDate.getMonth() === month;
  });

  const timestamp = lastFetched ? lastFetched[monthKey] : undefined;

  return useQuery({
    queryKey: ['start_date_' + start_date, 'end_date_' + end_date],
    queryFn: async () => {
      const response = await googleSheetsExpenseService.getExpensesForMonth(year, month);
      if (response?.data) {
        // Filter out existing expenses of this month to overwrite with latest fetched
        const otherMonthsExpenses = (expensesData || []).filter((exp) => {
          const expDate = new Date(exp.date_time);
          return !(expDate.getFullYear() === year && expDate.getMonth() === month);
        });
        updateExpenses([...otherMonthsExpenses, ...response.data]);
        updateExpenseLastFetched({ monthKey, timestamp: Date.now() });
      }
      return response;
    },
    retry: 1,
    initialData: localFiltered.length > 0
      ? { data: localFiltered, status: 'SUCCESS', successMessage: 'Cached expenses loaded.' }
      : undefined,
    initialDataUpdatedAt: timestamp,
    staleTime: 1000 * 60 * 60, // 1 hour
  }) as any;
};

export default useGetExpensesData;
