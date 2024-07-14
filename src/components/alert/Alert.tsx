import React from 'react';
import { AlertComponentData as AlertComponentProps } from './types';
import { AlertIcon } from './component';
import { getAlertType } from './utils';

/**
 * Alert component.
 *
 * @param props  The alert component data.
 * @returns The alert component.
 */
const AlertComponent = ({ title, type }: AlertComponentProps) => {
  const { typeString, alertIconType } = getAlertType(type);
  return (
    <div role="alert" className={`alert ${typeString}`}>
      <AlertIcon type={alertIconType} />
      <span>{title}</span>
    </div>
  );
};

export default AlertComponent;
