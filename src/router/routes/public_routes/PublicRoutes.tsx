import {
  Navigate,
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromChildren,
} from 'react-router-dom';
import {
  LazyComponentProvider,
  LazyForgotPasswordScreenComponent,
  LazyLoginScreenComponent,
  LazySignupScreenComponent,
} from '@provider';

export const publicRouter = createBrowserRouter(
  createRoutesFromChildren(
    <Route path="/" element={<LazyComponentProvider children={<Outlet />} />}>
      <Route path="" element={<Navigate to="/login" replace />} />
      <Route path="login" element={<LazyLoginScreenComponent />} />
      <Route path="signup" element={<LazySignupScreenComponent />} />
      <Route
        path="forgot-password"
        element={<LazyForgotPasswordScreenComponent />}
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Route>,
  ),
);
