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

const LandingScreen = lazy(
  () => import('@screens/public/landing_screen/LandingScreen'),
);
export const LazyLandingScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <LandingScreen />
    </LazyComponentProvider>
  );
};
