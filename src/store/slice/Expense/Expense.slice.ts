import { AppStoreSlice } from 'src/store/store';
import { ExpenseDataState, ExpenseStateSlice, TimeWindow } from './types';
import { ExpenseType } from '@screens/private/screens/expenses/expense_preview/types';

const initialState: ExpenseDataState = {
  timeWindow: TimeWindow.DAY,
  addExpense: {
    isOpen: false,
  },
  date: new Date(),
};

const createExpenseSlice: AppStoreSlice<ExpenseStateSlice> = (set) => ({
  ...initialState,
  setTimeWindow: (timeWindow: TimeWindow) =>
    set((state) => {
      state.Expense.timeWindow = timeWindow;
    }),
  setAddExpense: (isOpen: boolean, type?: ExpenseType, date?: string) =>
    set((state) => {
      state.Expense.addExpense.isOpen = isOpen;
      state.Expense.addExpense.type = type;
      state.Expense.addExpense.date = date;
    }),
});

export default createExpenseSlice;
