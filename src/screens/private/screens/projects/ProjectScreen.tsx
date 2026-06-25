import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { TooltipComponent } from '@components';
import { AddIcon, DeleteIcon, EditIcon, PreviewIcon } from '@assets';
import getSubNavTitle from '../../../../util/nav/NavTitle';
import { Box, Flex, Button } from '@chakra-ui/react';

/**
 * Project screen routes.
 */
const ProjectRoutes = [
  { title: 'Project preview', icon: <PreviewIcon />, path: 'preview' },
  { title: 'Add project', icon: <AddIcon />, path: 'add' },
  { title: 'Edit project', icon: <EditIcon />, path: 'edit' },
  { title: 'Delete project', icon: <DeleteIcon />, path: 'delete' },
];

const ProjectsScreen = () => {
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
          {ProjectRoutes.map((item, index) => (
            <TooltipComponent key={index} title={item.title}>
              <Button
                asChild
                variant="outline"
                borderColor="border.subtle"
                color="text.primary"
                _hover={{ bg: 'bg.active' }}
                _currentPage={{
                  bg: 'bg.active',
                  borderColor: 'border.subtle',
                  color: 'text.primary',
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

// Export the ProjectsScreen component.
export default ProjectsScreen;
