import { AppStoreSlice } from '../../store';
import { PlansStateSlice, PlansState } from './types';

/**
 * The initial state configuration for the plans slice.
 */
const initialState: PlansState = {
  plansData: [],
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
    }),
  removePlans: () => {
    set((state) => {
      state.Plans.plansData = initialState.plansData;
    });
  },
});

export default createPlansSlice;
