import { NavLink } from 'react-router-dom';
import {
  CredsIcon,
  ExpenseIcon,
  GoalsIcon,
  HomeIcon,
  LearningIcon,
  PlanIcon,
  ProfileIcon,
  ProjectIcon,
  ResourceIcon,
} from '@assets';
import TooltipComponent from '../tooltip/TooltipComponent';
// Do not resolve the below imports
// ----------------------------------------------
import { ProfileRoutes, SidebarRoutes } from '@router/sidebarRoutes';
// ----------------------------------------------
import { SidebarIconProps, SidebarIconType } from './types';
import { useTranslation } from 'react-i18next';
import { Box, VStack } from '@chakra-ui/react';
import { authNameSelector, authPictureSelector, useShallow } from '@selectors';
import { appStore } from '@store';

/**
 * Gets the icon for the sidebar.
 * @param icon The icon name.
 * @returns The icon component.
 */
const SidebarIcon = ({ icon }: SidebarIconProps) => {
  switch (icon) {
    case SidebarIconType.Home:
      return <HomeIcon />;
    case SidebarIconType.Projects:
      return <ProjectIcon />;
    case SidebarIconType.Plans:
      return <PlanIcon />;
    case SidebarIconType.Expenses:
      return <ExpenseIcon />;
    case SidebarIconType.Goals:
      return <GoalsIcon />;
    case SidebarIconType.Credentials:
      return <CredsIcon />;
    case SidebarIconType.Profile:
      return <ProfileIcon />;
    case SidebarIconType.Learning:
      return <LearningIcon />;
    case SidebarIconType.Resources:
      return <ResourceIcon />;
    default:
      return null;
  }
};

/**
 * Sidebar component.
 *
 * @param props  The sidebar component props.
 * @returns The sidebar component.
 */
function SidebarComponent() {
  const { t } = useTranslation();
  const name = appStore(useShallow(authNameSelector));
  const picture = appStore(useShallow(authPictureSelector));
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      h="full"
      py={4}
      alignItems="center"
    >
      <VStack gap={3} w="full">
        {SidebarRoutes.map((route, index) => {
          return (
            <TooltipComponent
              key={index}
              title={t(route.nameKey)}
              position="tooltip-right"
            >
              <Box w="full" px={2} display="flex" justifyContent="center">
                <NavLink
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-[var(--chakra-colors-bg-active)] text-cyan-500 border border-cyan-500/30'
                        : 'text-gray-400 hover:bg-[var(--chakra-colors-bg-active)] hover:text-[var(--chakra-colors-text-primary)] border border-transparent'
                    }`
                  }
                >
                  <SidebarIcon icon={route.iconName as SidebarIconType} />
                </NavLink>
              </Box>
            </TooltipComponent>
          );
        })}
      </VStack>

      <VStack gap={3} w="full">
        <TooltipComponent
          title={t(ProfileRoutes.nameKey)}
          position="tooltip-right"
        >
          <Box w="full" px={2} display="flex" justifyContent="center">
            <NavLink
              to={ProfileRoutes.path}
              className={({ isActive }) =>
                `flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-[var(--chakra-colors-bg-active)] text-cyan-500 border border-cyan-500/30'
                    : 'text-gray-400 hover:bg-[var(--chakra-colors-bg-active)] hover:text-[var(--chakra-colors-text-primary)] border border-transparent'
                }`
              }
            >
              {picture ? (
                <Box
                  w="8"
                  h="8"
                  borderRadius="full"
                  overflow="hidden"
                  border="2px solid"
                  borderColor="border.avatar"
                >
                  <img
                    src={picture}
                    alt={name || 'Profile Picture'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    referrerPolicy="no-referrer"
                  />
                </Box>
              ) : (
                <SidebarIcon icon={ProfileRoutes.iconName as SidebarIconType} />
              )}
            </NavLink>
          </Box>
        </TooltipComponent>
      </VStack>
    </Box>
  );
}

export default SidebarComponent;
