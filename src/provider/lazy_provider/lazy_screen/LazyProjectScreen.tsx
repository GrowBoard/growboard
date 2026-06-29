import { lazy } from 'react';
import LazyComponentProvider from '../component/LazyComponent';

const ProjectsScreen = lazy(
  () => import('@screens/private/screens/projects/ProjectScreen'),
);

const LazyProjectsScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <ProjectsScreen />
    </LazyComponentProvider>
  );
};

export { LazyProjectsScreenComponent };
export default LazyProjectsScreenComponent;
