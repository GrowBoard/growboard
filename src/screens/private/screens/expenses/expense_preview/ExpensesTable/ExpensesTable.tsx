import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  HStack,
  Select,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useGetExpensesData } from '@services/hooks/private';
import { EXPENSE_TYPE_COLOR, MONTHS } from './constants';
import { AddExpense } from '../AddExpense';
import { groupBy } from 'lodash';
import { ExpenseType } from '../types';
import { ExpenseRow } from './sub_components';

const ExpenseTable = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const { monthStartDate, monthEndDate } = useMemo(() => {
    const date = new Date();
    const year = date.getFullYear();
    const monthStartDate = new Date(year, month, 1).toISOString().split('T')[0];
    const monthEndDate = new Date(year, month + 1, 1)
      .toISOString()
      .split('T')[0];
    return { monthStartDate, monthEndDate };
  }, [month]);

  const { data: queryResponse, isLoading } = useGetExpensesData({
    start_date: monthStartDate,
    end_date: monthEndDate,
  });

  const dataToShow = useMemo(() => {
    if (
      isLoading ||
      !queryResponse ||
      !queryResponse.data ||
      queryResponse.data.length === 0
    ) {
      return [];
    }

    const expenseData = queryResponse.data;

    const daysInMonth = new Date(
      new Date().getFullYear(),
      month + 1,
      0,
    ).getDate();

    const groupedData = groupBy(expenseData, 'date_time');

    const a = Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(new Date().getFullYear(), month, i + 1)
        .toISOString()
        .split('T')[0];
      return {
        date,
        data: groupedData[date] || [],
      };
    });

    return a;
  }, [isLoading, month, queryResponse]);

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
            onChange={(e) => setMonth(Number(e.target.value))}
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
      <TableContainer>
        <Table fontSize={'xs'} variant={'simple'}>
          <Thead>
            <Tr columnGap={2}>
              <Th>Date</Th>
              {Object.values(ExpenseType).map((type) => {
                return (
                  <Th key={type} bgColor={EXPENSE_TYPE_COLOR[type]}>
                    {type}
                  </Th>
                );
              })}
              <Th>Day total</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dataToShow.map((rowData) => (
              <ExpenseRow key={rowData.date} {...rowData} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ExpenseTable;
