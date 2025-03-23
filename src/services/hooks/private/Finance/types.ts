import { ExpenseType } from '@screens/private/screens/expenses/expense_preview/types';

export type ExpenseDataPoint = {
  id: string;
  amount: number;
  date_time: string;
  comment: string;
  category: ExpenseType;
};
