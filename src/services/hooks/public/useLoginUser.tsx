import { loginUser } from '../../backend';
import { useCallSBMutation } from '../common';
import { appStore } from '@store';
import { setAuthSelector, useShallow } from '@selectors';
import { useErrorToast, useSuccessToast } from '@components';

const useLoginUser = () => {
  const errorToast = useErrorToast();
  const successToast = useSuccessToast();
  const setAuthData = appStore(useShallow(setAuthSelector));
  return useCallSBMutation({
    method: (data: { email: string; password: string }) => loginUser(data),
    mutationOptions: {
      onSuccess: (data) => {
        if (data) {
          successToast('User login successful.');
          setAuthData(data.data);
          return;
        }

        errorToast('User login failed');
      },
      onError: (error) => {
        errorToast((error as any).response.data.errorMessage);
      },
    },
  });
};

export default useLoginUser;
