import { forgotPassword } from '../../backend';
import { useCallSBMutation } from '../common';
import { appStore } from '@store';
import { setAuthSelector, useShallow } from '@selectors';
import { useErrorToast, useSuccessToast } from '@components';

const useForgotPassword = () => {
  const errorToast = useErrorToast();
  const successToast = useSuccessToast();
  const setAuthToken = appStore(useShallow(setAuthSelector));
  return useCallSBMutation({
    method: (data: { email: string }) => forgotPassword(data),
    mutationOptions: {
      onSuccess: (data) => {
        successToast(
          'Please use the link to email sent to your email address.',
        );
        setAuthToken(data.data.token);
      },
      onError: (error) => {
        errorToast(error.message);
      },
    },
  });
};

export default useForgotPassword;
