import { Alert } from '@chakra-ui/react';
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
  const { alertIconType } = getAlertType(type);
  return (
    <Alert.Root
      status={alertIconType as any}
      variant="subtle"
      borderRadius="md"
      p={3}
      my={2}
    >
      <Alert.Indicator>
        <AlertIcon type={alertIconType} />
      </Alert.Indicator>
      <Alert.Content>
        <Alert.Title>{title}</Alert.Title>
      </Alert.Content>
    </Alert.Root>
  );
};

export default AlertComponent;
