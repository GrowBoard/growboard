import { lazy } from 'react';
import LazyComponentProvider from '../component/LazyComponent';

const CredsScreen = lazy(
  () => import('@screens/private/screens/creds/CredsScreen'),
);

const LazyCredsScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <CredsScreen />
    </LazyComponentProvider>
  );
};

export { LazyCredsScreenComponent };
