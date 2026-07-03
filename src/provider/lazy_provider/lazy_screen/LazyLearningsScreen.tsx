import { lazy } from 'react';
import LazyComponentProvider from '../component/LazyComponent';

const LearningsScreen = lazy(
  () => import('@screens/private/screens/learnings/LearningsScreen'),
);

const LazyLearningsScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <LearningsScreen />
    </LazyComponentProvider>
  );
};

export { LazyLearningsScreenComponent };
