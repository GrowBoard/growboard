import { NavLink, Outlet, useLocation } from 'react-router-dom';
import getSubNavTitle from '../../../../util/nav/NavTitle';
import { TooltipComponent } from '@components';
import { Box, Flex, Button } from '@chakra-ui/react';
import { PROFILE_ROUTES } from './const';

/**
 * ProfileMainScreen Component.
 * The layout wrapper screen for all sub-routes inside the Profile section.
 * Renders a header navigation bar to switch between the profile preview and settings
 * and displays the active tab inside an Outlet.
 * 
 * @returns The ProfileMainScreen component.
 */
const ProfileMainScreen = () => {
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
          {PROFILE_ROUTES.map((item, index) => (
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
                <NavLink to={item.path}>
                  <item.icon />
                </NavLink>
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

// Export the profile screen component.
export default ProfileMainScreen;
