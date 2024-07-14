import { AlertComponentData } from '@dash-ui';

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

export type ToastAlertComponentProps = {
  alertComponentData: AlertComponentData;
  xPosition?: ToastXPosition;
  yPosition?: ToastYPosition;
  bounce?: boolean;
};
