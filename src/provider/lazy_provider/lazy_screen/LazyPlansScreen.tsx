import { lazy } from 'react';
import LazyComponentProvider from '../component/LazyComponent';

const PlansScreen = lazy(
  () => import('@screens/private/screens/plans/PlansScreen'),
);

const LazyPlansScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <PlansScreen />
    </LazyComponentProvider>
  );
};

export { LazyPlansScreenComponent };
export default LazyPlansScreenComponent;
