import { ExpenseType } from '../types';

export interface ExpenseInputData {
  date: string;
  amount: string;
  comment: string;
  category: ExpenseType;
}
