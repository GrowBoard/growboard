import { NotificationButton, NotificationButtonType } from '@dash-ui';
import { getErrorAlertData } from '@provider';
import { NotificationData, appStore } from '@store';
import { alertSelector, notificationSelector, useShallow } from '@selectors';

/**
 * Interface definition for the dashboard home props.
 */
interface IDashboardHomeProps {}

/**
 * Component definition for the dashboard home component.
 * @param props The props for the dashboard home component.
 * @returns The dashboard home component.
 */
function DashboardHome(props: IDashboardHomeProps) {
  const { showNotification } = appStore(useShallow(notificationSelector));
  const { showAlertWithTimeout } = appStore(useShallow(alertSelector));
  const notificationData: NotificationData = {
    title: 'Notification',
    description: 'This is a notification data',
  };

  const clickHandler = () => {
    showAlertWithTimeout(getErrorAlertData('Error'), 3000);
    showNotification(notificationData);
  };

  return (
    <div className="p-2">
      <div className="card shadow-lg compact side bg-base-100">
        <div className="card-body">
          <h2 className="card-title">Card Title</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            necessitatibus incidunt ut officiis explicabo inventore.
          </p>
          <div className="justify-end card-actions">
            <NotificationButton
              buttonText="Notification"
              onClickHandler={clickHandler}
              buttonType={NotificationButtonType.SUCCESS}
              isButtonOutline={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the dashboard home component.
export default DashboardHome;
export type { IDashboardHomeProps };
