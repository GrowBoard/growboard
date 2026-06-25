import { Outlet } from 'react-router-dom';

import { NavigationComponent, SidebarComponent } from '@components';
import { appStore } from '@store';
import { removeAuthDataSelector, useShallow } from '@selectors';
import { Box } from '@chakra-ui/react';
import { AddExpense } from '../screens/expenses/expense_preview/AddExpense';

import { googleLogout } from '@react-oauth/google';

const MainRootScreen = () => {
  const removeAuthData = appStore(useShallow(removeAuthDataSelector));

  const logOutClickHandler = () => {
    googleLogout();
    removeAuthData();
  };
  return (
    <Box
      h={'100vh'}
      w={'100%'}
      display={'flex'}
      flexDirection={'column'}
      bg="bg.app"
      color="text.primary"
      overflow={'hidden'}
    >
      <NavigationComponent
        logOutClickHandler={logOutClickHandler}
        openSidebarClickHandler={() => 0}
      />
      <Box flex={1} w={'100%'} display={'flex'} overflow={'hidden'}>
        <Box
          w={'24'}
          h={'100%'}
          borderRight={'1px solid'}
          borderRightColor="border.subtle"
          bg="bg.panel"
        >
          <SidebarComponent />
        </Box>
        <Box flex={1} h={'100%'} overflowY={'auto'} p={1}>
          <Outlet />
        </Box>
      </Box>
      <AddExpense />
    </Box>
  );
};

export default MainRootScreen;
