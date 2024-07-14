import { lazy } from 'react';
import LazyComponentProvider from '../component/LazyComponent';

// Projects screens lazy components.
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

const ProjectMainScreen = lazy(
  () =>
    import('@screens/private/screens/projects/project_main/ProjectMainScreen'),
);
const LazyProjectMainScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <ProjectMainScreen />
    </LazyComponentProvider>
  );
};

const ProjectPreviewScreen = lazy(
  () =>
    import(
      '@screens/private/screens/projects/project_preview/ProjectPreviewScreen'
    ),
);
const LazyProjectPreviewComponent = () => {
  return (
    <LazyComponentProvider>
      <ProjectPreviewScreen />
    </LazyComponentProvider>
  );
};

const ProjectEditScreen = lazy(
  () =>
    import('@screens/private/screens/projects/project_edit/ProjectEditScreen'),
);
const LazyProjectEditComponent = () => {
  return (
    <LazyComponentProvider>
      <ProjectEditScreen />
    </LazyComponentProvider>
  );
};

const ProjectAddScreen = lazy(
  () =>
    import('@screens/private/screens/projects/project_add/ProjectAddScreen'),
);
const LazyProjectAddComponent = () => {
  return (
    <LazyComponentProvider>
      <ProjectAddScreen />
    </LazyComponentProvider>
  );
};

const ProjectDeleteScreen = lazy(
  () =>
    import(
      '@screens/private/screens/projects/project_delete/ProjectDeleteScreen'
    ),
);
const LazyProjectDeleteComponent = () => {
  return (
    <LazyComponentProvider>
      <ProjectDeleteScreen />
    </LazyComponentProvider>
  );
};

export {
  LazyProjectsScreenComponent,
  LazyProjectMainScreenComponent,
  LazyProjectPreviewComponent,
  LazyProjectEditComponent,
  LazyProjectAddComponent,
  LazyProjectDeleteComponent,
};
