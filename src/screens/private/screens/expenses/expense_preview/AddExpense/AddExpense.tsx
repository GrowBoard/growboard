import {
  Button,
  Drawer,
  Input,
  NativeSelectField,
  NativeSelectRoot,
  Text,
  Textarea,
  VStack,
  Box,
  HStack,
  Field,
  IconButton,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { LuX } from 'react-icons/lu';
import { DateInput } from './components';
import {
  useShallow,
  dateSelector,
  addExpenseSelector,
  setAddExpenseSelector,
} from '@selectors';
import { appStore } from '@store';
import { ExpenseType } from '../types';
import { EXPENSE_TYPE_COLOR } from '../const';
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
  const today = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Kolkata',
  });
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
      <Drawer.Backdrop backdropFilter="blur(2px)" />
      <Drawer.Positioner>
        <Drawer.Content
          bg="bg.panel"
          backdropFilter="blur(32px) saturate(1.2)"
          borderLeft="1px solid"
          borderColor="border.subtle"
          boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        >
          <Drawer.CloseTrigger asChild>
            <IconButton
              aria-label="Close"
              variant="ghost"
              size="sm"
              position="absolute"
              top={2}
              right={4}
              color="text.secondary"
              _hover={{ bg: 'bg.active', color: 'text.primary' }}
            >
              <LuX />
            </IconButton>
          </Drawer.CloseTrigger>
          <Drawer.Header
            borderBottom="1px solid"
            borderColor="border.subtle"
            py={2}
          >
            <Drawer.Title
              color="text.primary"
              fontSize="lg"
              fontWeight="bold"
              letterSpacing="tight"
            >
              {expenseId ? 'Edit Expense' : 'Add New Expense'}
            </Drawer.Title>
            <Text fontSize={'xs'} color="text.muted" mt={10}>
              {expenseId
                ? 'Modify the details of your expense record.'
                : 'Fill in the details to record a new expense.'}
            </Text>
          </Drawer.Header>

          <Drawer.Body py={6}>
            <VStack gap={5} align="stretch">
              {/* Date Input Card */}
              <Box
                p={3}
                bg="bg.card"
                border="1px solid"
                borderColor="border.subtle"
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
                  color="text.secondary"
                  fontSize="xs"
                  fontWeight="semibold"
                  mb={2}
                >
                  Amount (₹)
                </Field.Label>
                <HStack w="100%" gap={0}>
                  <Box
                    w="25%"
                    bg="bg.input"
                    color="text.muted"
                    py="9px"
                    px={3}
                    borderLeftRadius="md"
                    border="1px solid"
                    borderColor="border.input"
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
                    borderColor="border.input"
                    bg="bg.input"
                    color="text.primary"
                    fontSize="sm"
                    textAlign={'left'}
                    px={2}
                    placeholder="Enter amount"
                    type="number"
                    value={expenseInputData.amount}
                    _focus={{
                      borderColor: 'border.focus',
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
                  color="text.secondary"
                  fontSize="xs"
                  fontWeight="semibold"
                  mb={2}
                >
                  Category
                </Field.Label>
                <NativeSelectRoot w="100%">
                  <NativeSelectField
                    color="black"
                    fontWeight="semibold"
                    fontSize="sm"
                    value={expenseInputData.category}
                    onChange={(e) =>
                      setExpenseInputData((prev) => ({
                        ...prev,
                        category: e.target.value as ExpenseType,
                      }))
                    }
                    px={2}
                    border="1px solid"
                    borderColor="border.input"
                    _focus={{
                      borderColor: 'border.focus',
                    }}
                    style={{
                      backgroundColor:
                        EXPENSE_TYPE_COLOR[expenseInputData.category] ||
                        'var(--chakra-colors-bg-input)',
                    }}
                  >
                    {Object.values(ExpenseType).map((category) => (
                      <option
                        key={category}
                        value={category}
                        style={{
                          background: 'var(--chakra-colors-bg-input)',
                          color: 'var(--chakra-colors-text-primary)',
                          fontWeight: 'normal',
                        }}
                      >
                        {category}
                      </option>
                    ))}
                  </NativeSelectField>
                </NativeSelectRoot>
              </Field.Root>

              {/* Comment Textarea */}
              <Field.Root>
                <Field.Label
                  color="text.secondary"
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
                  p={2}
                  bg="bg.input"
                  color="text.primary"
                  fontSize="sm"
                  border="1px solid"
                  borderColor="border.input"
                  _focus={{
                    borderColor: 'border.focus',
                    boxShadow: '0 0 0 1px rgba(99, 102, 241, 0.3)',
                  }}
                  rows={4}
                />
              </Field.Root>
            </VStack>
          </Drawer.Body>

          <Drawer.Footer
            borderTop="1px solid"
            borderColor="border.subtle"
            py={4}
            gap={3}
          >
            <Button
              variant="ghost"
              onClick={clearData}
              color="text.secondary"
              _hover={{
                bg: 'bg.active',
                color: 'text.primary',
              }}
              disabled={isSaving}
              size="md"
              borderRadius="xl"
              px={5}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveExpense}
              disabled={isSaving}
              size="md"
              flex={1}
              bg="linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
              color="white"
              fontWeight="bold"
              borderRadius="xl"
              px={6}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              _hover={{
                bg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
              }}
              _active={{
                transform: 'translateY(0)',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.2)',
              }}
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
