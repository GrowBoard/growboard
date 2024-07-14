import { AlertType, ToastXPosition, ToastYPosition } from '@dash-ui';
import { ToastAlertData } from './types';

/**
 * Get the error alert data.
 *
 * @param title The title of the alert.
 * @returns The alert data.
 */
export function getSuccessAlertData(title: string): ToastAlertData {
  return {
    alertData: {
      title: title,
      type: AlertType.SUCCESS,
    },
    xPosition: ToastXPosition.END,
    yPosition: ToastYPosition.BOTTOM,
  };
}

/**
 * Get the error alert data.
 *
 * @param title The title of the alert.
 * @returns The alert data.
 */
export function getErrorAlertData(title: string): ToastAlertData {
  return {
    alertData: {
      title: title,
      type: AlertType.ERROR,
    },
    xPosition: ToastXPosition.END,
    yPosition: ToastYPosition.BOTTOM,
  };
}

/**
 * Get the info alert data.
 *
 * @param title The title of the alert.
 * @returns The alert data.
 */
export function getInfoAlertData(title: string): ToastAlertData {
  return {
    alertData: {
      title: title,
      type: AlertType.INFO,
    },
    xPosition: ToastXPosition.END,
    yPosition: ToastYPosition.BOTTOM,
  };
}

/**
 * Get the warning alert data.
 *
 * @param title The title of the alert.
 * @returns The alert data.
 */
export function getWarningAlertData(title: string): ToastAlertData {
  return {
    alertData: {
      title: title,
      type: AlertType.WARNING,
    },
    xPosition: ToastXPosition.END,
    yPosition: ToastYPosition.BOTTOM,
  };
}
