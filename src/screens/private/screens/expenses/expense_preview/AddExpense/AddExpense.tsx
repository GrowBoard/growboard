import {
  Button,
  Drawer,
  Input,
  Text,
  Textarea,
  VStack,
  Box,
  HStack,
  Field,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { DateInput } from './components';
import {
  useShallow,
  dateSelector,
  addExpenseSelector,
  setAddExpenseSelector,
  todayDateSelector,
} from '@selectors';
import { appStore } from '@store';
import { ExpenseType } from '../types';
import { useAddExpenseData, useEditExpenseData } from '@services/hooks/private';
import { useGetExpensesDataForDate } from '@hooks';
import { isValidAmount } from './utils';
import { getInitialExpenseInput } from './const';
import { ExpenseInputData } from './types';

const AddExpense = () => {
  const expenseDataFromStore = appStore(useShallow(addExpenseSelector));
  const {
    date: dateFromStore,
    type: typeFromStore,
    isOpen: isOpenFromStore,
    expenseId,
  } = expenseDataFromStore;
  const today = appStore(useShallow(todayDateSelector));
  const setAddExpense = appStore(useShallow(setAddExpenseSelector));
  const { mutateAsync: addExpenseMutate, isPending: isAdding } =
    useAddExpenseData();
  const { mutateAsync: editExpenseMutate, isPending: isEditing } =
    useEditExpenseData();
  const { data: queryResponse } = useGetExpensesDataForDate();
  const dateRaw = appStore(useShallow(dateSelector));
  const date =
    dateRaw instanceof Date ? dateRaw : new Date(dateRaw || Date.now());

  const isOpen = isOpenFromStore;

  const onClose = () => {
    setAddExpense(false);
  };
  const [expenseInputData, setExpenseInputData] = useState<ExpenseInputData>(
    () =>
      getInitialExpenseInput(
        dateFromStore ?? today,
        typeFromStore ?? ExpenseType.Food,
      ),
  );

  // Prefill hook logic when opening drawer in edit or add mode
  useEffect(() => {
    if (isOpen && expenseId && queryResponse?.data) {
      const expenseToEdit = queryResponse.data.find((e) => e.id === expenseId);
      if (expenseToEdit) {
        setExpenseInputData({
          date: expenseToEdit.date_time,
          amount: String(expenseToEdit.amount),
          comment: expenseToEdit.comment || '',
          category: expenseToEdit.category,
        });
      }
    } else if (isOpen) {
      setExpenseInputData(
        getInitialExpenseInput(
          dateFromStore ?? today,
          typeFromStore ?? ExpenseType.Food,
        ),
      );
    }
  }, [isOpen, expenseId, queryResponse, dateFromStore, today, typeFromStore]);

  const clearData = () => {
    setExpenseInputData(
      getInitialExpenseInput(date.toISOString().split('T')[0]),
    );
    onClose();
  };

  const handleSaveExpense = async () => {
    if (!isValidAmount(expenseInputData.amount)) {
      return;
    }

    try {
      if (expenseId) {
        // Edit mode
        await editExpenseMutate({
          id: expenseId,
          date_time: expenseInputData.date,
          amount: Number(expenseInputData.amount),
          comment: expenseInputData.comment,
          category: expenseInputData.category,
        });
      } else {
        // Add mode
        await addExpenseMutate({
          date_time: expenseInputData.date,
          amount: Number(expenseInputData.amount),
          comment: expenseInputData.comment,
          category: expenseInputData.category,
        });
      }
      clearData();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const isSaving = isAdding || isEditing;

  return (
    <Drawer.Root
      open={isOpen}
      placement="end"
      onOpenChange={(e: any) => {
        if (!e.open) clearData();
      }}
      size={'md'}
    >
      <Drawer.Backdrop bg="rgba(0,0,0,0.6)" backdropFilter="blur(8px)" />
      <Drawer.Positioner>
        <Drawer.Content
          bg="rgba(12, 14, 18, 0.85)"
          backdropFilter="blur(32px) saturate(1.2)"
          borderLeft="1px solid"
          borderColor="rgba(255, 255, 255, 0.08)"
          boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        >
          <Drawer.CloseTrigger
            position="absolute"
            top={4}
            right={4}
            color="gray.400"
            _hover={{ color: 'white' }}
          />

          <Drawer.Header
            borderBottom="1px solid"
            borderColor="rgba(255, 255, 255, 0.06)"
            py={5}
          >
            <Drawer.Title
              color="white"
              fontSize="lg"
              fontWeight="bold"
              letterSpacing="tight"
            >
              {expenseId ? 'Edit Expense' : 'Add New Expense'}
            </Drawer.Title>
            <Text fontSize={'xs'} color="gray.400" mt={1}>
              {expenseId
                ? 'Modify the details of your expense record.'
                : 'Fill in the details to record a new expense.'}
            </Text>
          </Drawer.Header>

          <Drawer.Body py={6}>
            <VStack gap={5} align="stretch">
              {/* Date Input Card */}
              <Box
                p={4}
                bg="rgba(255, 255, 255, 0.01)"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.04)"
                borderRadius="lg"
              >
                <DateInput
                  text={'Date'}
                  value={expenseInputData.date}
                  maxValue={date.toISOString().split('T')[0]}
                  setValue={(e) =>
                    setExpenseInputData((prev) => ({ ...prev, date: e }))
                  }
                />
              </Box>

              {/* Amount Input */}
              <Field.Root>
                <Field.Label
                  color="gray.300"
                  fontSize="xs"
                  fontWeight="semibold"
                  mb={2}
                >
                  Amount (₹)
                </Field.Label>
                <HStack w="100%" gap={0}>
                  <Box
                    w="25%"
                    bg="rgba(255, 255, 255, 0.03)"
                    color="gray.400"
                    py="9px"
                    px={3}
                    borderLeftRadius="md"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.08)"
                    borderRight="none"
                    fontSize="sm"
                    fontWeight="semibold"
                    textAlign="center"
                  >
                    ₹
                  </Box>
                  <Input
                    flex={1}
                    borderRightRadius="md"
                    borderLeftRadius="none"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.08)"
                    bg="rgba(255, 255, 255, 0.01)"
                    color="white"
                    fontSize="sm"
                    textAlign={'left'}
                    placeholder="Enter amount"
                    type="number"
                    value={expenseInputData.amount}
                    _focus={{
                      borderColor: 'indigo.500',
                      boxShadow: '0 0 0 1px rgba(99, 102, 241, 0.3)',
                    }}
                    onChange={(e) =>
                      setExpenseInputData((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                  />
                </HStack>
              </Field.Root>

              {/* Category Selection */}
              <Field.Root>
                <Field.Label
                  color="gray.300"
                  fontSize="xs"
                  fontWeight="semibold"
                  mb={2}
                >
                  Category
                </Field.Label>
                <select
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    background: 'rgba(20, 24, 30, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                  value={expenseInputData.category}
                  onChange={(e) =>
                    setExpenseInputData((prev) => ({
                      ...prev,
                      category: e.target.value as ExpenseType,
                    }))
                  }
                >
                  {Object.values(ExpenseType).map((category) => (
                    <option
                      key={category}
                      value={category}
                      style={{ background: '#0e1116', color: 'white' }}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </Field.Root>

              {/* Comment Textarea */}
              <Field.Root>
                <Field.Label
                  color="gray.300"
                  fontSize="xs"
                  fontWeight="semibold"
                  mb={2}
                >
                  Comment / Details
                </Field.Label>
                <Textarea
                  placeholder="Describe this expense (e.g. Groceries from Supermarket)..."
                  value={expenseInputData.comment}
                  onChange={(e) =>
                    setExpenseInputData((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  bg="rgba(255, 255, 255, 0.01)"
                  color="white"
                  fontSize="sm"
                  borderColor="rgba(255, 255, 255, 0.08)"
                  _focus={{
                    borderColor: 'indigo.500',
                    boxShadow: '0 0 0 1px rgba(99, 102, 241, 0.3)',
                  }}
                  rows={4}
                />
              </Field.Root>
            </VStack>
          </Drawer.Body>

          <Drawer.Footer
            borderTop="1px solid"
            borderColor="rgba(255, 255, 255, 0.06)"
            py={4}
            gap={3}
          >
            <Button
              variant="outline"
              onClick={clearData}
              borderColor="red.500/40"
              color="red.400"
              _hover={{
                bg: 'rgba(239, 68, 68, 0.08)',
                borderColor: 'red.500',
              }}
              disabled={isSaving}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              bg="indigo.600"
              color="white"
              _hover={{ bg: 'indigo.500' }}
              disabled={isSaving}
              onClick={handleSaveExpense}
              size="sm"
              px={6}
            >
              {isSaving
                ? 'Saving...'
                : expenseId
                  ? 'Update Expense'
                  : 'Add Expense'}
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default AddExpense;
