import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import {
  ProfileIcon,
  PasswordResetIcon,
  SettingsIcon,
  LogoutIcon,
  ProfilePlaceholder,
} from '@assets';
import { NavigationComponentProps } from './types';

import { authNameSelector, useShallow } from '@selectors';
import { appStore } from '@store';
import { Box, Button, HStack, useColorMode } from '@chakra-ui/react';

/**
 * Navigation component.
 *
 * @param props  The navigation component props.
 * @returns The navigation component.
 */
const NavigationComponent = (props: NavigationComponentProps) => {
  const { t } = useTranslation();
  const { colorMode, toggleColorMode } = useColorMode();
  const name = appStore(useShallow(authNameSelector));

  return (
    <Box
      bgColor={'blue.100'}
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      paddingX={2}
      h={'7%'}
      pos={'sticky'}
      top={0}
      zIndex={10}
      px={4}
    >
      {/* <div className="flex-none">
        <button
          className="btn btn-square btn-ghost"
          onClick={props.openSidebarClickHandler}
        >
          <NavigationToggleButton
            openSidebarClickHandler={props.openSidebarClickHandler}
          />
        </button>
      </div> */}
      <Box className="flex-1">
        <Button
          as={NavLink}
          to={''}
          variant={'outline'}
          colorScheme={'blue'}
          borderColor={'blue.200'}
        >
          <img
            src={require('../../assets/images/logo-no-bg.png')}
            className=" w-36 inline-block"
            alt="Dashwave-logo"
          />
        </Button>
      </Box>
      <HStack spacing={2} h={'100%'} alignItems={'center'}>
        <div className="px-2">
          <input
            checked={colorMode === 'dark'}
            type="checkbox"
            value="night"
            onChange={toggleColorMode}
            className=" toggle theme-controller bg-amber-300 border-sky-400 [--tglbg:theme(colors.sky.500)] checked:bg-blue-300 checked:border-blue-800 checked:[--tglbg:theme(colors.blue.900)] row-start-1 col-start-1 col-span-2"
          />
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <ProfilePlaceholder />
              {/* {profileState.profilePicture === '' ? (
              ) : (
                <img
                  alt="Tailwind CSS Navbar component"
                  src={profileState.profilePicture}
                />
              )} */}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-md dropdown-content bg-base-300 rounded-box w-52 drop-shadow-2xl"
          >
            <li className="menu-title">
              <span>
                {t('ProfileMenuOption.hiText', {
                  name: name,
                })}
              </span>
            </li>
            <li className="m-1">
              <NavLink className="justify-between" to={'/profile/preview'}>
                <div className="flex flex-row gap-2 items-center">
                  <ProfileIcon />
                  {t('ProfileMenuOption.profile')}
                </div>
                <span className="badge">New</span>
              </NavLink>
            </li>
            <li className="m-1">
              <NavLink to={'/profile/reset'}>
                <PasswordResetIcon />
                {t('ProfileMenuOption.passwordReset')}
              </NavLink>
            </li>
            <li className="m-1">
              <NavLink to={'/profile/settings'}>
                <SettingsIcon />
                {t('ProfileMenuOption.settings')}
              </NavLink>
            </li>
            <li className="m-1">
              <button
                onClick={props.logOutClickHandler}
                className=" bg-error text-error-content"
              >
                <LogoutIcon />
                {t('ProfileMenuOption.logout')}
              </button>
            </li>
          </ul>
        </div>
      </HStack>
    </Box>
  );
};

export default NavigationComponent;
