import { ExpenseType } from '@screens/private/screens/expenses/expense_preview/types';
import { PieChartProps } from './types';
import { EXPENSE_TYPE_COLOR } from '@screens/private/screens/expenses/expense_preview/ExpensesTable';

export const PIE_CHART_DATA: PieChartProps['data'] = {
  datasets: [
    {
      data: [19, 20, 19, 12, 32, 10, 4, 3, 20],
      backgroundColor: Object.values(EXPENSE_TYPE_COLOR),
    },
  ],
  labels: Object.values(ExpenseType),
};
