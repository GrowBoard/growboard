import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { TooltipComponent } from '@components';
import getSubNavTitle from '../../../../util/nav/NavTitle';
import { LuBookOpen, LuPlus, LuPencil, LuTrash2 } from 'react-icons/lu';
import { Box, Flex, Button } from '@chakra-ui/react';

/**
 * Goals screen routes.
 */
const GoalsRoutes = [
  { title: 'Goals overview', icon: <LuBookOpen />, path: 'preview' },
  { title: 'Add goal', icon: <LuPlus />, path: 'add' },
  { title: 'Edit goal', icon: <LuPencil />, path: 'edit' },
  { title: 'Delete goal', icon: <LuTrash2 />, path: 'delete' },
];

/**
 * Component definition for the goals screen component.
 * @returns The goals screen component.
 */
function GoalsScreen() {
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
          {GoalsRoutes.map((item, index) => (
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

// Export the GoalsScreen component.
export default GoalsScreen;
