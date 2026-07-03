import { AppStoreState } from 'src/store/store';

/**
 * habitsSelector.
 * Selects habits state data and action triggers from the store.
 *
 * @param state The AppStoreState.
 * @returns Object holding habitsData, habitLogsData, and action triggers.
 */
export const habitsSelector = (state: AppStoreState) => ({
  /** The current list of habit definitions */
  habitsData: state.Habits.habitsData,
  /** The current list of daily habit log entries */
  habitLogsData: state.Habits.habitLogsData,
  /** Timestamp when habits were last fetched */
  lastFetchedHabits: state.Habits.lastFetchedHabits,
  /** Timestamp when habit logs were last fetched */
  lastFetchedLogs: state.Habits.lastFetchedLogs,
  /** Action trigger to replace the habits list */
  updateHabits: state.Habits.updateHabits,
  /** Action trigger to clear all habits */
  removeHabits: state.Habits.removeHabits,
  /** Action trigger to replace the habit logs list */
  updateHabitLogs: state.Habits.updateHabitLogs,
  /** Action trigger to clear all habit logs */
  removeHabitLogs: state.Habits.removeHabitLogs,
});

export default habitsSelector;
