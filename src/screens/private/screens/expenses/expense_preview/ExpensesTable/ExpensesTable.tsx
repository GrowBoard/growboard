import { useMemo } from 'react';
import {
  Box,
  Button,
  Separator,
  HStack,
  Spinner,
  Table,
} from '@chakra-ui/react';
import { EXPENSE_TYPE_COLOR, MONTHS } from './constants';
import { AddExpense } from '../AddExpense';
import { ExpenseType } from '../types';
import { ExpenseRow } from './sub_components';
import { getExpenseDataForTable, getExpenseDataSumForCategory } from './utils';
import { appStore } from '@store';
import { overviewInputSelector, useShallow } from '@selectors';
import { useGetExpensesDataForDate } from '@hooks';

const ExpenseTable = () => {
  const {
    dateState: { month },
    setOverviewInput,
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
      w={'100%'}
      h={'100%'}
      bg={'gray.850'}
      p={4}
      my={4}
      borderRadius={'lg'}
      overflow={'auto'}
      border={'1px solid'}
      borderColor={'gray.700'}
      shadow={'0px 0px 10px rgba(0, 0, 0, 0.25)'}
    >
      <HStack w={'100%'} justifyContent={'space-between'}>
        <Box fontSize={'xl'} fontWeight={'semibold'} color="white">
          Expenses table
        </Box>
        <HStack gap={4} width={'35%'} justifyContent="flex-end">
          <select
            style={{
              width: '120px',
              padding: '6px 10px',
              borderRadius: '6px',
              background: '#1a202c',
              border: '1px solid #4a5568',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
            }}
            value={month}
            onChange={(e) =>
              setOverviewInput({ month: Number(e.target.value) })
            }
          >
            {MONTHS.map((m, index) => (
              <option key={m} value={index}>
                {m}
              </option>
            ))}
          </select>
          <AddExpense />
          <Button
            size={'sm'}
            bg={'green.600'}
            color={'white'}
            _hover={{ bg: 'green.500' }}
            variant={'solid'}
          >
            Export
          </Button>
        </HStack>
      </HStack>
      <Separator my={4} borderColor="gray.700" />
      {isLoading ? (
        <Box
          w={'100%'}
          h={'100%'}
          display={'flex'}
          justifyContent={'center'}
          py={10}
        >
          <Spinner size={'md'} color="green" />
        </Box>
      ) : (
        <Box overflowX="auto" w="100%">
          <Table.Root
            fontSize={'xs'}
            variant={'line'}
            border="1px solid"
            borderColor="gray.700"
          >
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader
                  border={'1px solid'}
                  borderColor="gray.700"
                  textAlign={'center'}
                  color="gray.300"
                >
                  Date
                </Table.ColumnHeader>
                {Object.values(ExpenseType).map((type) => {
                  return (
                    <Table.ColumnHeader
                      border={'1px solid'}
                      borderColor="gray.700"
                      textAlign={'center'}
                      key={type}
                      bgColor={EXPENSE_TYPE_COLOR[type]}
                      color="white"
                    >
                      {type}
                    </Table.ColumnHeader>
                  );
                })}
                <Table.ColumnHeader
                  textAlign={'center'}
                  border={'1px solid'}
                  borderColor="gray.700"
                  color="gray.300"
                >
                  Day total
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {dataToShow.map((rowData) => (
                <ExpenseRow key={rowData.date} {...rowData} />
              ))}
              <Table.Row>
                <Table.Cell
                  textAlign={'center'}
                  border={'1px solid'}
                  borderColor="gray.700"
                  fontWeight="semibold"
                  color="gray.300"
                >
                  Category total(₹)
                </Table.Cell>
                {Object.values(ExpenseType).map((type) => {
                  return (
                    <Table.Cell
                      key={type}
                      border={'1px solid'}
                      borderColor="gray.700"
                      bgColor={EXPENSE_TYPE_COLOR[type]}
                      textAlign={'center'}
                      fontWeight="semibold"
                      color="white"
                    >
                      ₹{sumByCategory?.[type] ?? 0}
                    </Table.Cell>
                  );
                })}
                <Table.Cell
                  border={'1px solid'}
                  borderColor="gray.700"
                  textAlign={'center'}
                  bg={'green.600'}
                  fontSize={'md'}
                  fontWeight={'bold'}
                  color="white"
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
