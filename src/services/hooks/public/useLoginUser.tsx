import { useToast } from '@chakra-ui/react';
import { loginUser } from '../../backend';
import { useCallSBMutation } from '../common';
import { appStore } from '@store';
import { setAuthTokenSelector, useShallow } from '@selectors';

const useLoginUser = () => {
  const toast = useToast();
  const setAuthToken = appStore(useShallow(setAuthTokenSelector));
  return useCallSBMutation({
    method: (data: { email: string; password: string }) => loginUser(data),
    mutationOptions: {
      onSuccess: (data) => {
        toast({
          title: 'User login successful.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setAuthToken(data.data.token);
      },
      onError: () => {
        toast({
          title: 'Error.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      },
    },
  });
};

export default useLoginUser;
