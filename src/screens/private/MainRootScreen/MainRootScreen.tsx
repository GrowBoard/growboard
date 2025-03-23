import { Outlet } from 'react-router-dom';

import {
  NavigationComponent,
  PageLoadingComponent,
  SidebarComponent,
} from '@components';
import { appStore } from '@store';
import {
  authTokenSelector,
  removeAuthDataSelector,
  useShallow,
} from '@selectors';
import { Box } from '@chakra-ui/react';
import { useAuthCheckTest } from '@services/hooks/private';

const MainRootScreen = () => {
  const { data, isPending, isError } = useAuthCheckTest();
  const removeAuthData = appStore(useShallow(removeAuthDataSelector));
  const authToken = appStore(useShallow(authTokenSelector));

  if (isPending || isError) {
    return <PageLoadingComponent />;
  }

  if (data?.status === 'ERROR' || !authToken) {
    removeAuthData();
    return <PageLoadingComponent />;
  }

  const logOutClickHandler = removeAuthData;
  return (
    <Box minH={'100vh'} w={'100%'}>
      <NavigationComponent
        logOutClickHandler={logOutClickHandler}
        openSidebarClickHandler={() => {}}
      />
      <Box h={'92%'} w={'100%'} display={'flex'} flexWrap={'wrap'}>
        <Box
          w={'100'}
          height={'93vh'}
          borderRight={'1px'}
          borderRightColor={'blue-500'}
          bg={'base-200'}
          pos={'sticky'}
          top={'7%'}
        >
          <SidebarComponent />
        </Box>
        <Box flex={1} h={'full'} p={1}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainRootScreen;
