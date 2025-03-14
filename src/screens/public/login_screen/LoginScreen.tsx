import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  InputText,
  InputType,
  LandingIntro,
  TitleBoxContainer,
  useErrorToast,
} from '@components';

import { validatePassword } from '../../../util/input/Input';
import { useTranslation } from 'react-i18next';
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import { useLoginUser, usePingTest } from '@services/hooks';

interface UpdateProps {
  updateType: string;
  value: string;
}

/**
 * Component definition for the login screen.
 * @returns The Login component.
 */
const LoginScreen = () => {
  const { t } = useTranslation();
  const toast = useErrorToast();
  const INITIAL_LOGIN_OBJ = {
    password: '',
    email: '',
  };

  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
  const { isLoading: isServerStarting, isError: isServerHasError } =
    usePingTest();
  const { mutate } = useLoginUser();

  const submitForm = (e: any) => {
    e.preventDefault();
    if (loginObj.email.trim() === '') {
      toast('LoginError.emailRequired');
      return;
    }
    if (loginObj.password.trim() === '') {
      toast('LoginError.passwordRequired');
      return;
    } else if (!validatePassword(loginObj.password)) {
      toast('LoginError.passwordPolicy');
      return;
    }

    mutate(loginObj);
  };

  const updateFormValue = ({ updateType, value }: UpdateProps) => {
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  return (
    <TitleBoxContainer
      title="Login"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1507090960745-b32f65d3113a)',
        backgroundSize: 'cover',
      }}
      h={'100vh'}
      w={'100%'}
      alignItems={'center'}
      justifyContent={'center'}
      display={'flex'}
    >
      <HStack spacing={0} height={'80vh'} width={'70%'}>
        <Box
          height={'100%'}
          width={'50%'}
          bgColor="#FFFFFF3f"
          backdropFilter="blur(10px)"
          borderLeftRadius={10}
        >
          <LandingIntro />
        </Box>
        <VStack
          width={'50%'}
          height={'100%'}
          py={16}
          px={10}
          borderRightRadius={10}
          bg={'blue.100'}
        >
          <VStack justifyContent={'space-between'} w={'100%'} h={'100%'}>
            <VStack w={'100%'}>
              <Text
                textAlign={'center'}
                fontSize={'2xl'}
                fontWeight={'bold'}
                color={'gray.900'}
                mb={4}
              >
                {t('LoginScreen.title')}
                <Box as="span" animation="pulse 1s infinite" fontSize={'md'}>
                  {isServerHasError ? '🔴' : isServerStarting ? '🟡' : '🟢'}
                </Box>
              </Text>
              <InputText
                type={InputType.EMAIL}
                defaultValue={loginObj.email}
                updateType="email"
                containerStyle="mt-4"
                labelTitle={t('Account.input.email')}
                updateFormValue={updateFormValue}
                errorState={false}
              />
              <InputText
                defaultValue={loginObj.password}
                type={InputType.PASSWORD}
                updateType="password"
                containerStyle="mt-4"
                labelTitle={t('Account.input.password')}
                updateFormValue={updateFormValue}
                errorState={false}
              />
            </VStack>
            <Box textAlign={'right'} color={'gray.500'} w={'100%'}>
              <Button
                as={NavLink}
                size={'sm'}
                to="/forgot_password"
                variant="link"
                colorScheme="blue"
              >
                {t('Account.forgotPassword')}
              </Button>
              <Button
                width={'100%'}
                colorScheme="blue"
                isDisabled={isServerStarting || isServerHasError}
                onClick={submitForm}
              >
                {t('LoginScreen.loginButton')}
              </Button>
            </Box>
          </VStack>
          <Box mt={4} textAlign={'center'}>
            {t('Account.noAccountText')}
            <Button as={NavLink} to="/signup" variant="link" colorScheme="blue">
              {t('Account.register')}
            </Button>
          </Box>
        </VStack>
      </HStack>
    </TitleBoxContainer>
  );
};

// Export the Login component.
export default LoginScreen;
