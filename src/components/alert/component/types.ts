export enum AlertType {
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export type AlertIconProps = {
  type: AlertType;
};
