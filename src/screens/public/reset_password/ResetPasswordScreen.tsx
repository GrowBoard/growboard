import { useState } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import {
  InputText,
  InputType,
  LandingIntro,
  TitleBoxContainer,
  useErrorToast,
} from '@components';
import { useTranslation } from 'react-i18next';
import { ResetPasswordCred } from './types';
import { validatePassword } from '../../../util/input/Input';

import { HStack, Box, VStack, Button, Text } from '@chakra-ui/react';
import { usePingTest, useResetPasswordFp } from '@services';

/**
 * Prop types for the update form value function.
 */
interface UpdateProps {
  updateType: string;
  value: string;
}

/**
 * Component definition for the reset password screen.
 *
 * @returns The Reset password screen.
 */
const ResetPassword = () => {
  const { t } = useTranslation();
  const toast = useErrorToast();
  const { mutate, isPending } = useResetPasswordFp();
  const [searchParams] = useSearchParams();
  const user_id = searchParams.get('u'); // "testCode"

  const { isLoading: isServerStarting, isError: isServerHasError } =
    usePingTest();
  const INITIAL_REGISTER_OBJ: ResetPasswordCred = {
    password: '',
    confirmPassword: '',
  };

  const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ);

  const submitForm = (e: any) => {
    e.preventDefault();
    if (user_id === null) {
      return;
    }

    if (
      registerObj.password.trim() === '' ||
      registerObj.confirmPassword.trim() === ''
    ) {
      toast('SignUpError.passwordRequired');
    } else if (!validatePassword(registerObj.password)) {
      toast('SignUpError.passwordPolicy');
    } else if (registerObj.password !== registerObj.confirmPassword) {
      toast('SignUpError.passwordMismatch');
    }

    mutate({ ...registerObj, user_id: user_id });
  };

  const updateFormValue = ({ updateType, value }: UpdateProps) => {
    setRegisterObj({ ...registerObj, [updateType]: value });
  };

  return (
    <TitleBoxContainer
      title="Growboard | Signup"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1614624532983-4ce03382d63d)',
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
            <VStack width={'100%'}>
              <Text
                textAlign={'center'}
                fontSize={'2xl'}
                fontWeight={'bold'}
                color={'gray.900'}
              >
                {t('ResetPassword.title')}{' '}
                <Box as="span" animation="pulse 1s infinite">
                  {isServerHasError ? '🔴' : isServerStarting ? '🟡' : '🟢'}
                </Box>
              </Text>
              <InputText
                defaultValue={registerObj.password}
                updateType="password"
                containerStyle="mt-2"
                type={InputType.PASSWORD}
                labelTitle={t('Account.input.password')}
                updateFormValue={updateFormValue}
              />
              <InputText
                defaultValue={registerObj.confirmPassword}
                type={InputType.PASSWORD}
                updateType="confirmPassword"
                containerStyle="mt-2"
                labelTitle={t('Account.input.confirmPassword')}
                updateFormValue={updateFormValue}
              />
            </VStack>
            <Box textAlign={'right'} color={'gray.500'} mt={4} w={'100%'}>
              <Button
                as={NavLink}
                size={'sm'}
                to="/forgot-password"
                variant="link"
                colorScheme="blue"
              >
                {t('Account.forgotPassword')}
              </Button>
              <Button
                width={'100%'}
                colorScheme="blue"
                onClick={submitForm}
                isLoading={isPending}
                isDisabled={isServerStarting || isServerHasError || isPending}
              >
                {t('ResetPassword.resetButton')}
              </Button>
            </Box>
          </VStack>
          <Box mt={2} textAlign={'center'}>
            {t('Account.alreadyAccount')}
            <Button as={NavLink} to="/login" variant="link" colorScheme="blue">
              {t('Account.login')}
            </Button>
          </Box>
        </VStack>
      </HStack>
    </TitleBoxContainer>
  );
};

// Export the Register component.
export default ResetPassword;
