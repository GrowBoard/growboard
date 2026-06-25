import { useState } from 'react';
import {
  Table,
  Popover,
  HStack,
  VStack,
  Text,
  Portal,
  Button,
} from '@chakra-ui/react';
import { ExpenseType } from '../../types';
import { EXPENSE_TYPE_COLOR } from '../constants';
import EditDelete from './EditDelete';
import { ExpenseDataPoint } from '@services/hooks/private';
import { appStore } from '@store';
import {
  todayDateSelector,
  useShallow,
  setAddExpenseSelector,
} from '@selectors';

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
  const setAddExpense = appStore(useShallow(setAddExpenseSelector));

  return (
    <Table.Row key={date} py={0} _hover={{ bg: 'bg.active' }}>
      <Table.Cell
        py={0.5}
        textAlign={'center'}
        border={'1px solid'}
        borderColor="border.subtle"
        bg={date === today ? 'bg.active' : 'transparent'}
        color={date === today ? 'indigo.300' : 'text.secondary'}
        fontWeight={date === today ? 'bold' : 'normal'}
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
            border={'1px solid'}
            borderColor="border.subtle"
            textAlign={'center'}
            bg={
              total !== 0
                ? 'bg.active'
                : date === today
                  ? 'bg.active'
                  : 'transparent'
            }
          >
            {total !== 0 ? (
              <Popover.Root lazyMount unmountOnExit>
                <Popover.Trigger asChild>
                  <Text
                    fontSize={'xs'}
                    fontWeight={'semibold'}
                    color={EXPENSE_TYPE_COLOR[type]}
                    py={0.5}
                    transition="all 0.2s"
                    _hover={{
                      cursor: 'pointer',
                      bg: 'bg.active',
                      color: EXPENSE_TYPE_COLOR[type],
                    }}
                  >
                    ₹{total}
                  </Text>
                </Popover.Trigger>
                <Portal>
                  <Popover.Positioner>
                    <Popover.Content
                      bg="bg.panel"
                      borderColor="border.subtle"
                      backdropFilter="blur(16px)"
                      p={4}
                      borderRadius="lg"
                      shadow="2xl"
                      zIndex={1200}
                      w="320px"
                    >
                      <Popover.Arrow />
                      <Popover.CloseTrigger
                        color="text.secondary"
                        _hover={{ color: 'text.primary' }}
                      />
                      <Popover.Title
                        fontWeight="bold"
                        mb={3}
                        color="text.primary"
                        fontSize="sm"
                      >
                        Expenses - {type} ({date})
                      </Popover.Title>
                      <Popover.Body p={0}>
                        <VStack gap={3} align="stretch">
                          <VStack
                            gap={2}
                            align="stretch"
                            maxH="200px"
                            overflowY="auto"
                          >
                            {allPoint.map((point) => (
                              <HStack
                                key={point.id}
                                w={'100%'}
                                bg="bg.app"
                                border="1px solid"
                                borderColor="border.subtle"
                                borderRadius={'md'}
                                p={3}
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <VStack
                                  alignItems={'start'}
                                  gap={1}
                                  fontSize={'xs'}
                                  flex={1}
                                  pr={2}
                                >
                                  <Text
                                    fontWeight="bold"
                                    color="text.primary"
                                    fontSize="sm"
                                  >
                                    ₹{point.amount}
                                  </Text>
                                  <Text
                                    color="text.secondary"
                                    fontSize="2xs"
                                    fontStyle={
                                      point.comment ? 'normal' : 'italic'
                                    }
                                    lineClamp={2}
                                  >
                                    {point.comment || 'No description provided'}
                                  </Text>
                                </VStack>
                                <EditDelete
                                  expenseId={point.id}
                                  type={type}
                                  date={date}
                                />
                              </HStack>
                            ))}
                          </VStack>
                          <Button
                            size="xs"
                            variant="outline"
                            colorPalette="indigo"
                            w="100%"
                            onClick={() => setAddExpense(true, type, date)}
                          >
                            + Add Another
                          </Button>
                        </VStack>
                      </Popover.Body>
                    </Popover.Content>
                  </Popover.Positioner>
                </Portal>
              </Popover.Root>
            ) : (
              <CellAddTrigger date={date} type={type} />
            )}
          </Table.Cell>
        );
      })}
      <Table.Cell
        py={0.5}
        textAlign={'center'}
        bg={sum !== 0 ? 'bg.active' : 'transparent'}
        border={'1px solid'}
        borderColor="border.subtle"
        color={sum !== 0 ? 'text.primary' : 'text.muted'}
        fontWeight={sum !== 0 ? 'bold' : 'normal'}
      >
        {sum !== 0 ? `₹${sum}` : '—'}
      </Table.Cell>
    </Table.Row>
  );
};

export default ExpenseRow;
