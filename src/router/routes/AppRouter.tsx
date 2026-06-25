import React from 'react';
import {
  Navigate,
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromChildren,
} from 'react-router-dom';
import {
  LazyHomeScreenComponent,
  LazyDashboardScreenComponent,
  LazyLoginScreenComponent,
  LazyComponentProvider,
} from '@provider';
import { appStore } from '@store';
import {
  ProjectRoutes,
  PlanRoutes,
  ExpensesRoutes,
  GoalsRoutes,
  ResourceRoutes,
  LearningRoutes,
  CredsRoutes,
  ProfileRoutes,
} from './private_routes/sub_routes';

// Route Guards
const PrivateRouteGuard = () => {
  const token = appStore((state) => state.Auth.token);
  const isUserLoggedIn = token !== '' && token !== null;
  return isUserLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRouteGuard = () => {
  const token = appStore((state) => state.Auth.token);
  const isUserLoggedIn = token !== '' && token !== null;
  return !isUserLoggedIn ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export const appRouter = createBrowserRouter(
  createRoutesFromChildren(
    <Route path="/">
      {/* Public Routes Guard */}
      <Route element={<PublicRouteGuard />}>
        <Route element={<LazyComponentProvider children={<Outlet />} />}>
          <Route path="" element={<Navigate to="/login" replace />} />
          <Route path="login" element={<LazyLoginScreenComponent />} />
        </Route>
      </Route>

      {/* Private Routes Guard */}
      <Route element={<PrivateRouteGuard />}>
        <Route path="/" element={<LazyHomeScreenComponent />}>
          <Route path="" element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<LazyDashboardScreenComponent />} />
          {ExpensesRoutes}
          {ProjectRoutes}
          {PlanRoutes}
          {GoalsRoutes}
          {ResourceRoutes}
          {LearningRoutes}
          {CredsRoutes}
          {ProfileRoutes}
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>,
  ),
);
