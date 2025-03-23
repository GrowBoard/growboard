import {
  Tr,
  Td,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  HStack,
  VStack,
  Text,
} from '@chakra-ui/react';
import { ExpenseType } from '../../types';
import { EXPENSE_TYPE_COLOR } from '../constants';
import AddExpenseButton from './AddExpenseButton';
import EditDelete from './EditDelete';
import { ExpenseDataPoint } from '@services/hooks/private';

const ExpenseRow = ({
  date,
  data,
}: {
  date: string;
  data: ExpenseDataPoint[];
}) => {
  return (
    <Tr key={date} py={0}>
      <Td py={0} textAlign={'center'}>
        {date}
      </Td>
      {Object.values(ExpenseType).map((type) => {
        const allPoint = data.filter((typed) => typed.category === type);
        const total = allPoint.reduce(
          (acc, point) => (acc += point.amount),
          0 as number,
        );
        return (
          <Td
            key={type}
            p={0}
            border={'1px'}
            textAlign={'center'}
            bgColor={total !== 0 ? EXPENSE_TYPE_COLOR[type] : undefined}
          >
            <Popover closeOnBlur>
              <PopoverTrigger>
                <Text
                  fontSize={'xs'}
                  _hover={{
                    cursor: 'pointer',
                    bgColor: 'blue.100',
                  }}
                >
                  {total}
                </Text>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>
                  {allPoint.length > 0 ? 'Details of expense' : 'Add Expense '}
                </PopoverHeader>
                <PopoverBody>
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
                        >
                          <VStack
                            w={'80%'}
                            alignItems={'start'}
                            spacing={1}
                            fontSize={'xs'}
                          >
                            <Text>Amount: {point.amount}</Text>
                            <Text>Category: {point.category}</Text>
                            <Text>Comment: {point.comment}</Text>
                          </VStack>
                          <EditDelete expenseId={point.id} />
                        </HStack>
                      );
                    })
                  ) : (
                    <AddExpenseButton />
                  )}
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Td>
        );
      })}
      <Td py={0} textAlign={'center'} bg={'blue.100'}>
        {data.reduce((acc, point) => (acc += point.amount), 0 as number)}
      </Td>
    </Tr>
  );
};

export default ExpenseRow;
