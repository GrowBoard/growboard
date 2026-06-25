import {
  Button,
  Drawer,
  Input,
  Text,
  Textarea,
  VStack,
  Box,
  HStack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { DateInput } from '../ExpensesTimeWindow/sub_components';
import {
  useShallow,
  dateSelector,
  addExpenseSelector,
  setAddExpenseSelector,
  todayDateSelector,
} from '@selectors';
import { appStore } from '@store';
import { ExpenseType } from '../types';
import { useAddExpenseData } from '@services/hooks/private';

const AddExpense = () => {
  const expenseDataFromStore = appStore(useShallow(addExpenseSelector));
  const {
    date: dateFromStore,
    type: typeFromStore,
    isOpen: isOpenFromStore,
  } = expenseDataFromStore;
  const today = appStore(useShallow(todayDateSelector));
  const setAddExpense = appStore(useShallow(setAddExpenseSelector));
  const { mutateAsync } = useAddExpenseData();
  const date = appStore(useShallow(dateSelector));

  const [isOpenState, setIsOpenState] = useState(false);
  const isOpen = isOpenState || isOpenFromStore;

  const onOpen = () => setIsOpenState(true);
  const onClose = () => {
    setIsOpenState(false);
    setAddExpense(false);
  };

  const btnRef = useRef<HTMLButtonElement>(null);
  const [expenseInputData, setExpenseInputData] = useState({
    date: dateFromStore ?? today,
    amount: '',
    comment: '',
    category: typeFromStore ?? ExpenseType.Food,
  });

  useEffect(() => {
    if (isOpenFromStore && dateFromStore && typeFromStore) {
      setExpenseInputData((prev) => ({
        ...prev,
        date: dateFromStore,
        category: typeFromStore,
      }));
    }
  }, [dateFromStore, isOpenFromStore, typeFromStore]);

  const clearData = () => {
    setExpenseInputData({
      date: date.toISOString().split('T')[0],
      amount: '',
      comment: '',
      category: ExpenseType.Food,
    });
    onClose();
  };

  const handleAddExpense = async () => {
    try {
      await mutateAsync({
        date_time: expenseInputData.date,
        amount: Number(expenseInputData.amount),
        comment: expenseInputData.comment,
        category: expenseInputData.category,
      });
      clearData();
    } catch (error) {
      console.error('Error adding expense', error);
    }
  };

  return (
    <>
      <Button
        ref={btnRef}
        w={'100%'}
        size={'sm'}
        bg={'green.600'}
        color={'white'}
        _hover={{ bg: 'green.500' }}
        variant={'solid'}
        onClick={onOpen}
      >
        Add Expense
      </Button>
      <Drawer.Root
        open={isOpen}
        placement="end"
        onOpenChange={(e: any) => { if (!e.open) clearData(); }}
        size={'md'}
      >
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content bg="gray.850" borderLeft="1px solid" borderColor="gray.700">
            <Drawer.CloseTrigger position="absolute" top={4} right={4} color="white" />
            <Drawer.Header>
              <Drawer.Title color="white" fontSize="xl" fontWeight="semibold">Add new expense</Drawer.Title>
              <Text fontSize={'sm'} color="gray.400">Fill in the details</Text>
            </Drawer.Header>
            <Drawer.Body>
              <VStack gap={4} mt={4}>
                <DateInput
                  text={'Date'}
                  value={expenseInputData.date}
                  maxValue={date.toISOString().split('T')[0]}
                  setValue={(e) =>
                    setExpenseInputData((prev) => ({ ...prev, date: e }))
                  }
                />
                <HStack w="100%" gap={0}>
                  <Box
                    w="30%"
                    bg="blue.200"
                    color="blue.900"
                    py="7px"
                    px={3}
                    borderLeftRadius="md"
                    border="1px solid"
                    borderColor="gray.600"
                    borderRight="none"
                    fontSize="sm"
                    fontWeight="semibold"
                    textAlign="center"
                  >
                    Amount(₹)
                  </Box>
                  <Input
                    flex={1}
                    borderRightRadius="md"
                    borderLeftRadius="none"
                    border="1px solid"
                    borderColor="gray.600"
                    bg="gray.800"
                    color="white"
                    textAlign={'center'}
                    placeholder="Expense amount"
                    type="number"
                    value={expenseInputData.amount}
                    onChange={(e) =>
                      setExpenseInputData((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                  />
                </HStack>
                <select
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    background: '#1a202c',
                    border: '1px solid #4a5568',
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                  value={expenseInputData.category}
                  onChange={(e) =>
                    setExpenseInputData((prev) => ({
                      ...prev,
                      category: e.target.value as ExpenseType,
                    }))
                  }
                >
                  {Object.keys(ExpenseType).map((category) => (
                    <option key={category} value={category} style={{ background: '#1a202c', color: 'white' }}>
                      {category}
                    </option>
                  ))}
                </select>
                <Textarea
                  placeholder="Comment"
                  value={expenseInputData.comment}
                  onChange={(e) =>
                    setExpenseInputData((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  bg="gray.800"
                  color="white"
                  borderColor="gray.600"
                />
              </VStack>
            </Drawer.Body>
            <Drawer.Footer gap={3}>
              <Button
                variant="outline"
                onClick={clearData}
                borderColor="red.500"
                color="red.400"
                _hover={{ bg: 'red.900', color: 'white' }}
              >
                Cancel
              </Button>
              <Button bg="green.600" color="white" _hover={{ bg: 'green.500' }} onClick={handleAddExpense}>
                Add Expense
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  );
};

export default AddExpense;
