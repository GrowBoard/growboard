import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
  Textarea,
  useDisclosure,
  VStack,
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
  const { isOpen, onOpen, onClose } = useDisclosure();
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
    setAddExpense(false);
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
      onClose();
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
        colorScheme={'green'}
        variant={'solid'}
        onClick={onOpen}
      >
        Add Expense
      </Button>
      <Drawer
        isOpen={isOpen || isOpenFromStore}
        placement="right"
        onClose={clearData}
        size={'md'}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            Add new expense
            <Text fontSize={'sm'}>Fill in the details</Text>
          </DrawerHeader>
          <DrawerBody>
            <VStack gap={4}>
              <DateInput
                text={'Date'}
                value={expenseInputData.date}
                maxValue={date.toISOString().split('T')[0]}
                setValue={(e) =>
                  setExpenseInputData((prev) => ({ ...prev, date: e }))
                }
              />
              <InputGroup>
                <InputLeftElement
                  width={'20%'}
                  backgroundColor={'blue.200'}
                  borderLeftRadius={5}
                  border={'1px solid rgba(0, 0, 0, 0.3)'}
                  pointerEvents="none"
                  borderRightColor={'transparent'}
                  pl={2}
                  children={<Text>Amount(₹)</Text>}
                />
                <Input
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
              </InputGroup>
              <Select
                placeholder="Select category"
                defaultValue={expenseInputData.category}
                value={expenseInputData.category}
                onChange={(e) =>
                  setExpenseInputData((prev) => ({
                    ...prev,
                    category: e.target.value as ExpenseType,
                  }))
                }
              >
                {Object.keys(ExpenseType).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
              <Textarea
                placeholder="Comment"
                value={expenseInputData.comment}
                onChange={(e) =>
                  setExpenseInputData((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
              />
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={clearData}
              colorScheme="red"
            >
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleAddExpense}>
              Add Expense
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AddExpense;
