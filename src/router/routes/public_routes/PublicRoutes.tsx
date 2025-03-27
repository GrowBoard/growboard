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
  LazyResetPasswordScreenComponent,
  LazySignupScreenComponent,
  LazyVerifyUserScreenComponent,
} from '@provider';

export const publicRouter = createBrowserRouter(
  createRoutesFromChildren(
    <Route path="/" element={<LazyComponentProvider children={<Outlet />} />}>
      <Route path="" element={<Navigate to="/login" replace />} />
      <Route path="login" element={<LazyLoginScreenComponent />} />
      <Route path="signup" element={<LazySignupScreenComponent />} />
      <Route path="verify_user" element={<LazyVerifyUserScreenComponent />} />
      <Route
        path="forgot_password"
        element={<LazyForgotPasswordScreenComponent />}
      />
      <Route
        path="reset_password"
        element={<LazyResetPasswordScreenComponent />}
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Route>,
  ),
);
