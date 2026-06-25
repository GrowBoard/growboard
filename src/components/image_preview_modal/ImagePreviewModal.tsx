import { Dialog, Portal } from '@chakra-ui/react';
import { ImagePreviewModalProps } from './types';
import { appStore } from '@store';
import { imageModalSelector, useShallow } from '@selectors';

/**
 * Image modal component.
 *
 * @param props  The image modal props.
 * @returns The image modal component.
 */
const ImagePreviewModal = ({ image }: ImagePreviewModalProps) => {
  const { setImageString } = appStore(useShallow(imageModalSelector));
  const isOpen = !!image;

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e: any) => {
        if (!e.open) setImageString('');
      }}
      size="lg"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="70vw"
            p={4}
            borderRadius="lg"
            bg="gray.800"
            border="1px solid"
            borderColor="gray.700"
          >
            <Dialog.CloseTrigger
              position="absolute"
              top={4}
              right={4}
              color="white"
            />
            <Dialog.Body
              display="flex"
              justifyContent="center"
              alignItems="center"
              p={4}
            >
              <img
                src={image}
                alt="preview"
                loading="lazy"
                style={{
                  borderRadius: '8px',
                  objectFit: 'contain',
                  width: '100%',
                  maxHeight: '80vh',
                }}
              />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ImagePreviewModal;
