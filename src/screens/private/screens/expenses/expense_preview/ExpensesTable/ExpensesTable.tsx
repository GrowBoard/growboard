import { useMemo } from 'react';
import { Box, Separator, Spinner, Table } from '@chakra-ui/react';
import { ExpenseType } from '../types';
import { ExpenseRow } from './components';
import { getExpenseDataForTable, getExpenseDataSumForCategory } from './utils';
import { appStore } from '@store';
import { overviewInputSelector, useShallow } from '@selectors';
import { useGetExpensesDataForDate } from '@hooks';

const ExpenseTable = () => {
  const {
    dateState: { month },
  } = appStore(useShallow(overviewInputSelector));

  const { data: queryResponse, isLoading } = useGetExpensesDataForDate();

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

  return (
    <Box
      id="expenses-register-table"
      w={'100%'}
      h={'100%'}
      bg="bg.glass"
      backdropFilter="blur(24px)"
      p={5}
      my={4}
      borderRadius={'xl'}
      border={'1px solid'}
      borderColor="border.subtle"
      shadow={'2xl'}
      overflow={'auto'}
    >
      <Box
        fontSize={'lg'}
        fontWeight={'bold'}
        color="text.primary"
        letterSpacing="tight"
      >
        Expenses Register
      </Box>

      <Separator my={4} borderColor="border.subtle" />

      {isLoading ? (
        <Box
          w={'100%'}
          h={'100%'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          py={12}
        >
          <Spinner size={'md'} color="indigo.500" />
        </Box>
      ) : (
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
                  Date
                </Table.ColumnHeader>
                {Object.values(ExpenseType).map((type) => {
                  return (
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
                  );
                })}
                <Table.ColumnHeader
                  textAlign={'center'}
                  border={'1px solid'}
                  borderColor="border.subtle"
                  color="text.secondary"
                  fontWeight="bold"
                  py={0.5}
                >
                  Day Total
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {dataToShow.map((rowData) => (
                <ExpenseRow key={rowData.date} {...rowData} />
              ))}
              <Table.Row bg="bg.app">
                <Table.Cell
                  textAlign={'center'}
                  border={'1px solid'}
                  borderColor="border.subtle"
                  fontWeight="bold"
                  color="text.secondary"
                  py={0.5}
                >
                  Category total
                </Table.Cell>
                {Object.values(ExpenseType).map((type) => {
                  return (
                    <Table.Cell
                      key={type}
                      border={'1px solid'}
                      borderColor="border.subtle"
                      textAlign={'center'}
                      fontWeight="bold"
                      color="text.primary"
                      py={0.5}
                    >
                      ₹{sumByCategory?.[type] ?? 0}
                    </Table.Cell>
                  );
                })}
                <Table.Cell
                  border={'1px solid'}
                  borderColor="border.subtle"
                  textAlign={'center'}
                  bg="bg.active"
                  fontSize={'xs'}
                  fontWeight={'bold'}
                  color="indigo.300"
                  py={0.5}
                >
                  ₹{totalSum}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </Box>
  );
};

export default ExpenseTable;
