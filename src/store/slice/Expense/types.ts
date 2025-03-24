import { ExpenseType } from '@screens/private/screens/expenses/expense_preview/types';

export enum TimeWindow {
  DAY = 'Day',
  // WEEK = 'week',
  MONTH = 'Month',
  YEAR = 'Year',
}

export type ExpenseDataState = {
  timeWindow: TimeWindow;
  date: Date;
  addExpense: {
    isOpen: boolean;
    type?: ExpenseType;
    date?: string;
  };
};

export interface ExpenseStateActions {
  setTimeWindow: (timeWindow: TimeWindow) => void;
  setAddExpense: (isOpen: boolean, type?: ExpenseType, date?: string) => void;
}

export type ExpenseStateSlice = ExpenseDataState & ExpenseStateActions;
