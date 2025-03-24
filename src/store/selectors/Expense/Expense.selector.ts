import { AppStoreState } from '@store';

export const timeWindowSelector = (state: AppStoreState) =>
  state.Expense.timeWindow;

export const setTimeWindowSelector = (state: AppStoreState) =>
  state.Expense.setTimeWindow;

export const dateSelector = (state: AppStoreState) => state.Expense.date;

export const todayDateSelector = (state: AppStoreState) => {
  const [day, month, year] = state.Expense.date
    .toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
    })
    // added to fix the date format issue with month intial 0
    .split('/');

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

export const addExpenseSelector = (state: AppStoreState) =>
  state.Expense.addExpense;

export const setAddExpenseSelector = (state: AppStoreState) =>
  state.Expense.setAddExpense;
