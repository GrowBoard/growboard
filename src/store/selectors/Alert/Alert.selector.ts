import { ToastAlertData } from 'src/store/slice';
import { AppStoreState } from '@store';

/**
 * alertSelector.
 * Selects the alert state from the store and provides a method to show alerts that automatically timeout.
 *
 * @param state The current AppStoreState.
 * @returns An object containing the alertData and a showAlertWithTimeout action.
 */
export const alertSelector = (state: AppStoreState) => ({
  /**
   * The active toast alert data.
   */
  alertData: state.Alert.alertData,
  /**
   * Triggers a toast alert displaying it for the specified timeout duration.
   *
   * @param alertData The toast configuration object.
   * @param time Optional display duration limit in milliseconds (default: 1000).
   */
  showAlertWithTimeout: (alertData: ToastAlertData, time = 1000) => {
    console.log('alertData', alertData);

    state.Alert.showToastAlert(alertData);
    setTimeout(() => {
      state.Alert.hideToastAlert();
    }, time);
  },
});
export default alertSelector;
