import { AppStoreSlice } from 'src/store/store';
import { ExpenseDataState, ExpenseStateSlice, TimeWindow } from './types';
import { ExpenseType } from '@screens/private/screens/expenses/expense_preview/types';

/**
 * The initial state configuration for the expense slice.
 */
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
  date,
  expensesData: [],
  lastFetched: {},
};

/**
 * createExpenseSlice.
 * Initializes the state slice and mutation actions for expense management.
 *
 * @param set Central store setter callback.
 * @returns The expense state and actions slice.
 */
const createExpenseSlice: AppStoreSlice<ExpenseStateSlice> = (set) => ({
  ...initialState,
  /** Set the time window (day, month, year) for expense overview. */
  setTimeWindow: (timeWindow: TimeWindow) =>
    set((state) => {
      state.Expense.overview.timeWindow = timeWindow;
    }),
  /** Configure the add‑expense modal visibility and optional parameters. */
  setAddExpense: (
    isOpen: boolean,
    type?: ExpenseType,
    date?: string,
    expenseId?: string,
  ) =>
    set((state) => {
      state.Expense.addExpense.isOpen = isOpen;
      state.Expense.addExpense.type = type;
      state.Expense.addExpense.date = date;
      state.Expense.addExpense.expenseId = expenseId;
    }),
  /** Update month and optionally year for the expense overview. */
  setOverviewInput: ({ month, year }) =>
    set((state) => {
      state.Expense.overview.month = month;
      state.Expense.overview.year = year ?? state.Expense.overview.year;
    }),
  /** Update day, month and optionally year for the expense overview. */
  setOverviewInputWithDay: ({ day, month, year }) =>
    set((state) => {
      state.Expense.overview.day = day;
      state.Expense.overview.month = month;
      state.Expense.overview.year = year ?? state.Expense.overview.year;
    }),
  updateExpenses: (expenses) =>
    set((state) => {
      state.Expense.expensesData = expenses;
    }),
  updateExpenseLastFetched: ({ monthKey, timestamp }) =>
    set((state) => {
      if (!state.Expense.lastFetched) {
        state.Expense.lastFetched = {};
      }
      state.Expense.lastFetched[monthKey] = timestamp;
    }),
});

export default createExpenseSlice;
