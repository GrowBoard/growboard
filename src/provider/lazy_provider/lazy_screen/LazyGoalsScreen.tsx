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

const GoalsMainScreen = lazy(
  () => import('@screens/private/screens/goals/goals_main/GoalsMain'),
);

const LazyGoalsMainScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <GoalsMainScreen />
    </LazyComponentProvider>
  );
};

const GoalsPreviewScreen = lazy(
  () => import('@screens/private/screens/goals/goals_preview/GoalsPreview'),
);

const LazyGoalsPreviewScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <GoalsPreviewScreen />
    </LazyComponentProvider>
  );
};

const GoalsEditScreen = lazy(
  () => import('@screens/private/screens/goals/goals_edit/GoalsEdit'),
);

const LazyGoalsEditScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <GoalsEditScreen />
    </LazyComponentProvider>
  );
};

const GoalsAddScreen = lazy(
  () => import('@screens/private/screens/goals/goals_add/GoalsAdd'),
);

const LazyGoalsAddScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <GoalsAddScreen />
    </LazyComponentProvider>
  );
};

const GoalsDeleteScreen = lazy(
  () => import('@screens/private/screens/goals/goals_delete/GoalsDelete'),
);
const LazyGoalsDeleteScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <GoalsDeleteScreen />
    </LazyComponentProvider>
  );
};

export {
  LazyGoalsScreenComponent,
  LazyGoalsAddScreenComponent,
  LazyGoalsDeleteScreenComponent,
  LazyGoalsEditScreenComponent,
  LazyGoalsMainScreenComponent,
  LazyGoalsPreviewScreenComponent,
};
