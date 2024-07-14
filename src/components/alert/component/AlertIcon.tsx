import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from '@assets';
import { AlertIconProps } from './types';

const AlertIcon = ({ type }: AlertIconProps) => {
  switch (type) {
    case 'error':
      return <ErrorIcon />;
    case 'info':
      return <InfoIcon />;
    case 'success':
      return <SuccessIcon />;
    case 'warning':
      return <WarningIcon />;
    default:
      return <></>;
  }
};

export default AlertIcon;
