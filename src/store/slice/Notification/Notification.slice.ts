import { AppStoreSlice } from '@store';
import { NotificationState, NotificationStateSlice } from './types';

const initialState: NotificationState = {
  data: null,
};

const createNotificationSlice: AppStoreSlice<NotificationStateSlice> = (
  set,
) => ({
  ...initialState,
  showNotification: (notificationData) =>
    set((state) => {
      state.Notification.data = notificationData;
    }),
  hideNotification: () =>
    set((state) => {
      state.Notification.data = null;
    }),
});
export default createNotificationSlice;
