import { AppStoreSlice } from '../../store';
import { PlansStateSlice, PlansState } from './types';

/**
 * The initial state configuration for the plans slice.
 */
const initialState: PlansState = {
  plansData: [],
  lastFetched: undefined,
};

/**
 * createPlansSlice.
 * Initializes the state slice and actions for plans data.
 *
 * @param set Central store setter callback.
 * @returns The plans state and actions slice.
 */
export const createPlansSlice: AppStoreSlice<PlansStateSlice> = (set) => ({
  ...initialState,
  updatePlans: (plans) =>
    set((state) => {
      state.Plans.plansData = plans;
      state.Plans.lastFetched = Date.now();
    }),
  removePlans: () => {
    set((state) => {
      state.Plans.plansData = initialState.plansData;
      state.Plans.lastFetched = undefined;
    });
  },
});

export default createPlansSlice;
