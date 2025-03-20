import { Outlet, useLocation } from 'react-router-dom';
import getSubNavTitle from '../../../../util/nav/NavTitle';
import { Box } from '@chakra-ui/react';

const ExpenseScreen = () => {
  const currentLocation = useLocation();
  return (
    <Box h={'100%'}>
      <Box
        bg={'blue.100'}
        dropShadow={'md'}
        rounded={'lg'}
        display={'flex'}
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Box fontSize={'xl'} fontWeight={'semibold'} px={4}>
          {getSubNavTitle(currentLocation.pathname)}
        </Box>
      </Box>
      <Box className="overflow-scroll h-[90%]">
        <Outlet />
      </Box>
    </Box>
  );
};

export default ExpenseScreen;
