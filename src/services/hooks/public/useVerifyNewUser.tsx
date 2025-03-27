import { useNavigate } from 'react-router-dom';
import { verifyNewUser } from '../../backend';
import { useCallSBMutation } from '../common';
import { useErrorToast, useSuccessToast } from '@components';

const useVerifyNewUser = () => {
  const errorToast = useErrorToast();
  const navigate = useNavigate();
  const successToast = useSuccessToast();
  return useCallSBMutation({
    method: (data: { token: string }) => verifyNewUser(data),
    mutationOptions: {
      onSuccess: (data) => {
        successToast('User verification successful. Please login.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      },
      onError: (error) => {
        errorToast((error as any).response.data.errorMessage);
      },
    },
  });
};

export default useVerifyNewUser;
