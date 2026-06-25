import {
  Navigate,
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromChildren,
} from 'react-router-dom';
import {
  LazyComponentProvider,
  LazyLoginScreenComponent,
} from '@provider';

export const publicRouter = createBrowserRouter(
  createRoutesFromChildren(
    <Route path="/" element={<LazyComponentProvider children={<Outlet />} />}>
      <Route path="" element={<Navigate to="/login" replace />} />
      <Route path="login" element={<LazyLoginScreenComponent />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Route>,
  ),
);
