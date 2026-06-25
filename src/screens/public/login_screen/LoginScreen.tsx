import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  LandingIntro,
  TitleBoxContainer,
  useSuccessToast,
} from '@components';

import { useTranslation } from 'react-i18next';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { appStore } from '@store';
import { setAuthSelector, useShallow } from '@selectors';
import { GROWBOARD_BACKEND_URL } from '@services/backend/requests/constants';

const GoogleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginRight: '8px' }}
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

/**
 * Component definition for the login screen.
 * @returns The Login component.
 */
const LoginScreen = () => {
  const { t } = useTranslation();
  const successToast = useSuccessToast();
  const setAuthData = appStore(useShallow(setAuthSelector));
  const [searchParams, setSearchParams] = useSearchParams();

  const tokenParam = searchParams.get('token');
  const nameParam = searchParams.get('name');
  const emailParam = searchParams.get('email');

  useEffect(() => {
    if (tokenParam && nameParam && emailParam) {
      setAuthData({
        token: tokenParam,
        name: decodeURIComponent(nameParam),
        email: decodeURIComponent(emailParam),
      });
      successToast('Google login successful.');
      setSearchParams({}, { replace: true });
    }
  }, [tokenParam, nameParam, emailParam, setAuthData, setSearchParams, successToast]);

  const loginWithGoogle = () => {
    window.location.href = `${GROWBOARD_BACKEND_URL}/auth/google`;
  };

  return (
    <TitleBoxContainer
      title="Login"
      style={{
        backgroundColor: '#121416',
        backgroundImage:
          'radial-gradient(circle at 80% 20%, rgba(0, 216, 255, 0.08), transparent 45%), radial-gradient(circle at 20% 80%, rgba(97, 61, 194, 0.08), transparent 45%)',
      }}
      h={'100vh'}
      w={'100%'}
      alignItems={'center'}
      justifyContent={'center'}
      display={'flex'}
    >
      <Box
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        height={{ base: 'auto', md: '75vh', lg: '70vh' }}
        maxH={{ base: 'none', md: '650px' }}
        width={{ base: '90%', sm: '80%', md: '80%', lg: '70%', xl: '65%' }}
        maxWidth="1100px"
        bg="rgba(23, 25, 28, 0.45)"
        backdropFilter="blur(20px)"
        border="1px solid"
        borderColor="rgba(255, 255, 255, 0.08)"
        borderRadius="2xl"
        boxShadow="0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
        overflow="hidden"
        mx="auto"
        my={{ base: 8, md: 0 }}
      >
        <Box
          display={{ base: 'none', md: 'flex' }}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100%"
          width="50%"
          bg="rgba(18, 20, 22, 0.55)"
          borderRight="1px solid"
          borderColor="rgba(255, 255, 255, 0.06)"
          p={8}
        >
          <LandingIntro />
        </Box>
        <VStack
          width={{ base: '100%', md: '50%' }}
          height="100%"
          py={{ base: 12, md: 16 }}
          px={{ base: 6, sm: 8, md: 10 }}
          justifyContent="center"
          alignItems="stretch"
          bg="transparent"
        >
          <VStack justifyContent="center" w="100%" h="100%" gap={8}>
            <Text
              textAlign="center"
              fontSize="2xl"
              fontWeight="extrabold"
              color="white"
              letterSpacing="tight"
            >
              {t('LoginScreen.title')}
            </Text>

            <Button
              width="100%"
              bg="rgba(255, 255, 255, 0.03)"
              color="white"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.08)"
              fontWeight="semibold"
              size="lg"
              borderRadius="lg"
              transition="all 0.2s"
              _hover={{
                bg: 'rgba(255, 255, 255, 0.07)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.05)',
              }}
              _active={{ bg: 'rgba(255, 255, 255, 0.1)' }}
              onClick={loginWithGoogle}
              py={7}
            >
              <GoogleIcon />
              Continue with Google
            </Button>
          </VStack>
        </VStack>
      </Box>
    </TitleBoxContainer>
  );
};

export default LoginScreen;
