import {
  Box,
  VStack,
  Table,
  Spinner,
  Button,
  HStack,
  Text,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { ExpensesTimeWindow } from './ExpensesTimeWindow';
import { Charts } from './Charts';
import ExpensesTable from './ExpensesTable/ExpensesTable';
import { useGetExpensesDataForDate } from '@hooks';
import {
  getExpenseDataSumForCategory,
  getExpenseDataForTable,
} from './ExpensesTable/utils';
import { ExpenseType } from './types';
import { appStore } from '@store';
import {
  overviewInputSelector,
  todayDateSelector,
  useShallow,
  setAddExpenseSelector,
} from '@selectors';
import { ExpenseRow } from './ExpensesTable/sub_components';

const ExpensePreviewScreen = () => {
  const {
    dateState: { month, year: yearState },
  } = appStore(useShallow(overviewInputSelector));
  const today = appStore(useShallow(todayDateSelector));
  const setAddExpense = appStore(useShallow(setAddExpenseSelector));

  const { data: queryResponse, isLoading } = useGetExpensesDataForDate();

  const isCurrentMonth = useMemo(() => {
    const todayObj = new Date();
    return (
      todayObj.getFullYear() === yearState && todayObj.getMonth() === month
    );
  }, [month, yearState]);

  const selectedMonthName = useMemo(() => {
    const d = new Date(yearState, month, 1);
    return d.toLocaleString('default', { month: 'long' });
  }, [month, yearState]);

  const dataToShow = useMemo(
    () => (!isLoading ? getExpenseDataForTable(queryResponse, month) : []),
    [isLoading, month, queryResponse],
  );

  const { sumByCategory, totalSum } = useMemo(
    () =>
      !isLoading
        ? getExpenseDataSumForCategory(queryResponse?.data)
        : {
            sumByCategory: {} as Record<ExpenseType, number>,
            totalSum: 0,
          },
    [isLoading, queryResponse],
  );

  const todayRowData = useMemo(() => {
    const found = dataToShow.find((row) => row.date === today);
    return (
      found || {
        date: today,
        data: [],
        sum: 0,
      }
    );
  }, [dataToShow, today]);

  return (
    <Box h={'100%'} p={2} rowGap={10}>
      <VStack
        w={'100%'}
        justifyContent={'space-between'}
        alignItems={'center'}
        paddingX={2}
        gap={3}
      >
        <ExpensesTimeWindow />

        {/* Quick Summary & Log Today Table Container */}
        <Box
          w={'100%'}
          bg="bg.glass"
          backdropFilter="blur(24px)"
          p={5}
          borderRadius={'xl'}
          border={'1px solid'}
          borderColor="border.subtle"
          shadow={'2xl'}
          overflow={'auto'}
        >
          {/* Header Row: Today's Date (or selected month) & Add Expense CTA */}
          <HStack
            w="100%"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
            px={1}
          >
            <Text
              fontSize="md"
              fontWeight="bold"
              color="indigo.400"
              letterSpacing="tight"
            >
              {isCurrentMonth
                ? `Today: ${new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}`
                : `${selectedMonthName} ${yearState}`}
            </Text>
            <HStack gap={3}>
              <Button
                size={'xs'}
                variant="outline"
                borderColor="rgba(255, 255, 255, 0.12)"
                color="gray.300"
                fontWeight="semibold"
                borderRadius="lg"
                px={3}
                transition="all 0.2s"
                _hover={{
                  bg: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.24)',
                  transform: 'translateY(-1px)',
                }}
                _active={{
                  transform: 'translateY(0)',
                }}
                onClick={() => {
                  document
                    .getElementById('expenses-register-table')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                See all expenses
              </Button>
              <Button
                size={'xs'}
                bg="linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                color={'white'}
                fontWeight="bold"
                borderRadius="lg"
                px={4}
                gap={1.5}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                _hover={{
                  bg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  transform: 'translateY(-2px) scale(1.02)',
                  boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)',
                }}
                _active={{
                  transform: 'translateY(0) scale(1)',
                  boxShadow: '0 0 8px rgba(99, 102, 241, 0.2)',
                }}
                onClick={() => setAddExpense(true)}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Expense
              </Button>
            </HStack>
          </HStack>

          <Box overflowX="auto" w="100%">
            <Table.Root
              fontSize={'xs'}
              variant={'line'}
              border="1px solid"
              borderColor="border.subtle"
            >
              <Table.Header>
                <Table.Row bg="bg.app">
                  <Table.ColumnHeader
                    border={'1px solid'}
                    borderColor="border.subtle"
                    textAlign={'center'}
                    color="text.secondary"
                    fontWeight="bold"
                    py={0.5}
                  >
                    Type / Date
                  </Table.ColumnHeader>
                  {Object.values(ExpenseType).map((type) => (
                    <Table.ColumnHeader
                      border={'1px solid'}
                      borderColor="border.subtle"
                      textAlign={'center'}
                      key={type}
                      color="text.secondary"
                      fontWeight="bold"
                      py={0.5}
                    >
                      {type}
                    </Table.ColumnHeader>
                  ))}
                  <Table.ColumnHeader
                    textAlign={'center'}
                    border={'1px solid'}
                    borderColor="border.subtle"
                    color="text.secondary"
                    fontWeight="bold"
                    py={0.5}
                  >
                    Total
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {isLoading ? (
                  <Table.Row>
                    <Table.Cell
                      colSpan={Object.values(ExpenseType).length + 2}
                      textAlign="center"
                      py={4}
                    >
                      <Spinner size="xs" color="indigo.500" mr={2} />
                      Loading data...
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  <>
                    {/* Today Row - only show for current month */}
                    {isCurrentMonth && (
                      <ExpenseRow key={todayRowData.date} {...todayRowData} />
                    )}

                    {/* Category Monthly Total Row */}
                    <Table.Row bg="bg.app">
                      <Table.Cell
                        textAlign={'center'}
                        border={'1px solid'}
                        borderColor="border.subtle"
                        fontWeight="bold"
                        color="text.secondary"
                        py={0.5}
                      >
                        {isCurrentMonth
                          ? 'Monthly Total'
                          : `${selectedMonthName} Total`}
                      </Table.Cell>
                      {Object.values(ExpenseType).map((type) => (
                        <Table.Cell
                          key={type}
                          border={'1px solid'}
                          borderColor="border.subtle"
                          textAlign={'center'}
                          fontWeight="bold"
                          color="text.primary"
                          py={0.5}
                        >
                          ₹
                          {(sumByCategory?.[type] ?? 0).toLocaleString('en-IN')}
                        </Table.Cell>
                      ))}
                      <Table.Cell
                        border={'1px solid'}
                        borderColor="border.subtle"
                        textAlign={'center'}
                        fontWeight="bold"
                        color="text.primary"
                        py={0.5}
                      >
                        ₹{(totalSum ?? 0).toLocaleString('en-IN')}
                      </Table.Cell>
                    </Table.Row>
                  </>
                )}
              </Table.Body>
            </Table.Root>
          </Box>
        </Box>

        <Charts />
      </VStack>
      <VStack alignItems={'center'} paddingX={2}>
        <ExpensesTable />
      </VStack>
    </Box>
  );
};

export default ExpensePreviewScreen;
