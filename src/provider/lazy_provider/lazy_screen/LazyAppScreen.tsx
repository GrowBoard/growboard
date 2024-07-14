import { lazy } from 'react';
import { LazyComponentProvider } from '../component';

const App = lazy(() => import('../../../App'));

const LazyAppComponent = () => {
  return (
    <LazyComponentProvider>
      <App />
    </LazyComponentProvider>
  );
};

export { LazyAppComponent };
