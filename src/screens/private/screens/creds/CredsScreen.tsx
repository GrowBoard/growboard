import { NavLink, Outlet, useLocation } from 'react-router-dom';
import getSubNavTitle from '../../../../util/nav/NavTitle';
import { OverviewIcon, DeleteIcon, AddIcon, EditIcon } from '@assets';
import { TooltipComponent } from '@components';
import { CredsScreenProps } from './types';
import { Box, Flex, Button } from '@chakra-ui/react';

const CredsRoutes = [
  { title: 'Credentials over', icon: <OverviewIcon />, path: 'preview' },
  { title: 'Credentials add', icon: <AddIcon />, path: 'add' },
  { title: 'Credentials edit', icon: <EditIcon />, path: 'edit' },
  { title: 'Delete credentials', icon: <DeleteIcon />, path: 'delete' },
];

/**
 * Component definition for the creds screen component.
 * @returns The creds screen component.
 */
const CredsScreen = (props: CredsScreenProps) => {
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
        <Flex gap={2}>
          {CredsRoutes.map((item, index) => (
            <TooltipComponent key={index} title={item.title}>
              <Button
                asChild
                variant="outline"
                borderColor="border.subtle"
                color="text.primary"
                _hover={{ bg: 'bg.active' }}
                _currentPage={{
                  bg: 'blue.600',
                  borderColor: 'blue.500',
                  color: 'white',
                }}
                p={2}
                minW="40px"
                h="40px"
                borderRadius="md"
              >
                <NavLink to={item.path}>{item.icon}</NavLink>
              </Button>
            </TooltipComponent>
          ))}
        </Flex>
      </Flex>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
};

export default CredsScreen;
