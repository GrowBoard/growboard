import { AppStoreState } from '@store';

/**
 * plansSelector.
 * Selects the plan data and actions from the central store.
 *
 * @param state The AppStoreState.
 * @returns Object holding plansData and actions.
 */
export const plansSelector = (state: AppStoreState) => ({
  /**
   * The list of plans currently loaded.
   */
  plansData: state.Plans.plansData,
  /**
   * Timestamp when plans were last fetched from Google Sheets.
   */
  lastFetched: state.Plans.lastFetched,
  /**
   * Action trigger to update plans.
   */
  updatePlans: state.Plans.updatePlans,
  /**
   * Action trigger to clear plans.
   */
  removePlans: state.Plans.removePlans,
});

export default plansSelector;
