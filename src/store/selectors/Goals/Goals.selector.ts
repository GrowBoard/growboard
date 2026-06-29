import { AppStoreState } from 'src/store/store';

/**
 * goalsSelector.
 * Selects goals state data and action triggers from the store.
 *
 * @param state The AppStoreState.
 * @returns Object holding goalsData, updateGoals action, and removeGoals action.
 */
export const goalsSelector = (state: AppStoreState) => ({
  /**
   * The current list of goals.
   */
  goalsData: state.Goals.goalsData,
  /**
   * Action trigger to modify/update current goals.
   */
  updateGoals: state.Goals.updateGoals,
  /**
   * Action trigger to purge/clear all goals.
   */
  removeGoals: state.Goals.removeGoals,
});

export default goalsSelector;
