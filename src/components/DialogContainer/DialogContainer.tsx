import { Dialog, Portal } from '@chakra-ui/react';
import { DialogContainerProps } from './types';

/**
 * Reusable Dialog Container component wrapping Chakra UI v3 Dialog modules.
 * Standardizes layout grids, blur backdrops, dark styles, and custom max-widths.
 *
 * @param props DialogContainerProps component properties.
 */
export const DialogContainer = ({
  isOpen,
  onOpenChange,
  title,
  children,
  footer,
  role = 'dialog',
  maxW = 'lg',
}: DialogContainerProps) => {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={onOpenChange}
      role={role}
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop bg="rgba(0, 0, 0, 0.7)" backdropFilter="blur(6px)" />
        <Dialog.Positioner>
          <Dialog.Content
            bg="rgba(18, 20, 22, 0.98)"
            border="1px solid"
            borderColor="border.subtle"
            borderRadius="xl"
            boxShadow="2xl"
            p={6}
            maxW={maxW}
            w="95vw"
          >
            {title && (
              <Dialog.Header
                pb={3}
                borderBottom="1px solid"
                borderColor="rgba(255, 255, 255, 0.06)"
              >
                <Dialog.Title
                  fontSize="lg"
                  fontWeight="bold"
                  color="text.primary"
                >
                  {title}
                </Dialog.Title>
              </Dialog.Header>
            )}

            <Dialog.Body pt={title ? 4 : 0}>{children}</Dialog.Body>

            {footer && (
              <Dialog.Footer
                mt={6}
                pt={3}
                borderTop="1px solid"
                borderColor="rgba(255, 255, 255, 0.06)"
              >
                {footer}
              </Dialog.Footer>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
