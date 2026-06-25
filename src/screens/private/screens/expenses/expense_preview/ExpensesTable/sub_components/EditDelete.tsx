import { EditIcon, DeleteIcon } from '@assets';
import { IconButton, VStack } from '@chakra-ui/react';
import { TooltipComponent } from '@components';
import AddExpenseButton from './AddExpenseButton';
import { ExpenseType } from '../../types';

const AddEditDelete = ({
  expenseId,
  type,
  date,
}: {
  expenseId: string;
  type: ExpenseType;
  date: string;
}) => {
  return (
    <VStack alignItems={'end'} justifyContent={'end'} gap={1} h={'100%'}>
      <TooltipComponent title={'Add Expense'}>
        <AddExpenseButton date={date} type={type} />
      </TooltipComponent>
      <TooltipComponent title={'Edit'}>
        <IconButton
          aria-label="Edit"
          size={'xs'}
          variant={'outline'}
          colorScheme="cyan"
          mx={1}
        >
          <EditIcon />
        </IconButton>
      </TooltipComponent>
      <TooltipComponent title={'Delete'}>
        <IconButton
          aria-label="Delete"
          size={'xs'}
          variant={'outline'}
          colorScheme="red"
          mx={1}
        >
          <DeleteIcon />
        </IconButton>
      </TooltipComponent>
    </VStack>
  );
};

export default AddEditDelete;
