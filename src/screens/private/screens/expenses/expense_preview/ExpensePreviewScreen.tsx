import { Box, VStack } from '@chakra-ui/react';
import { ExpensesTimeWindow } from './ExpensesTimeWindow';

const ExpensePreviewScreen = () => {
  return (
    <Box h={'100%'} p={2}>
      <ExpensesTimeWindow />
      <VStack w={'60%'} alignItems={'center'} paddingX={2}></VStack>
    </Box>
  );
};

export default ExpensePreviewScreen;
