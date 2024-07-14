import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromChildren,
} from 'react-router-dom';
import {
  LazyComponentProvider,
  LazyAppComponent,
  LazyForgotPasswordScreenComponent,
  LazyLoginScreenComponent,
  LazySignupScreenComponent,
} from '@provider';

export const publicRouter = createBrowserRouter(
  createRoutesFromChildren(
    <Route
      path="/"
      element={<LazyComponentProvider children={<LazyAppComponent />} />}
    >
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
