import { NavLink, Outlet, useLocation } from 'react-router-dom';
import getSubNavTitle from '../../../../util/nav/NavTitle';
import { ProfileIcon, PasswordResetIcon, SettingsIcon } from '@assets';
import { TooltipComponent } from '@components';

/**
 * Profile screen routes.
 */
const ProfileRoutes = [
  { title: 'Profile preview', icon: <ProfileIcon />, path: 'preview' },
  { title: 'Reset password', icon: <PasswordResetIcon />, path: 'reset' },
  { title: 'Profile setting', icon: <SettingsIcon />, path: 'settings' },
];

/**
 * Component definition for the profile screen component.
 * @param props The props for the profile screen component.
 * @returns The profile screen component.
 */
function ProfileMainScreen() {
  const currentLocation = useLocation();
  return (
    <div className="h-full">
      <div className=" m-2 bg-primary-content p-1 drop-shadow-md rounded-lg flex flex-row justify-between items-center">
        <div className="text-xl font-semibold mx-4">
          {getSubNavTitle(currentLocation.pathname)}
        </div>
        <div className="flex flex-row space-x-2 gap-3">
          {ProfileRoutes.map((item, index) => (
            <TooltipComponent key={index} title={item.title}>
              <NavLink to={item.path} className="btn btn-square btn-outline ">
                {item.icon}
              </NavLink>
            </TooltipComponent>
          ))}
        </div>
      </div>
      <div className="overflow-scroll h-[90%]">
        <Outlet />
      </div>
    </div>
  );
}

// Export the profile screen component.
export default ProfileMainScreen;
