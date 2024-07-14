import { lazy } from 'react';
import LazyComponentProvider from '../component/LazyComponent';

const LoginScreen = lazy(
  () => import('@screens/public/login_screen/LoginScreen'),
);
const LazyLoginScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <LoginScreen />
    </LazyComponentProvider>
  );
};

const SignupScreen = lazy(
  () => import('@screens/public/signup_screen/SignupScreen'),
);
const LazySignupScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <SignupScreen />
    </LazyComponentProvider>
  );
};

const ForgotPasswordScreen = lazy(
  () => import('@screens/public/forgot_password/ForgotPassword'),
);
const LazyForgotPasswordScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <ForgotPasswordScreen />
    </LazyComponentProvider>
  );
};

export {
  LazyLoginScreenComponent,
  LazySignupScreenComponent,
  LazyForgotPasswordScreenComponent,
};
