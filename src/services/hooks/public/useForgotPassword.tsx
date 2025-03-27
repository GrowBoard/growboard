import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../backend';
import { useCallSBMutation } from '../common';
import { useErrorToast, useSuccessToast } from '@components';

const useForgotPassword = () => {
  const navigate = useNavigate();
  const errorToast = useErrorToast();
  const successToast = useSuccessToast();
  return useCallSBMutation({
    method: (data: { email: string }) => forgotPassword(data),
    mutationOptions: {
      onSuccess: (data) => {
        successToast(
          'Please use the link to reset password, email sent to your email address.',
        );
        navigate('/login');
      },
      onError: (error) => {
        errorToast(error.message);
      },
    },
  });
};

export default useForgotPassword;
