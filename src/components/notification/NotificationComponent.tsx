import { NOTIFICATION_MODAL_ID } from './constants';
import { useTranslation } from 'react-i18next';
import { appStore } from '@store';
import { notificationSelector, useShallow } from '@selectors';

/**
 * Component definition for the notification component.
 * @returns The notification component.
 */
const NotificationComponent = () => {
  const { t } = useTranslation();
  const { notificationData } = appStore(useShallow(notificationSelector));

  return (
    notificationData && (
      <div className="z-50">
        <input
          type="checkbox"
          id={NOTIFICATION_MODAL_ID}
          className="modal-toggle"
        />
        <div className="modal" role="dialog">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{notificationData.title}</h3>
            <p className="pt-4">{notificationData.description}</p>
            {notificationData.children}
            <div className="modal-action flex flex-row justify-end">
              {notificationData.onConfirm && (
                <div className="modal-action">
                  <label
                    htmlFor={NOTIFICATION_MODAL_ID}
                    className="btn btn-success btn-outline"
                    onClick={notificationData?.onConfirm}
                  >
                    {t('Notification.confirm')}
                  </label>
                </div>
              )}
              <div className="modal-action ">
                <label
                  htmlFor={NOTIFICATION_MODAL_ID}
                  className="btn btn-error btn-outline"
                >
                  {t('Notification.close')}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default NotificationComponent;
