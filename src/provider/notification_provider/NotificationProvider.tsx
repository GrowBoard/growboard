import { NotificationComponent } from '@dash-ui';
import { NotificationProviderProps } from './types';

const NotificationProvider = (props: NotificationProviderProps) => {
  return (
    <div>
      <NotificationComponent />
      {props.children}
    </div>
  );
};

export default NotificationProvider;
