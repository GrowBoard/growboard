import { AppStoreState } from 'src/store/store';

export const notificationSelector = (state: AppStoreState) => ({
  notificationData: state.Notification.data,
  showNotification: state.Notification.showNotification,
  hideNotification: state.Notification.hideNotification,
});
