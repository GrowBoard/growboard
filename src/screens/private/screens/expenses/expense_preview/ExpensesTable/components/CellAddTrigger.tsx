import { useState } from 'react';
import { Text } from '@chakra-ui/react';
import { ExpenseType } from '../../types';
import { appStore } from '@store';
import { useShallow, setAddExpenseSelector } from '@selectors';

const CellAddTrigger = ({
  date,
  type,
}: {
  date: string;
  type: ExpenseType;
}) => {
  const setAddExpense = appStore(useShallow(setAddExpenseSelector));
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Text
      fontSize={'xs'}
      color="text.muted"
      py={0.5}
      transition="all 0.15s ease-in-out"
      cursor="pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setAddExpense(true, type, date)}
      _hover={{
        bg: 'indigo.500/10',
        color: 'indigo.400',
        fontWeight: 'semibold',
      }}
    >
      {isHovered ? '+ Add' : '—'}
    </Text>
  );
};

export default CellAddTrigger;
