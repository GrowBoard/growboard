import { lazy } from 'react';
import LazyComponentProvider from '../component/LazyComponent';

const LoginScreen = lazy(
  () => import('@screens/public/login_screen/LoginScreen'),
);
export const LazyLoginScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <LoginScreen />
    </LazyComponentProvider>
  );
};

const SignupScreen = lazy(
  () => import('@screens/public/signup_screen/SignupScreen'),
);
export const LazySignupScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <SignupScreen />
    </LazyComponentProvider>
  );
};

const VerifyUser = lazy(() => import('@screens/public/VerifyUser/VerifyUser'));
export const LazyVerifyUserScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <VerifyUser />
    </LazyComponentProvider>
  );
};

const ForgotPasswordScreen = lazy(
  () => import('@screens/public/forgot_password/ForgotPassword'),
);
export const LazyForgotPasswordScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <ForgotPasswordScreen />
    </LazyComponentProvider>
  );
};

const ResetPasswordScreen = lazy(
  () => import('@screens/public/reset_password/ResetPasswordScreen'),
);
export const LazyResetPasswordScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <ResetPasswordScreen />
    </LazyComponentProvider>
  );
};
