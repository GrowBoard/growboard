import { Outlet } from 'react-router-dom';

import {
  NavigationComponent,
  PageLoadingComponent,
  SidebarComponent,
} from '@components';
import { appStore } from '@store';
import {
  isUserLoggedInSelector,
  removeAuthDataSelector,
  useShallow,
} from '@selectors';
import { Box } from '@chakra-ui/react';
import { useAuthCheckTest } from '@services/hooks/private';
import { useEffect } from 'react';

const MainRootScreen = () => {
  const isUserLoggedIn = appStore(useShallow(isUserLoggedInSelector));
  const removeAuthData = appStore(useShallow(removeAuthDataSelector));
  const { mutate, isPending } = useAuthCheckTest({
    onSuccess: (data) => {
      if (!data || (data && data.status === 'ERROR' && isUserLoggedIn)) {
        removeAuthData();
      }
    },
    onError: (error) => {
      console.error('error', error);
      if (isUserLoggedIn) removeAuthData();
    },
  });

  useEffect(() => {
    if (isUserLoggedIn) {
      mutate({});
    }
  }, [isUserLoggedIn, mutate]);

  if (isPending) {
    return <PageLoadingComponent />;
  }

  const logOutClickHandler = removeAuthData;
  return (
    <Box minH={'100vh'} w={'100%'}>
      <NavigationComponent
        logOutClickHandler={logOutClickHandler}
        openSidebarClickHandler={() => 0}
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
