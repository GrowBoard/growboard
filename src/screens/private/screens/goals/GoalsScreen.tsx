import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { TooltipComponent } from '@components';
import getSubNavTitle from '../../../../util/nav/NavTitle';
import { OverviewIcon, DeleteIcon, AddIcon, EditIcon } from '@assets';
import { Box, Flex, Button } from '@chakra-ui/react';

/**
 * Goals screen routes.
 */
const GoalsRoutes = [
  { title: 'Goals overview', icon: <OverviewIcon />, path: 'preview' },
  { title: 'Add goal', icon: <AddIcon />, path: 'add' },
  { title: 'Edit goal', icon: <EditIcon />, path: 'edit' },
  { title: 'Delete goal', icon: <DeleteIcon />, path: 'delete' },
];

/**
 * Component definition for the goals screen component.
 * @returns The goals screen component.
 */
function GoalsScreen() {
  const currentLocation = useLocation();
  return (
    <Box h="full" w="100%">
      <Flex m={2} bg="gray.850" border="1px solid" borderColor="gray.700" p={2} borderRadius="lg" justify="space-between" align="center" shadow="md">
        <Box fontSize="xl" fontWeight="semibold" mx={4} color="white">
          {getSubNavTitle(currentLocation.pathname)}
        </Box>
        <Flex gap={2}>
          {GoalsRoutes.map((item, index) => (
            <TooltipComponent key={index} title={item.title}>
              <Button
                asChild
                variant="outline"
                borderColor="gray.600"
                color="white"
                _hover={{ bg: 'gray.700' }}
                _currentPage={{ bg: 'blue.600', borderColor: 'blue.500' }}
                p={2}
                minW="40px"
                h="40px"
                borderRadius="md"
              >
                <NavLink to={item.path}>
                  {item.icon}
                </NavLink>
              </Button>
            </TooltipComponent>
          ))}
        </Flex>
      </Flex>
      <Box overflowY="auto" h="90%">
        <Outlet />
      </Box>
    </Box>
  );
}

// Export the GoalsScreen component.
export default GoalsScreen;
