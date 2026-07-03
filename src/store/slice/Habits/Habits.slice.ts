import { AppStoreSlice } from 'src/store/store';
import { HabitsStateSlice, HabitsState } from './types';

/**
 * Initial empty habits state.
 */
const initialState: HabitsState = {
  habitsData: [],
  habitLogsData: [],
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
    }),
  removeHabits: () =>
    set((state) => {
      state.Habits.habitsData = initialState.habitsData;
    }),
  updateHabitLogs: (logs) =>
    set((state) => {
      state.Habits.habitLogsData = logs;
    }),
  removeHabitLogs: () =>
    set((state) => {
      state.Habits.habitLogsData = initialState.habitLogsData;
    }),
});

export default createHabitsSlice;
