export type AlertState = {
  alertData: ToastAlertData;
};

interface AlertStateActions {
  showToastAlert: (alert: ToastAlertData) => void;
  hideToastAlert: () => void;
}

export type AlertStateSlice = AlertState & AlertStateActions;

export type ToastAlertData = {
  alertData: AlertComponentData;
  xPosition?: ToastXPosition;
  yPosition?: ToastYPosition;
  bounce?: boolean;
};

export type AlertComponentData = {
  title: string;
  type: AlertType;
};

export enum AlertType {
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export enum ToastXPosition {
  START = 'toast-start',
  CENTER = 'toast-center',
  END = 'toast-end',
}

export enum ToastYPosition {
  TOP = 'toast-top',
  CENTER = 'toast-center',
  BOTTOM = 'toast-bottom',
}
