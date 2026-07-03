import { useTranslation } from 'react-i18next';
import { Button, HStack, Text, VStack } from '@chakra-ui/react';
import { DialogContainer } from '@components';
import { DeleteConfirmDialogProps } from './types';

/**
 * DeleteConfirmDialog renders a simple Yes/No confirmation dialog modal
 * for deleting a goal item.
 */
export const DeleteConfirmDialog = ({
  isOpen,
  onOpenChange,
  targetTitle,
  onConfirm,
  isSaving,
}: DeleteConfirmDialogProps) => {
  const { t } = useTranslation();

  return (
    <DialogContainer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={t('Goals.deleteConfirmationTitle', 'Confirm Deletion')}
      maxW="md"
      footer={
        <HStack gap={4} justify="flex-end" w="full">
          <Button
            variant="ghost"
            onClick={() => onOpenChange({ open: false })}
            disabled={isSaving}
            color="text.secondary"
            borderRadius="lg"
            px={5}
            _hover={{ bg: 'bg.active' }}
          >
            {t('Goals.no', 'No')}
          </Button>
          <Button
            onClick={onConfirm}
            loading={isSaving}
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
            {t('Goals.yes', 'Yes')}
          </Button>
        </HStack>
      }
    >
      <VStack gap={3} align="flex-start" py={2}>
        <Text fontSize="sm" color="text.primary">
          {t(
            'Goals.deleteConfirmationMessage',
            'Are you sure you want to delete this goal? This action is permanent and cannot be undone.',
          )}
        </Text>
        <Text
          fontSize="md"
          fontWeight="bold"
          color="red.500"
          lineBreak="anywhere"
        >
          {targetTitle}
        </Text>
      </VStack>
    </DialogContainer>
  );
};

export default DeleteConfirmDialog;
