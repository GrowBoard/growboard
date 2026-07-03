import { AppStoreSlice } from 'src/store/store';
import { LearningsStateSlice, LearningsState } from './types';

/**
 * Initial empty learnings state.
 */
const initialState: LearningsState = {
  learningsData: [],
};

/**
 * createLearningsSlice.
 * Initializes the state and action reducers for the learnings data slice.
 *
 * @param set Central store setter callback.
 * @returns The initialized slice object.
 */
export const createLearningsSlice: AppStoreSlice<LearningsStateSlice> = (
  set,
) => ({
  ...initialState,
  updateLearnings: (learnings) =>
    set((state) => {
      state.Learnings.learningsData = learnings;
    }),
  removeLearnings: () => {
    set((state) => {
      state.Learnings.learningsData = initialState.learningsData;
    });
  },
});

export default createLearningsSlice;
