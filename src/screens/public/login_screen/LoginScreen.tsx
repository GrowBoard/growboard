import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { InputText, InputType, LandingIntro } from '@components';

import { validatePassword } from '../../../util/input/Input';
import { useTranslation } from 'react-i18next';
import { TitleBoxContainer } from '@components';
import { Box, Button, HStack, Text, useToast, VStack } from '@chakra-ui/react';
import { useLoginUser } from '@services/hooks';

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
  const toast = useToast();
  const INITIAL_LOGIN_OBJ = {
    password: '',
    email: '',
  };

  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
  const { mutate } = useLoginUser();

  const submitForm = (e: any) => {
    e.preventDefault();
    if (loginObj.email.trim() === '') {
      toast({
        title: t('LoginError.emailRequired'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (loginObj.password.trim() === '') {
      toast({
        title: t('LoginError.passwordRequired'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    } else if (!validatePassword(loginObj.password)) {
      toast({
        title: t('LoginError.passwordPolicy'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
          // glassmorphism
          backdropFilter="blur(10px)"
          borderLeftRadius={10}
        >
          <LandingIntro />
        </Box>
        <Box
          width={'50%'}
          height={'100%'}
          py={24}
          px={10}
          borderRightRadius={10}
          bg={'blue.100'}
        >
          <Text
            textAlign={'center'}
            fontSize={'2xl'}
            fontWeight={'bold'}
            color={'gray.900'}
            mb={4}
          >
            {t('LoginScreen.title')}
          </Text>
          <form onSubmit={(e) => submitForm(e)}>
            <VStack spacing="4">
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
            <Box textAlign={'right'} color={'gray.500'}>
              <Button
                as={NavLink}
                size={'sm'}
                to="/forgot-password"
                variant="link"
                colorScheme="blue"
              >
                {t('Account.forgotPassword')}
              </Button>
            </Box>
            <Button type="submit" width={'100%'} colorScheme="blue">
              {t('LoginScreen.loginButton')}
            </Button>
            <Box mt={4} textAlign={'center'}>
              {t('Account.noAccountText')}
              <Button
                as={NavLink}
                to="/signup"
                variant="link"
                colorScheme="blue"
              >
                {t('Account.register')}
              </Button>
            </Box>
          </form>
        </Box>
      </HStack>
    </TitleBoxContainer>
  );
};

// Export the Login component.
export default LoginScreen;
