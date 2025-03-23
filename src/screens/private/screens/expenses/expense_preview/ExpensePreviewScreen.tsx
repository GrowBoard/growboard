import { Box, VStack } from '@chakra-ui/react';
import { ExpensesTimeWindow } from './ExpensesTimeWindow';
import { Charts } from './Charts';
import ExpensesTable from './ExpensesTable/ExpensesTable';

const ExpensePreviewScreen = () => {
  return (
    <Box h={'100%'} p={2} rowGap={10}>
      <VStack
        w={'100%'}
        justifyContent={'space-between'}
        alignItems={'center'}
        paddingX={2}
        spacing={2}
      >
        <ExpensesTimeWindow />
        <Charts />
      </VStack>
      <VStack alignItems={'center'} paddingX={2}>
        <ExpensesTable />
      </VStack>
    </Box>
  );
};

export default ExpensePreviewScreen;
