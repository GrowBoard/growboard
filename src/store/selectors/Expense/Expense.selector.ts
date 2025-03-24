import { AppStoreState } from '@store';
import { getIstDate } from '../../../util/input/Input';

export const timeWindowSelector = (state: AppStoreState) =>
  state.Expense.overview.timeWindow;

export const setTimeWindowSelector = (state: AppStoreState) =>
  state.Expense.setTimeWindow;

export const overviewInputSelector = (state: AppStoreState) => ({
  dateState: state.Expense.overview,
  setOverviewInput: state.Expense.setOverviewInput,
  setOverviewInputWithDay: state.Expense.setOverviewInputWithDay,
});

export const dateSelector = (state: AppStoreState) => state.Expense.date;

export const todayDateSelector = (state: AppStoreState) => {
  const date = state.Expense.date;
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  return getIstDate({
    day,
    month,
    year,
  });
};

export const addExpenseSelector = (state: AppStoreState) =>
  state.Expense.addExpense;

export const setAddExpenseSelector = (state: AppStoreState) =>
  state.Expense.setAddExpense;
