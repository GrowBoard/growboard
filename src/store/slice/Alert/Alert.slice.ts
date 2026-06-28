import { AppStoreSlice } from '@store';
import {
  AlertState,
  AlertStateSlice,
  AlertType,
  ToastAlertData,
  ToastXPosition,
  ToastYPosition,
} from './types';

/**
 * The initial state configuration for the alert slice.
 */
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

/**
 * createAlertSlice.
 * Initializes the state and action reducers for managing toast alerts.
 *
 * @param set Central store setter callback.
 * @returns The alert state and actions slice.
 */
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
