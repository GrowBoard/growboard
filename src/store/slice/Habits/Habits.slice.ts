import { AppStoreSlice } from '../../store/types';
import { HabitsStateSlice, HabitsState } from './types';

/**
 * Initial empty habits state.
 */
const initialState: HabitsState = {
  habitsData: [],
  habitLogsData: [],
  lastFetchedHabits: undefined,
  lastFetchedLogs: undefined,
};

/**
 * createHabitsSlice.
 * Initializes the state and action reducers for the habits data slice.
 *
 * @param set Central store setter callback.
 * @returns The initialized slice object.
 */
export const createHabitsSlice: AppStoreSlice<HabitsStateSlice> = (set) => ({
  ...initialState,
  updateHabits: (habits) =>
    set((state) => {
      state.Habits.habitsData = habits;
      state.Habits.lastFetchedHabits = Date.now();
    }),
  removeHabits: () =>
    set((state) => {
      state.Habits.habitsData = initialState.habitsData;
      state.Habits.lastFetchedHabits = undefined;
    }),
  updateHabitLogs: (logs) =>
    set((state) => {
      state.Habits.habitLogsData = logs;
      state.Habits.lastFetchedLogs = Date.now();
    }),
  removeHabitLogs: () =>
    set((state) => {
      state.Habits.habitLogsData = initialState.habitLogsData;
      state.Habits.lastFetchedLogs = undefined;
    }),
});

export default createHabitsSlice;
