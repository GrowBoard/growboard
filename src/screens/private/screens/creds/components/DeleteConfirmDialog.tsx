import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { VStack, Box, Text, Input, Button } from '@chakra-ui/react';
import { DialogContainer } from '@components';
import { DeleteConfirmDialogProps } from './types';

/**
 * DeleteConfirmDialog component prompts the user to confirm deleting a credential,
 * requiring them to type the exact title to enable the confirm button.
 */
const DeleteConfirmDialog = ({
  isOpen,
  onOpenChange,
  targetTitle,
  onConfirm,
  isSaving,
}: DeleteConfirmDialogProps) => {
  const { t } = useTranslation();
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');

  // Clear confirm input whenever dialog is opened
  useEffect(() => {
    if (isOpen) {
      setDeleteConfirmInput('');
    }
  }, [isOpen]);

  const isDisabled = deleteConfirmInput !== targetTitle;

  return (
    <DialogContainer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      role="alertdialog"
      maxW="xl"
      title={
        <Text color="red.500">
          {t('Credentials.deleteConfirmTitle', 'Confirm Deletion')}
        </Text>
      }
      footer={
        <>
          <Button
            variant="outline"
            size="sm"
            px={2}
            borderColor="border.emphasized"
            color="text.secondary"
            _hover={{ bg: 'bg.active' }}
            onClick={() => onOpenChange({ open: false })}
          >
            {t('Credentials.cancel', 'Cancel')}
          </Button>
          <Button
            onClick={onConfirm}
            bg="red.600"
            color="white"
            size="sm"
            px={2}
            fontWeight="semibold"
            _hover={{
              bg: 'red.500',
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)',
            }}
            _active={{ bg: 'red.700' }}
            loading={isSaving}
            disabled={isDisabled}
          >
            {t('Credentials.delete', 'Delete')}
          </Button>
        </>
      }
    >
      <VStack align="stretch" gap={4}>
        <Text fontSize="sm" color="text.primary">
          {t('Credentials.deleteConfirmDesc', {
            title: targetTitle,
            defaultValue: `Are you sure you want to delete this credential? This action cannot be undone.`,
          })}
        </Text>

        <Box>
          <Text fontSize="xs" fontWeight="semibold" color="red.300" mb={2}>
            {t('Credentials.deleteConfirmInstruction', {
              title: targetTitle,
              defaultValue: 'Type the credential title to confirm:',
            })}
          </Text>
          <Input
            placeholder={t(
              'Credentials.deleteConfirmInputPlaceholder',
              'Type title here',
            )}
            value={deleteConfirmInput}
            onChange={(e) => setDeleteConfirmInput(e.target.value)}
            bg="bg.card"
            p={3}
            border="1px solid"
            borderColor="border.subtle"
            _focus={{ borderColor: 'red.500', boxShadow: 'none' }}
            borderRadius="md"
            color="text.primary"
          />
        </Box>
      </VStack>
    </DialogContainer>
  );
};

export default DeleteConfirmDialog;
