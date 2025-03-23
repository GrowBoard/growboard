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
import { Box } from '@chakra-ui/react';

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
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'space-between'}
      h={'95%'}
    >
      <ul className="menu p-2 w-full ">
        {SidebarRoutes.map((route, index) => {
          return (
            <TooltipComponent
              key={index}
              title={t(route.nameKey)}
              position="tooltip-right"
            >
              <li className="mt-2" key={index}>
                <NavLink
                  key={index}
                  to={route.path}
                  className={
                    ' hover:bg-primary-content hover:outline-dotted hover:outline-primary'
                  }
                >
                  <SidebarIcon icon={route.iconName as SidebarIconType} />
                </NavLink>
              </li>
            </TooltipComponent>
          );
        })}
      </ul>
      <ul className="menu p-2 w-full ">
        <TooltipComponent
          title={t(ProfileRoutes.nameKey)}
          position="tooltip-right"
        >
          <li className="mt-2">
            <NavLink
              to={ProfileRoutes.path}
              className={
                ' hover:bg-primary-content hover:outline-dotted hover:outline-primary'
              }
            >
              <SidebarIcon icon={ProfileRoutes.iconName as SidebarIconType} />
            </NavLink>
          </li>
        </TooltipComponent>
      </ul>
    </Box>
  );
}

export default SidebarComponent;
