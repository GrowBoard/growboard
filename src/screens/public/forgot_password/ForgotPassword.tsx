import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { validateEmail } from '../../../util/input/Input';
import {
  InputText,
  InputType,
  LandingIntro,
  TitleBoxContainer,
  useErrorToast,
} from '@components';
import { useTranslation } from 'react-i18next';
import { HStack, Box, VStack, Button, Text } from '@chakra-ui/react';
import { useForgotPassword } from '@services';

/**
 * Update props.
 */
interface UpdateProps {
  updateType: string;
  value: string;
}

/**
 * Register object type.
 */
interface RegisterObjType {
  email: string;
}

/**
 * The forgot password screen component.
 * @returns The ForgotPassword component.
 */
function ForgotPassword() {
  const toast = useErrorToast();
  const { t } = useTranslation();
  const { mutate, isPending } = useForgotPassword();
  const INITIAL_USER_OBJ: RegisterObjType = {
    email: '',
  };

  const [userObj, setUserObj] = useState(INITIAL_USER_OBJ);

  const submitForm = (e: any) => {
    e.preventDefault();
    if (userObj.email.trim() === '')
      return toast('ForgotPasswordError.emailRequired');
    else if (!validateEmail(userObj.email)) {
      return toast('ForgotPasswordError.emailNotValid');
    } else {
      mutate(userObj);
    }
  };

  const updateFormValue = ({ updateType, value }: UpdateProps) => {
    setUserObj({ ...userObj, [updateType]: value });
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
                {t('ForgotPasswordScreen.title')}
              </Text>
              <p className="my-8 font-semibold text-center">
                {t('ForgotPasswordScreen.passwordResetLinkText')}
              </p>
              {/* <p className="my-4 text-xl font-bold text-center">
                {t('ForgotPasswordScreen.linkSent')}
              </p>
              <p className="mt-4 mb-8 font-semibold text-center">
                {t('ForgotPasswordScreen.checkEmailText')}
              </p> */}
              <InputText
                type={InputType.EMAIL}
                defaultValue={userObj.email}
                updateType="emailId"
                containerStyle="mt-4"
                labelTitle={t('Account.input.email')}
                updateFormValue={updateFormValue}
              />
            </VStack>
            <Box textAlign={'right'} color={'gray.500'} w={'100%'}>
              <Button
                width={'100%'}
                colorScheme="blue"
                isDisabled={isPending}
                isLoading={isPending}
                onClick={submitForm}
              >
                {t('ForgotPasswordScreen.sendResetLink')}
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
}

// Export the ForgotPassword component.
export default ForgotPassword;
