import { privateRouter, publicRouter } from '@router';
import { authTokenSelector, useShallow } from '@selectors';
import { appStore } from '@store';
import { RouterProvider } from 'react-router-dom';

/**
 * Router declaration for the demo app.
 */
export default function AppRouterProviderComponent() {
  const authToken = appStore(useShallow(authTokenSelector));

  return (
    <RouterProvider router={authToken !== '' ? privateRouter : publicRouter} />
  );
}
