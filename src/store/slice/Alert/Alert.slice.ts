import { AppStoreSlice } from '@store';
import {
  AlertState,
  AlertStateSlice,
  AlertType,
  ToastAlertData,
  ToastXPosition,
  ToastYPosition,
} from './types';

const initialState: AlertState = {
  alertData: {
    alertData: {
      title: '',
      type: AlertType.INFO,
    },
    xPosition: ToastXPosition.START,
    yPosition: ToastYPosition.BOTTOM,
    bounce: false,
  },
};

const createAlertSlice: AppStoreSlice<AlertStateSlice> = (set) => ({
  ...initialState,
  showToastAlert: (alertData: ToastAlertData) =>
    set((state) => {
      state.Alert.alertData = alertData;
    }),
  hideToastAlert: () =>
    set((state) => {
      state.Alert.alertData = initialState.alertData;
    }),
});

export default createAlertSlice;
