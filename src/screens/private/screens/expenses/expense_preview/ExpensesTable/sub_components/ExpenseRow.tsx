import {
  Table,
  Popover,
  HStack,
  VStack,
  Text,
} from '@chakra-ui/react';
import { ExpenseType } from '../../types';
import { EXPENSE_TYPE_COLOR } from '../constants';
import AddExpenseButton from './AddExpenseButton';
import AddEditDelete from './EditDelete';
import { ExpenseDataPoint } from '@services/hooks/private';
import { appStore } from '@store';
import { todayDateSelector, useShallow } from '@selectors';

const ExpenseRow = ({
  date,
  data,
  sum,
}: {
  date: string;
  data: ExpenseDataPoint[];
  sum: number;
}) => {
  const today = appStore(useShallow(todayDateSelector));
  return (
    <Table.Row key={date} py={0}>
      <Table.Cell
        py={0}
        textAlign={'center'}
        border={'1px'}
        bgColor={date === today ? 'green.400' : undefined}
      >
        {date}
      </Table.Cell>
      {Object.values(ExpenseType).map((type) => {
        const allPoint = data.filter((typed) => typed.category === type);
        const total = allPoint.reduce(
          (acc, point) => (acc += point.amount),
          0 as number,
        );
        return (
          <Table.Cell
            key={type}
            p={0}
            border={'1px'}
            textAlign={'center'}
            bgColor={
              total !== 0
                ? EXPENSE_TYPE_COLOR[type]
                : date === today
                  ? 'green.100'
                  : undefined
            }
          >
            <Popover.Root lazyMount unmountOnExit>
              <Popover.Trigger asChild>
                <Text
                  fontSize={'xs'}
                  _hover={{
                    cursor: 'pointer',
                    bgColor: 'blue.100',
                  }}
                >
                  {total}
                </Text>
              </Popover.Trigger>
              <Popover.Content bg="gray.800" borderColor="gray.700" p={3} borderRadius="md" shadow="lg" zIndex={1200}>
                <Popover.Arrow />
                <Popover.CloseTrigger />
                <Popover.Title fontWeight="semibold" mb={2} color="white">
                  {allPoint.length > 0
                    ? `Details of expense for  ${type} (${date})`
                    : `Add Expense for ${type} (${date})`}
                </Popover.Title>
                <Popover.Body>
                  {allPoint.length > 0 ? (
                    allPoint?.map((point) => {
                      return (
                        <HStack
                          key={point.id}
                          w={'100%'}
                          border={'1px'}
                          alignItems={'start'}
                          borderRadius={'md'}
                          p={1}
                          my={1}
                          borderColor="gray.600"
                        >
                          <VStack
                            w={'80%'}
                            alignItems={'start'}
                            gap={1}
                            fontSize={'xs'}
                          >
                            <Text>Amount: {point.amount}</Text>
                            <Text>Category: {point.category}</Text>
                            <Text>Comment: {point.comment}</Text>
                          </VStack>
                          <AddEditDelete
                            expenseId={point.id}
                            type={type}
                            date={date}
                          />
                        </HStack>
                      );
                    })
                  ) : (
                    <AddExpenseButton date={date} type={type} />
                  )}
                </Popover.Body>
              </Popover.Content>
            </Popover.Root>
          </Table.Cell>
        );
      })}
      <Table.Cell py={0} textAlign={'center'} bg={'blue.100'} border={'1px'}>
        {sum}
      </Table.Cell>
    </Table.Row>
  );
};

export default ExpenseRow;
