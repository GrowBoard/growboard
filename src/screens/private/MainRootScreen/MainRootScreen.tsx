import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { NavigationComponent, SidebarComponent } from '@components';
import { appStore } from '@store';
import { removeAuthDataSelector, useShallow } from '@selectors';
import { Box } from '@chakra-ui/react';

const MainRootScreen = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const removeAuthData = appStore(useShallow(removeAuthDataSelector));
  const logOutClickHandler = removeAuthData;

  const openSidebarClickHandler = () => {
    setSidebarOpen((prev) => !prev);
  };
  return (
    <Box h={'100vh'} className="flex flex-col">
      <Box zIndex={10}>
        <NavigationComponent
          logOutClickHandler={logOutClickHandler}
          openSidebarClickHandler={openSidebarClickHandler}
        />
      </Box>
      <Box h={'92%'} w={'100%'} display={'flex'} flexWrap={'wrap'}>
        <Box
          w={sidebarOpen ? '1/6' : '5%'}
          h={'full'}
          borderRight={'1px'}
          borderRightColor={'blue-500'}
          bg={'base-200'}
        >
          <SidebarComponent sideBarOpen={sidebarOpen} />
        </Box>
        <Box w={sidebarOpen ? '5/6' : '95%'} h={'full'} p={1}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainRootScreen;
