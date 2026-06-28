import { LuPlus } from 'react-icons/lu';
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
      mx={1}
      onClick={() => setAddExpense(true, type, date)}
      border="1px solid"
      borderColor="border.input"
      color="text.secondary"
      _hover={{
        bg: 'bg.active',
        borderColor: 'border.focus',
        color: 'text.primary',
      }}
    >
      <LuPlus />
    </IconButton>
  );
};

export default AddExpenseButton;
