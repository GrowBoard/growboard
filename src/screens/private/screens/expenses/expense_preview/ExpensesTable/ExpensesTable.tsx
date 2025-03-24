import { useMemo } from 'react';
import {
  Box,
  Button,
  Divider,
  HStack,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
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
    () => (!isLoading ? getExpenseDataSumForCategory(queryResponse?.data) : {}),
    [isLoading, queryResponse],
  );

  return (
    <Box
      w={'100%'}
      h={'100%'}
      bg={'base-100'}
      p={4}
      my={4}
      rounded={'lg'}
      overflow={'auto'}
      border={'1px'}
      shadow={'0px 0px 10px rgba(0, 0, 0, 0.25)'}
    >
      <HStack w={'100%'} justifyContent={'space-between'}>
        <Box fontSize={'xl'} fontWeight={'semibold'}>
          Expenses table
        </Box>
        <HStack spacing={2} width={'30%'}>
          <Select
            w={'200%'}
            size={'sm'}
            placeholder="Select Month"
            value={month}
            onChange={(e) =>
              setOverviewInput({ month: Number(e.target.value) })
            }
          >
            {MONTHS.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </Select>
          <AddExpense />
          <Button
            w={'100%'}
            size={'sm'}
            colorScheme={'green'}
            variant={'solid'}
          >
            Export
          </Button>
        </HStack>
      </HStack>
      <Divider my={2} />
      {isLoading ? (
        <Box w={'100%'} h={'100%'} display={'flex'} justifyContent={'center'}>
          <Spinner size={'md'} color="green" />
        </Box>
      ) : (
        <TableContainer>
          <Table fontSize={'xs'} variant={'simple'}>
            <Thead>
              <Tr columnGap={2}>
                <Th border={'1px'} textAlign={'center'}>
                  Date
                </Th>
                {Object.values(ExpenseType).map((type) => {
                  return (
                    <Th
                      border={'1px'}
                      textAlign={'center'}
                      key={type}
                      bgColor={EXPENSE_TYPE_COLOR[type]}
                    >
                      {type}
                    </Th>
                  );
                })}
                <Th textAlign={'center'} border={'1px'}>
                  Day total
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {dataToShow.map((rowData) => (
                <ExpenseRow key={rowData.date} {...rowData} />
              ))}
              <Tr>
                <Td textAlign={'center'} border={'1px'}>
                  Category total(₹)
                </Td>
                {Object.values(ExpenseType).map((type) => {
                  return (
                    <Td
                      key={type}
                      border={'1px'}
                      bgColor={EXPENSE_TYPE_COLOR[type]}
                      textAlign={'center'}
                    >
                      ₹{sumByCategory?.[type] ?? 0}
                    </Td>
                  );
                })}
                <Td
                  border={'1px'}
                  textAlign={'center'}
                  bg={'green'}
                  fontSize={'md'}
                  fontWeight={'bold'}
                >
                  ₹{totalSum}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ExpenseTable;
