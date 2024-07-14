import { ToastAlertData } from 'src/store/slice';
import { AppStoreState } from '@store';

export const alertSelector = (state: AppStoreState) => ({
  alertData: state.Alert.alertData,
  showAlertWithTimeout: (alertData: ToastAlertData, time = 1000) => {
    console.log('alertData', alertData);

    state.Alert.showToastAlert(alertData);
    setTimeout(() => {
      state.Alert.hideToastAlert();
    }, time);
  },
});
