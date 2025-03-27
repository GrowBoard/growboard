import {
  LandingIntro,
  PageLoadingComponent,
  TitleBoxContainer,
} from '@components';

import { HStack, Box, VStack, Text } from '@chakra-ui/react';
import { useVerifyNewUser } from '@services';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { isNil } from 'lodash';

/**
 * Component definition for the register screen.
 *
 * @returns The Register component.
 */
const UserVerified = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useVerifyNewUser();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // "testCode"

  useEffect(() => {
    if (isNil(token)) {
      navigate('/login');
      return;
    }

    mutate({ token: token });
  }, [token, mutate, navigate]);

  return (
    <TitleBoxContainer
      title="Verify user"
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
          <VStack w={'100%'} h={'100%'}>
            <Text
              textAlign={'center'}
              fontSize={'2xl'}
              fontWeight={'bold'}
              color={'gray.900'}
            >
              {isPending
                ? 'Verifying user...'
                : 'User successfully verified! Please login.'}
              {isPending && <PageLoadingComponent />}
            </Text>
          </VStack>
        </VStack>
      </HStack>
    </TitleBoxContainer>
  );
};

export default UserVerified;
