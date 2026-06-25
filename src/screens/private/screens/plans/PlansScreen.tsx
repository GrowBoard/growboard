import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { TooltipComponent } from '@components';
import getSubNavTitle from '../../../../util/nav/NavTitle';
import { OverviewIcon, DeleteIcon, AddIcon, EditIcon } from '@assets';
import { Box, Flex, Button } from '@chakra-ui/react';

/**
 * Plans screen routes.
 */
const PlansRoutes = [
  { title: 'Plans overview', icon: <OverviewIcon />, path: 'preview' },
  { title: 'Add plan', icon: <AddIcon />, path: 'add' },
  { title: 'Edit plan', icon: <EditIcon />, path: 'edit' },
  { title: 'Delete plan', icon: <DeleteIcon />, path: 'delete' },
];

/**
 * Component definition for the plans screen component.
 * @returns The plans screen component.
 */
function PlansScreen() {
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
          {PlansRoutes.map((item, index) => (
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
}

// Export the PlansScreen component.
export default PlansScreen;
