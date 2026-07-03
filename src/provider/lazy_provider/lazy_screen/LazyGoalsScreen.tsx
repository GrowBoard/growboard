import { lazy } from 'react';
import LazyComponentProvider from '../component/LazyComponent';

const GoalsScreen = lazy(
  () => import('@screens/private/screens/goals/GoalsScreen'),
);

const LazyGoalsScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <GoalsScreen />
    </LazyComponentProvider>
  );
};

export { LazyGoalsScreenComponent };
