import { NavLink } from 'react-router-dom';
import { LuUser, LuSquareCheck } from 'react-icons/lu';
import { IoFolderOpenOutline } from 'react-icons/io5';
import { IoCalendarOutline } from 'react-icons/io5';
import { IoHomeOutline } from 'react-icons/io5';
import { HiOutlineCurrencyRupee } from 'react-icons/hi2';
import { TfiViewListAlt } from 'react-icons/tfi';
import { IoKeyOutline } from 'react-icons/io5';
import { SlGraduation } from 'react-icons/sl';
import { PiTarget } from 'react-icons/pi';

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
      return <IoHomeOutline size={22} />;
    case SidebarIconType.Projects:
      return <IoFolderOpenOutline size={22} />;
    case SidebarIconType.Plans:
      return <IoCalendarOutline size={22} />;
    case SidebarIconType.Expenses:
      return <HiOutlineCurrencyRupee size={24} />;
    case SidebarIconType.Goals:
      return <PiTarget size={22} />;
    case SidebarIconType.Credentials:
      return <IoKeyOutline size={22} />;
    case SidebarIconType.Profile:
      return <LuUser size={22} />;
    case SidebarIconType.Learning:
      return <SlGraduation size={22} />;
    case SidebarIconType.Resources:
      return <TfiViewListAlt size={22} />;
    case SidebarIconType.Habits:
      return <LuSquareCheck size={22} />;
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
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': { display: 'none' },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
    >
      <VStack gap={3} w="full">
        {SidebarRoutes.map((route, index) => {
          return (
            <TooltipComponent
              key={index}
              title={t(route.nameKey)}
              position="tooltip-right"
            >
              <Box
                w="full"
                px={2}
                display="flex"
                justifyContent="center"
                className={`tour-sidebar-${route.iconName}`}
              >
                <NavLink
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-[var(--chakra-colors-bg-active)] text-[var(--chakra-colors-text-primary)] border border-[var(--chakra-colors-border-focus)]'
                        : 'text-[var(--chakra-colors-text-secondary)] hover:bg-[var(--chakra-colors-bg-active)] hover:text-[var(--chakra-colors-text-primary)] border border-transparent'
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
          <Box
            w="full"
            px={2}
            display="flex"
            justifyContent="center"
            className="tour-sidebar-profile"
          >
            <NavLink
              to={ProfileRoutes.path}
              className={({ isActive }) =>
                `flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-[var(--chakra-colors-bg-active)] text-[var(--chakra-colors-text-primary)] border border-[var(--chakra-colors-border-focus)]'
                    : 'text-[var(--chakra-colors-text-secondary)] hover:bg-[var(--chakra-colors-bg-active)] hover:text-[var(--chakra-colors-text-primary)] border border-transparent'
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
