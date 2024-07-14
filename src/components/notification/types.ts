/**
 * The notification button props.
 * @param buttonText The text of the button.
 * @param onClickHandler The on click handler of the button.
 * @param buttonType The button type.
 * @param isButtonOutline The button outline.
 */
export type NotificationButtonProps = {
  buttonText: string;
  onClickHandler: () => void;
  buttonType?: NotificationButtonType;
  isButtonOutline?: boolean;
};

/**
 * Type definition for the notification provider props.
 *
 * @param title The title of the notification.
 * @param description The description of the notification.
 * @param children The children of the notification.
 * @param onConfirm The on confirm callback.
 */
export type NotificationData = {
  title: string;
  description: string;
  children?: React.ReactNode;
  onConfirm?: () => void;
};

export enum NotificationButtonType {
  PRIMARY = 'btn-primary',
  SECONDARY = 'btn-secondary',
  SUCCESS = 'btn-success',
  DANGER = 'btn-danger',
  WARNING = 'btn-warning',
  INFO = 'btn-info',
  LIGHT = 'btn-light',
  DARK = 'btn-dark',
  LINK = 'btn-link',
}
