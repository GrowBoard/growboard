import { NOTIFICATION_MODAL_ID } from './constants';
import { NotificationButtonProps } from './types';

/**
 * Notification button component.
 *
 * @param props  The notification button props.
 * @returns The notification button component.
 */
function NotificationButton(props: NotificationButtonProps) {
  return (
    <div>
      <label
        htmlFor={NOTIFICATION_MODAL_ID}
        className={`btn ${props.buttonType} ${
          props.isButtonOutline ? 'btn-outline' : ''
        }`}
        onClick={props.onClickHandler}
      >
        {props.buttonText}
      </label>
    </div>
  );
}

export default NotificationButton;
