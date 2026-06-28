import { AppStoreState } from '@store';
import { getIstDate } from '../../../util/input/Input';

/**
 * timeWindowSelector.
 * Selects the current time window for overview filter.
 *
 * @param state The AppStoreState.
 * @returns The active TimeWindow value.
 */
export const timeWindowSelector = (state: AppStoreState) =>
  state.Expense.overview.timeWindow;

/**
 * setTimeWindowSelector.
 * Retrieves the action to modify the overview time window.
 *
 * @param state The AppStoreState.
 * @returns Method trigger to modify timeWindow.
 */
export const setTimeWindowSelector = (state: AppStoreState) =>
  state.Expense.setTimeWindow;

/**
 * overviewInputSelector.
 * Selects the date overview inputs and setter actions.
 *
 * @param state The AppStoreState.
 * @returns Object holding dateState and change callback methods.
 */
export const overviewInputSelector = (state: AppStoreState) => ({
  dateState: state.Expense.overview,
  setOverviewInput: state.Expense.setOverviewInput,
  setOverviewInputWithDay: state.Expense.setOverviewInputWithDay,
});

/**
 * dateSelector.
 * Selects the baseline Date object representing currently configured filter time.
 *
 * @param state The AppStoreState.
 * @returns The Date object.
 */
export const dateSelector = (state: AppStoreState) => state.Expense.date;

/**
 * todayDateSelector.
 * Computes and returns the current date in Indian Standard Time (IST).
 *
 * @param state The AppStoreState.
 * @returns Formatted IST date representation.
 */
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

/**
 * addExpenseSelector.
 * Selects the configuration for showing/hiding the add expense modal.
 *
 * @param state The AppStoreState.
 * @returns The modal status payload.
 */
export const addExpenseSelector = (state: AppStoreState) =>
  state.Expense.addExpense;

/**
 * setAddExpenseSelector.
 * Selects the action callback to toggle the add expense modal view.
 *
 * @param state The AppStoreState.
 * @returns The visibility toggle callback.
 */
export const setAddExpenseSelector = (state: AppStoreState) =>
  state.Expense.setAddExpense;
