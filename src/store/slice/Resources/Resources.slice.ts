import { AppStoreSlice } from 'src/store/store';
import { ResourcesStateSlice, ResourcesState } from './types';

/**
 * Initial empty resources state.
 */
const initialState: ResourcesState = {
  resourcesData: [],
};

/**
 * createResourcesSlice.
 * Initializes the state and actions for the resources slice.
 *
 * @param set Central store setter callback.
 * @returns The initialized slice object.
 */
export const createResourcesSlice: AppStoreSlice<ResourcesStateSlice> = (
  set,
) => ({
  ...initialState,
  updateResources: (resources) =>
    set((state) => {
      state.Resources.resourcesData = resources;
    }),
  removeResources: () => {
    set((state) => {
      state.Resources.resourcesData = initialState.resourcesData;
    });
  },
});

export default createResourcesSlice;
