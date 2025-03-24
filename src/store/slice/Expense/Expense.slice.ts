import { AppStoreSlice } from 'src/store/store';
import { ExpenseDataState, ExpenseStateSlice, TimeWindow } from './types';
import { ExpenseType } from '@screens/private/screens/expenses/expense_preview/types';

const date = new Date();
const initialState: ExpenseDataState = {
  overview: {
    timeWindow: TimeWindow.MONTH,
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
  },
  addExpense: {
    isOpen: false,
  },
  date: date,
};

const createExpenseSlice: AppStoreSlice<ExpenseStateSlice> = (set) => ({
  ...initialState,
  setTimeWindow: (timeWindow: TimeWindow) =>
    set((state) => {
      state.Expense.overview.timeWindow = timeWindow;
    }),
  setAddExpense: (isOpen: boolean, type?: ExpenseType, date?: string) =>
    set((state) => {
      state.Expense.addExpense.isOpen = isOpen;
      state.Expense.addExpense.type = type;
      state.Expense.addExpense.date = date;
    }),
  setOverviewInput: ({ month, year }) =>
    set((state) => {
      state.Expense.overview.month = month;
      state.Expense.overview.year = year ?? state.Expense.overview.year;
    }),
  setOverviewInputWithDay: ({ day, month, year }) =>
    set((state) => {
      state.Expense.overview.day = day;
      state.Expense.overview.month = month;
      state.Expense.overview.year = year ?? state.Expense.overview.year;
    }),
});

export default createExpenseSlice;
