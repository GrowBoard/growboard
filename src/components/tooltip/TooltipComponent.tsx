import { Tooltip } from '@chakra-ui/react';
import { TooltipComponentProps } from './types';

const TooltipComponent = ({ title, children }: TooltipComponentProps) => {
  return (
    <Tooltip label={title} hasArrow placement="top">
      {children}
    </Tooltip>
  );
};

export default TooltipComponent;
