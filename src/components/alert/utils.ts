import { AlertType } from './component';
import { AlertData } from './types';

export function getAlertType(type: AlertType): AlertData {
  switch (type) {
    case AlertType.SUCCESS:
      return {
        typeString: 'alert-success',
        alertIconType: AlertType.SUCCESS,
      };
    case AlertType.INFO:
      return { typeString: 'alert-info', alertIconType: AlertType.INFO };
    case AlertType.WARNING:
      return {
        typeString: 'alert-warning',
        alertIconType: AlertType.WARNING,
      };
    case AlertType.ERROR:
      return {
        typeString: 'alert-error',
        alertIconType: AlertType.ERROR,
      };
  }
}
