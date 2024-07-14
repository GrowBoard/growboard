import { AlertComponent } from '../alert';
import { ToastAlertComponentProps } from './types';

const ToastAlertComponent = ({
  alertComponentData,
  bounce,
  xPosition,
  yPosition,
}: ToastAlertComponentProps) => {
  return alertComponentData.title === '' ? (
    <></>
  ) : (
    <div
      className={`toast z-50 ${
        bounce !== null && !bounce ? '' : 'animate-bounce'
      } ${xPosition ? xPosition : ''} ${yPosition ? yPosition : ''}`}
    >
      <AlertComponent
        title={alertComponentData.title}
        type={alertComponentData.type}
      />
    </div>
  );
};

export default ToastAlertComponent;
