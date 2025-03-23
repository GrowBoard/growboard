import { AppStoreSlice } from 'src/store/store';
import { ExpenseDataState, ExpenseStateSlice, TimeWindow } from './types';

const initialState: ExpenseDataState = {
  timeWindow: TimeWindow.DAY,
  date: new Date(),
};

const createExpenseSlice: AppStoreSlice<ExpenseStateSlice> = (set) => ({
  ...initialState,
  setTimeWindow: (timeWindow: TimeWindow) =>
    set((state) => {
      state.Expense.timeWindow = timeWindow;
    }),
});

export default createExpenseSlice;
