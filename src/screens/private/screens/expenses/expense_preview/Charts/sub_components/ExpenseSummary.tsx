import { Divider, Text, VStack } from '@chakra-ui/react';
import { ExpenseSummaryProps } from './types';
import { ExpenseType } from '../../types';
import { appStore } from '@store';
import { timeWindowSelector, useShallow } from '@selectors';

const EXPENSES_BY_CATEGORY = Object.keys(ExpenseType).reduce(
  (acc, category) => ({
    ...acc,
    [category]: Math.floor(Math.random() * 10000),
  }),
  {} as Record<ExpenseType, number>,
);

const ExpenseSummary = ({
  expenseByCategory = EXPENSES_BY_CATEGORY,
}: ExpenseSummaryProps) => {
  const timeWindow = appStore(useShallow(timeWindowSelector));
  return (
    <VStack
      height={'100%'}
      alignItems={'start'}
      paddingX={2}
      borderRadius={10}
      p={3}
      gap={1}
      shadow={'0px 0px 10px rgba(0, 0, 0, 0.25)'}
    >
      <Text fontSize={'md'} fontWeight={'semibold'} textAlign={'center'}>
        Summary({timeWindow})
      </Text>
      <Divider />
      {Object.entries(expenseByCategory).map(([category, expense]) => (
        <Text
          w={'100%'}
          key={category}
          fontSize={'sm'}
          textAlign={'start'}
          border={'1px solid rgba(0, 0, 0, 0.4)'}
          borderRadius={5}
          p={1}
          shadow={'0px 0px 10px rgba(0, 0, 0, 0.25)'}
        >
          {category}: {expense}
        </Text>
      ))}
      <Divider variant={'dashed'} bgColor={'black'} />
      <Text
        w={'100%'}
        fontSize={'sm'}
        textAlign={'start'}
        fontWeight={'semibold'}
        border={'1px solid rgba(0, 0, 0, 0.4)'}
        borderRadius={5}
        p={1}
        shadow={'0px 0px 10px rgba(0, 0, 0, 0.25)'}
      >
        Total:{' '}
        {Object.values(expenseByCategory).reduce(
          (acc, expense) => acc + expense,
          0,
        )}
      </Text>
    </VStack>
  );
};

export default ExpenseSummary;
