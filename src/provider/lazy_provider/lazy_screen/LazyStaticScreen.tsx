import { lazy } from 'react';
import LazyComponentProvider from '../component/LazyComponent';

const Error404 = lazy(() => import('@screens/static_screen/404'));

const LazyError404ScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <Error404 />
    </LazyComponentProvider>
  );
};

const PrivacyPolicy = lazy(
  () => import('@screens/static_screen/PrivacyPolicy'),
);
export const LazyPrivacyPolicyScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <PrivacyPolicy />
    </LazyComponentProvider>
  );
};

const DataPolicy = lazy(
  () => import('@screens/static_screen/DataPolicy'),
);
export const LazyDataPolicyScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <DataPolicy />
    </LazyComponentProvider>
  );
};

const TermsAndConditions = lazy(
  () => import('@screens/static_screen/TermsAndConditions'),
);
export const LazyTermsScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <TermsAndConditions />
    </LazyComponentProvider>
  );
};

export { LazyError404ScreenComponent };

