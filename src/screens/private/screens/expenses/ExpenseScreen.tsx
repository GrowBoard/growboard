import { Outlet, useLocation } from 'react-router-dom';
import getSubNavTitle from '../../../../util/nav/NavTitle';
import { Box, Flex } from '@chakra-ui/react';

const ExpenseScreen = () => {
  const currentLocation = useLocation();
  return (
    <Box h="full" w="100%">
      <Flex
        m={2}
        bg="bg.cardHeader"
        border="1px solid"
        borderColor="border.subtle"
        p={2}
        borderRadius="lg"
        justify="space-between"
        align="center"
        shadow="md"
      >
        <Box fontSize="xl" fontWeight="semibold" mx={4} color="text.primary">
          {getSubNavTitle(currentLocation.pathname)}
        </Box>
      </Flex>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
};

export default ExpenseScreen;
