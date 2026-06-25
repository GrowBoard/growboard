import { Separator, Text, VStack } from '@chakra-ui/react';
import { ExpenseSummaryProps } from './types';
import { appStore } from '@store';
import { timeWindowSelector, useShallow } from '@selectors';

const ExpenseSummary = ({ expenseByCategory }: ExpenseSummaryProps) => {
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
      <Separator />
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
      <Separator variant={'dashed'} borderColor="gray.600" />
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
        {Object.values(expenseByCategory).reduce((acc, expense) => {
          acc += expense;
          return acc;
        }, 0)}
      </Text>
    </VStack>
  );
};

export default ExpenseSummary;
