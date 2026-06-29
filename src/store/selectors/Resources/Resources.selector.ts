import { AppStoreState } from 'src/store/store';

/**
 * resourcesSelector.
 * Selects resources state data and action triggers from the store.
 *
 * @param state The AppStoreState.
 * @returns Object holding resourcesData, updateResources action, and removeResources action.
 */
export const resourcesSelector = (state: AppStoreState) => ({
  /**
   * The current list of resources.
   */
  resourcesData: state.Resources.resourcesData,
  /**
   * Action trigger to modify/update current resources.
   */
  updateResources: state.Resources.updateResources,
  /**
   * Action trigger to purge/clear all resources.
   */
  removeResources: state.Resources.removeResources,
});

export default resourcesSelector;
