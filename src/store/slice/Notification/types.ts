export type NotificationData = {
  title: string;
  description: string;
  children?: React.ReactNode;
  onConfirm?: () => void;
};

export type NotificationState = {
  data: NotificationData | null;
};

export interface NotificationStateActions {
  showNotification: (notificationData: NotificationData) => void;
  hideNotification: () => void;
}

export type NotificationStateSlice = NotificationState &
  NotificationStateActions;
