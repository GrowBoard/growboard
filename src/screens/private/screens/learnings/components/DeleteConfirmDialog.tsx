import { useTranslation } from 'react-i18next';
import { Button, HStack, Text, VStack } from '@chakra-ui/react';
import { DialogContainer } from '@components';
import { DeleteConfirmDialogProps } from '../types';

/**
 * DeleteConfirmDialog renders a simple Yes/No confirmation dialog modal
 * for deleting a learning item.
 */
export const DeleteConfirmDialog = ({
  isOpen,
  onOpenChange,
  itemTitle,
  onConfirm,
  isDeleting,
}: DeleteConfirmDialogProps) => {
  const { t } = useTranslation();

  return (
    <DialogContainer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={t('Learnings.deleteConfirmTitle', 'Confirm Deletion')}
      maxW="md"
      footer={
        <HStack gap={4} justify="flex-end" w="full">
          <Button
            variant="ghost"
            onClick={() => onOpenChange({ open: false })}
            disabled={isDeleting}
            color="text.secondary"
            borderRadius="lg"
            px={5}
            _hover={{ bg: 'bg.active' }}
          >
            {t('Learnings.cancel', 'Cancel')}
          </Button>
          <Button
            onClick={onConfirm}
            loading={isDeleting}
            bg="red.600"
            color="white"
            fontWeight="bold"
            px={6}
            shadow="lg"
            transition="all 0.2s"
            _hover={{
              bg: 'red.500',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)',
            }}
            _active={{ bg: 'red.700', transform: 'translateY(0)' }}
            borderRadius="lg"
          >
            {t('Learnings.delete', 'Delete')}
          </Button>
        </HStack>
      }
    >
      <VStack gap={3} align="flex-start" py={2}>
        <Text fontSize="sm" color="text.primary">
          {t(
            'Learnings.deleteConfirmDesc',
            'Are you sure you want to delete the learning "{{title}}"? This action cannot be undone.',
            { title: itemTitle },
          )}
        </Text>
        <Text fontSize="md" fontWeight="bold" color="red.500" lineBreak="anywhere">
          {itemTitle}
        </Text>
      </VStack>
    </DialogContainer>
  );
};

export default DeleteConfirmDialog;
