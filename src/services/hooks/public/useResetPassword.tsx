import { resetPassword } from '../../backend';
import { useCallSBMutation } from '../common';
import { useErrorToast, useSuccessToast } from '@components';

const useResetPassword = () => {
  const errorToast = useErrorToast();
  const successToast = useSuccessToast();
  return useCallSBMutation({
    method: (data: { password: string }) => resetPassword(data),
    mutationOptions: {
      onSuccess: () => {
        successToast('Password reset successful.');
      },
      onError: (error) => {
        errorToast(error.message);
      },
    },
  });
};

export default useResetPassword;
