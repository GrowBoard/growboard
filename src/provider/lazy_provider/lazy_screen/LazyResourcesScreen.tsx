import { lazy } from 'react';
import LazyComponentProvider from '../component/LazyComponent';

const ResourcesScreen = lazy(
  () => import('@screens/private/screens/resources/ResourcesScreen'),
);

const LazyResourcesScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <ResourcesScreen />
    </LazyComponentProvider>
  );
};

export { LazyResourcesScreenComponent };
export default LazyResourcesScreenComponent;
