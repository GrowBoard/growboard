import { useState } from 'react';
import { LuPencil, LuTrash2 } from 'react-icons/lu';
import { IconButton, HStack, Button } from '@chakra-ui/react';
import { TooltipComponent, DialogContainer } from '@components';
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
            <LuPencil />
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
            <LuTrash2 />
          </IconButton>
        </TooltipComponent>
      </HStack>

      <DialogContainer
        isOpen={open}
        onOpenChange={(e: { open: boolean }) => setOpen(e.open)}
        role="alertdialog"
        maxW="md"
        title="Delete Expense"
        footer={
          <>
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
          </>
        }
      >
        Are you sure you want to delete this expense? This action cannot be
        undone.
      </DialogContainer>
    </>
  );
};

export default EditDelete;
