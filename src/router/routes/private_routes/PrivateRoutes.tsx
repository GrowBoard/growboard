import {
  LazyHomeScreenComponent,
  LazyDashboardScreenComponent,
} from '@provider';
import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromChildren,
} from 'react-router-dom';
import {
  ProjectRoutes,
  PlanRoutes,
  ExpensesRoutes,
  GoalsRoutes,
  ResourceRoutes,
  LearningRoutes,
  CredsRoutes,
  ProfileRoutes,
} from './sub_routes';

export const privateRouter = createBrowserRouter(
  createRoutesFromChildren(
    <Route path="/" element={<LazyHomeScreenComponent />}>
      <Route path="" element={<Navigate to="/dashboard" replace />} />
      <Route path="dashboard" element={<LazyDashboardScreenComponent />} />
      <Route path="login" element={<Navigate to="/dashboard" replace />} />
      {ExpensesRoutes}
      {ProjectRoutes}
      {PlanRoutes}
      {GoalsRoutes}
      {ResourceRoutes}
      {LearningRoutes}
      {CredsRoutes}
      {ProfileRoutes}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Route>,
  ),
);
