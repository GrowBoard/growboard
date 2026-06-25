import { AddIcon } from '@assets';
import { IconButton } from '@chakra-ui/react';
import { useShallow, setAddExpenseSelector } from '@selectors';
import { appStore } from '@store';
import { ExpenseType } from '../../types';

const AddExpenseButton = ({
  date,
  type,
}: {
  date: string;
  type: ExpenseType;
}) => {
  const setAddExpense = appStore(useShallow(setAddExpenseSelector));
  return (
    <IconButton
      aria-label="Add expense"
      size={'xs'}
      variant={'outline'}
      colorScheme="cyan"
      mx={1}
      onClick={() => setAddExpense(true, type, date)}
    >
      <AddIcon />
    </IconButton>
  );
};

export default AddExpenseButton;
