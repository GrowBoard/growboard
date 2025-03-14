import { forgotPassword } from '../../backend';
import { useCallSBMutation } from '../common';
import { appStore } from '@store';
import { setAuthTokenSelector, useShallow } from '@selectors';
import { useErrorToast, useSuccessToast } from '@components';

const useForgotPassword = () => {
  const errorToast = useErrorToast();
  const successToast = useSuccessToast();
  const setAuthToken = appStore(useShallow(setAuthTokenSelector));
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
