import { lazy } from 'react';
import LazyComponentProvider from '../component/LazyComponent';

const PlansScreen = lazy(
  () => import('@screens/private/screens/plans/PlansScreen'),
);

const PlansMainScreen = lazy(
  () => import('@screens/private/screens/plans/plans_main/PlansMain'),
);

const PlansPreviewScreen = lazy(
  () => import('@screens/private/screens/plans/plans_preview/PlansPreview'),
);

const PlansEditScreen = lazy(
  () => import('@screens/private/screens/plans/plans_edit/PlansEdit'),
);

const PlansAddScreen = lazy(
  () => import('@screens/private/screens/plans/plans_add/PlansAdd'),
);

const PlansDeleteScreen = lazy(
  () => import('@screens/private/screens/plans/plans_delete/PlansDelete'),
);

const LazyPlansScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <PlansScreen />
    </LazyComponentProvider>
  );
};

const LazyPlansMainScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <PlansMainScreen />
    </LazyComponentProvider>
  );
};

const LazyPlansPreviewScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <PlansPreviewScreen />
    </LazyComponentProvider>
  );
};

const LazyPlansEditScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <PlansEditScreen />
    </LazyComponentProvider>
  );
};

const LazyPlansAddScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <PlansAddScreen />
    </LazyComponentProvider>
  );
};

const LazyPlansDeleteScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <PlansDeleteScreen />
    </LazyComponentProvider>
  );
};

export {
  LazyPlansScreenComponent,
  LazyPlansAddScreenComponent,
  LazyPlansDeleteScreenComponent,
  LazyPlansEditScreenComponent,
  LazyPlansMainScreenComponent,
  LazyPlansPreviewScreenComponent,
};
