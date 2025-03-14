import { registerUser } from '../../backend';
import { useCallSBMutation } from '../common';
import { useErrorToast, useSuccessToast } from '@components';

const useRegisterUser = () => {
  const errorToast = useErrorToast();
  const successToast = useSuccessToast();
  return useCallSBMutation({
    method: (data: { name: string; email: string; password: string }) =>
      registerUser(data),
    mutationOptions: {
      onSuccess: () => {
        successToast(
          'User registration successful. Please verify the email sent to your email address.',
        );
      },
      onError: (error) => {
        errorToast(error.message);
      },
    },
  });
};

export default useRegisterUser;
