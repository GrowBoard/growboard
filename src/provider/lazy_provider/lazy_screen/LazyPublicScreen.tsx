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
