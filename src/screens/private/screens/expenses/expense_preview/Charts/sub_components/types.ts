import { ExpenseType } from '../../types';

export type ExpenseSummaryProps = {
  expenseByCategory: Record<ExpenseType, number>;
};
