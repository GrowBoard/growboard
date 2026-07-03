import { AppStoreState } from 'src/store/store';

/**
 * learningsSelector.
 * Selects learnings state data and action triggers from the store.
 *
 * @param state The AppStoreState.
 * @returns Object holding learningsData, updateLearnings action, and removeLearnings action.
 */
export const learningsSelector = (state: AppStoreState) => ({
  /**
   * The current list of learnings.
   */
  learningsData: state.Learnings.learningsData,
  /**
   * Timestamp when learnings were last fetched from Google Drive.
   */
  lastFetched: state.Learnings.lastFetched,
  /**
   * Action trigger to modify/update current learnings.
   */
  updateLearnings: state.Learnings.updateLearnings,
  /**
   * Action trigger to purge/clear all learnings.
   */
  removeLearnings: state.Learnings.removeLearnings,
});

export default learningsSelector;
