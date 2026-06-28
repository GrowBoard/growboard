import { AppStoreState } from 'src/store/store';

/**
 * credsSelector.
 * Selects credentials state data and action triggers from the store.
 *
 * @param state The AppStoreState.
 * @returns Object holding credsData, updateCreds action, and removeCreds action.
 */
export const credsSelector = (state: AppStoreState) => ({
  /**
   * The current list of credentials.
   */
  credsData: state.Creds.credsData,
  /**
   * Action trigger to modify/update current credentials.
   */
  updateCreds: state.Creds.updateCreds,
  /**
   * Action trigger to purge/clear all credentials.
   */
  removeCreds: state.Creds.removeCreds,
});

export default credsSelector;
