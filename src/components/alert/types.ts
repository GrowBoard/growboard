import { AlertType } from './component';

export type AlertComponentData = {
  title: string;
  type: AlertType;
};

export type AlertData = {
  typeString: string;
  alertIconType: AlertType;
};
