import { resetPasswordFp } from '../../backend';
import { useCallSBMutation } from '../common';
import { useErrorToast, useSuccessToast } from '@components';

const useResetPasswordFp = () => {
  const errorToast = useErrorToast();
  const successToast = useSuccessToast();
  return useCallSBMutation({
    method: (data: { password: string; user_id: string }) =>
      resetPasswordFp(data),
    mutationOptions: {
      onSuccess: () => {
        successToast(
          'Password reset successful. Please login with your new password.',
        );
      },
      onError: (error) => {
        errorToast(error.name);
      },
    },
  });
};

export default useResetPasswordFp;
