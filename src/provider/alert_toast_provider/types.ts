import { AlertComponentData, ToastXPosition, ToastYPosition } from '@dash-ui';

export type ToastAlertProviderProps = {
  children: React.ReactNode;
};

export type ToastAlertData = {
  alertData: AlertComponentData;
  xPosition?: ToastXPosition;
  yPosition?: ToastYPosition;
  bounce?: boolean;
};
