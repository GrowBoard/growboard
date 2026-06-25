import { Tooltip, Portal } from '@chakra-ui/react';
import { TooltipComponentProps } from './types';

const TooltipComponent = ({ title, children }: TooltipComponentProps) => {
  return (
    <Tooltip.Root positioning={{ placement: 'top' }}>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content
            bg="bg.card"
            color="text.primary"
            px={3}
            py={1.5}
            borderRadius="md"
            fontSize="xs"
            shadow="md"
            border="1px solid"
            borderColor="border.subtle"
          >
            <Tooltip.Arrow />
            {title}
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  );
};

export default TooltipComponent;
