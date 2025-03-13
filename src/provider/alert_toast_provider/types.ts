import {
  AlertComponentData,
  ToastXPosition,
  ToastYPosition,
} from '@components';

export type ToastAlertProviderProps = {
  children: React.ReactNode;
};

export type ToastAlertData = {
  alertData: AlertComponentData;
  xPosition?: ToastXPosition;
  yPosition?: ToastYPosition;
  bounce?: boolean;
};
