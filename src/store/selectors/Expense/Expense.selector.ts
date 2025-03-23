import { AppStoreState } from '@store';

export const timeWindowSelector = (state: AppStoreState) =>
  state.Expense.timeWindow;

export const setTimeWindowSelector = (state: AppStoreState) =>
  state.Expense.setTimeWindow;

export const dateSelector = (state: AppStoreState) => state.Expense.date;
