import { AppStoreSlice } from 'src/store/store';
import { CredsStateSlice, CredsState } from './types';

/**
 * Initial empty credentials state.
 */
const initialState: CredsState = {
  credsData: [],
};

/**
 * createCredsSlice.
 * Initializes the state and action reducers for the credentials data slice.
 *
 * @param set Central store setter callback.
 * @returns The initialized slice object.
 */
export const createCredsSlice: AppStoreSlice<CredsStateSlice> = (set) => ({
  ...initialState,
  updateCreds: (creds) =>
    set((state) => {
      state.Creds.credsData = creds;
    }),
  removeCreds: () => {
    set((state) => {
      state.Creds.credsData = initialState.credsData;
    });
  },
});

export default createCredsSlice;
