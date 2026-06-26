import { useState } from 'react';
import { EditIcon, DeleteIcon } from '@assets';
import { IconButton, HStack, Dialog, Button, Portal } from '@chakra-ui/react';
import { TooltipComponent } from '@components';
import { ExpenseType } from '../../types';
import { useShallow, setAddExpenseSelector } from '@selectors';
import { appStore } from '@store';
import { useDeleteExpenseData } from '@services/hooks/private';

const EditDelete = ({
  expenseId,
  type,
  date,
}: {
  expenseId: string;
  type: ExpenseType;
  date: string;
}) => {
  const setAddExpense = appStore(useShallow(setAddExpenseSelector));
  const { mutateAsync: deleteExpense, isPending: isDeleting } =
    useDeleteExpenseData();
  const [open, setOpen] = useState(false);

  const handleEditClick = () => {
    setAddExpense(true, type, date, expenseId);
  };

  const handleDeleteClick = () => {
    setOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteExpense({ expenseId, dateStr: date });
      setOpen(false);
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  return (
    <>
      <HStack gap={2} justifyContent="flex-end">
        <TooltipComponent title={'Edit'}>
          <IconButton
            aria-label="Edit"
            size={'xs'}
            variant={'subtle'}
            colorPalette="cyan"
            borderRadius="md"
            _hover={{
              bg: 'cyan.600',
              color: 'white',
              transform: 'scale(1.08)',
            }}
            transition="all 0.2s ease"
            onClick={handleEditClick}
          >
            <EditIcon />
          </IconButton>
        </TooltipComponent>
        <TooltipComponent title={'Delete'}>
          <IconButton
            aria-label="Delete"
            size={'xs'}
            variant={'subtle'}
            colorPalette="red"
            borderRadius="md"
            _hover={{
              bg: 'red.600',
              color: 'white',
              transform: 'scale(1.08)',
            }}
            transition="all 0.2s ease"
            loading={isDeleting}
            onClick={handleDeleteClick}
          >
            <DeleteIcon />
          </IconButton>
        </TooltipComponent>
      </HStack>

      <Dialog.Root
        open={open}
        onOpenChange={(e: any) => setOpen(e.open)}
        role="alertdialog"
        placement="center"
      >
        <Portal>
          <Dialog.Backdrop bg="rgba(0, 0, 0, 0.7)" backdropFilter="blur(6px)" />
          <Dialog.Positioner>
            <Dialog.Content
              bg="rgba(12, 14, 18, 0.95)"
              backdropFilter="blur(32px) saturate(1.2)"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.08)"
              borderRadius="xl"
              boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
              p={5}
              maxW="md"
            >
              <Dialog.Header
                pb={3}
                borderBottom="1px solid"
                borderColor="rgba(255, 255, 255, 0.06)"
              >
                <Dialog.Title fontSize="lg" fontWeight="bold" color="white">
                  Delete Expense
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body py={5} color="gray.300" fontSize="sm">
                Are you sure you want to delete this expense? This action cannot
                be undone.
              </Dialog.Body>
              <Dialog.Footer
                pt={4}
                borderTop="1px solid"
                borderColor="rgba(255, 255, 255, 0.06)"
                gap={3}
              >
                <Button
                  variant="outline"
                  size="sm"
                  borderColor="rgba(255, 255, 255, 0.12)"
                  color="gray.300"
                  _hover={{
                    bg: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.24)',
                  }}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  bg="red.600"
                  color="white"
                  size="sm"
                  px={5}
                  fontWeight="semibold"
                  _hover={{
                    bg: 'red.500',
                    boxShadow: '0 0 12px rgba(239, 68, 68, 0.4)',
                  }}
                  _active={{ bg: 'red.700' }}
                  loading={isDeleting}
                  onClick={handleConfirmDelete}
                >
                  Delete
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default EditDelete;
