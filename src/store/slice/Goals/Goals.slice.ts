import { AppStoreSlice } from 'src/store/store';
import { GoalsStateSlice, GoalsState } from './types';

/**
 * Initial empty goals state.
 */
const initialState: GoalsState = {
  goalsData: [],
  lastFetched: undefined,
};

/**
 * createGoalsSlice.
 * Initializes the state and action reducers for the goals data slice.
 *
 * @param set Central store setter callback.
 * @returns The initialized slice object.
 */
export const createGoalsSlice: AppStoreSlice<GoalsStateSlice> = (set) => ({
  ...initialState,
  updateGoals: (goals) =>
    set((state) => {
      state.Goals.goalsData = goals;
      state.Goals.lastFetched = Date.now();
    }),
  removeGoals: () => {
    set((state) => {
      state.Goals.goalsData = initialState.goalsData;
      state.Goals.lastFetched = undefined;
    });
  },
});

export default createGoalsSlice;
