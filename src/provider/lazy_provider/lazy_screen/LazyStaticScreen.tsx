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

export { LazyError404ScreenComponent };
