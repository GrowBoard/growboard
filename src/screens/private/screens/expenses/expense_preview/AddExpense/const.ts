import { ExpenseType } from '../types';
import { ExpenseInputData } from './types';

export const getInitialExpenseInput = (
  date: string,
  category?: ExpenseType,
): ExpenseInputData => ({
  date,
  amount: '',
  comment: '',
  category: category ?? ExpenseType.Food,
});
