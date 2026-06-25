import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import {
  ProfileIcon,
  PasswordResetIcon,
  SettingsIcon,
  LogoutIcon,
  ProfilePlaceholder,
  GrowboardIcon,
} from '@assets';
import { NavigationComponentProps } from './types';
import { authNameSelector, useShallow } from '@selectors';
import { appStore } from '@store';
import { Box, Button, HStack, Menu, Switch, Text } from '@chakra-ui/react';
import { useColorMode } from '../Theme';

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
      bgColor={colorMode === 'dark' ? 'gray.900' : 'blue.50'}
      borderBottom="1px solid"
      borderColor={colorMode === 'dark' ? 'gray.800' : 'blue.100'}
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
              <Text
                fontWeight="bold"
                fontSize="lg"
                color={colorMode === 'dark' ? 'white' : 'gray.800'}
              >
                Growboard
              </Text>
            </HStack>
          </Button>
        </NavLink>
      </Box>
      <HStack gap={4} h={'100%'} alignItems={'center'}>
        <Box display="flex" alignItems="center" gap={2}>
          <Switch.Root
            checked={colorMode === 'dark'}
            onCheckedChange={() => toggleColorMode()}
            colorPalette="blue"
            size="md"
          >
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Root>
        </Box>
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button variant="ghost" borderRadius="full" p={0} w="40px" h="40px">
              <Box w="40px" h="40px" borderRadius="full" overflow="hidden">
                <ProfilePlaceholder />
              </Box>
            </Button>
          </Menu.Trigger>
          <Menu.Content
            bg="gray.850"
            borderColor="gray.700"
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
              color="gray.400"
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
                  color: 'white',
                  width: '100%',
                }}
              >
                <ProfileIcon />
                {t('ProfileMenuOption.profile')}
              </NavLink>
            </Menu.Item>
            <Menu.Item value="reset" asChild>
              <NavLink
                to={'/profile/reset'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  color: 'white',
                  width: '100%',
                }}
              >
                <PasswordResetIcon />
                {t('ProfileMenuOption.passwordReset')}
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
                  color: 'white',
                  width: '100%',
                }}
              >
                <SettingsIcon />
                {t('ProfileMenuOption.settings')}
              </NavLink>
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
        </Menu.Root>
      </HStack>
    </Box>
  );
};

export default NavigationComponent;
