import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import {
  ProfileIcon,
  SettingsIcon,
  LogoutIcon,
  ProfilePlaceholder,
  GrowboardIcon,
} from '@assets';
import { NavigationComponentProps } from './types';
import { authNameSelector, authPictureSelector, useShallow } from '@selectors';
import { appStore } from '@store';
import { useColorMode } from '../Theme';
import { Box, Button, HStack, Menu, Text } from '@chakra-ui/react';

const SunIconAnimated = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{
      width: '20px',
      height: '20px',
      transform: 'rotate(0deg) scale(1)',
      transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      animation: 'spin 10s linear infinite',
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
    />
  </svg>
);

const MoonIconAnimated = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{
      width: '20px',
      height: '20px',
      transform: 'rotate(0deg) scale(1)',
      transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      animation: 'pulse 2s ease-in-out infinite',
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
    />
  </svg>
);

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
  const picture = appStore(useShallow(authPictureSelector));

  return (
    <Box
      bg="bg.panel"
      borderBottom="1px solid"
      borderColor="border.subtle"
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      paddingX={4}
      h={'7%'}
      pos={'sticky'}
      top={0}
      zIndex={10}
    >
      <Box flex={1}>
        <NavLink to="" style={{ display: 'inline-block' }}>
          <Button variant={'ghost'} p={0} _hover={{ bg: 'transparent' }}>
            <HStack gap={2} align="center">
              <GrowboardIcon width="32px" height="32px" />
              <Text fontWeight="bold" fontSize="lg" color="text.primary">
                Growboard
              </Text>
            </HStack>
          </Button>
        </NavLink>
      </Box>
      <HStack gap={4} h={'100%'} alignItems={'center'}>
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button variant="ghost" borderRadius="full" p={0} w="40px" h="40px">
              <Box
                w="40px"
                h="40px"
                borderRadius="full"
                overflow="hidden"
                border="2px solid"
                borderColor="border.avatar"
              >
                {picture ? (
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
                ) : (
                  <ProfilePlaceholder />
                )}
              </Box>
            </Button>
          </Menu.Trigger>
          <Menu.Positioner>
            <Menu.Content
              bg="bg.cardHeader"
              borderColor="border.subtle"
              border="1px solid"
              p={2}
              borderRadius="md"
              shadow="xl"
              zIndex={1100}
              minW="200px"
            >
              <Menu.Item
                value="hi"
                disabled
                color="text.secondary"
                px={3}
                py={2}
                fontSize="sm"
              >
                {t('ProfileMenuOption.hiText', {
                  name: name,
                })}
              </Menu.Item>
              <Menu.Item value="profile" asChild>
                <NavLink
                  to={'/profile/preview'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    color: 'var(--chakra-colors-text-primary)',
                    width: '100%',
                  }}
                >
                  <ProfileIcon />
                  {t('ProfileMenuOption.profile')}
                </NavLink>
              </Menu.Item>

              <Menu.Item value="settings" asChild>
                <NavLink
                  to={'/profile/settings'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    color: 'var(--chakra-colors-text-primary)',
                    width: '100%',
                  }}
                >
                  <SettingsIcon />
                  {t('ProfileMenuOption.settings')}
                </NavLink>
              </Menu.Item>

              <Menu.Item
                value="theme-toggle"
                onClick={toggleColorMode}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '100%',
                  color: 'var(--chakra-colors-text-primary)',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {colorMode === 'dark' ? (
                    <SunIconAnimated />
                  ) : (
                    <MoonIconAnimated />
                  )}
                  <span>
                    {colorMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </div>
                {/* Visual toggle switch/indicator */}
                <div
                  style={{
                    width: '36px',
                    height: '20px',
                    borderRadius: '10px',
                    backgroundColor:
                      colorMode === 'dark' ? '#00D8FF' : '#CBD5E1',
                    position: 'relative',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      position: 'absolute',
                      top: '2px',
                      left: colorMode === 'dark' ? '18px' : '2px',
                      transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                    }}
                  />
                </div>
              </Menu.Item>

              <Menu.Item
                value="logout"
                onClick={props.logOutClickHandler}
                color="red.400"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <LogoutIcon />
                {t('ProfileMenuOption.logout')}
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      </HStack>
    </Box>
  );
};

export default NavigationComponent;
