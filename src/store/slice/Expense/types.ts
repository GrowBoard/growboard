import { ExpenseType } from '@screens/private/screens/expenses/expense_preview/types';
import { ExpenseDataPoint } from '../../../services/hooks/private/Finance/types';

export enum TimeWindow {
  DAY = 'Day',
  // WEEK = 'week',
  MONTH = 'Month',
  YEAR = 'Year',
}

export type ExpenseDataState = {
  overview: {
    timeWindow: TimeWindow;
    day: number;
    month: number;
    year: number;
  };
  date: Date;
  addExpense: {
    isOpen: boolean;
    type?: ExpenseType;
    date?: string;
    expenseId?: string;
  };
  expensesData: ExpenseDataPoint[];
  lastFetched: Record<string, number>;
};

export interface ExpenseStateActions {
  setTimeWindow: (timeWindow: TimeWindow) => void;
  setOverviewInput: (args: { month: number; year?: number }) => void;
  setOverviewInputWithDay: (args: {
    day: number;
    month: number;
    year?: number;
  }) => void;
  setAddExpense: (
    isOpen: boolean,
    type?: ExpenseType,
    date?: string,
    expenseId?: string,
  ) => void;
  updateExpenses: (expenses: ExpenseDataPoint[]) => void;
  updateExpenseLastFetched: (args: { monthKey: string; timestamp: number }) => void;
}

export type ExpenseStateSlice = ExpenseDataState & ExpenseStateActions;
