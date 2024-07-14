import { RouterProvider } from 'react-router-dom';
import { privateRouter, publicRouter } from '@router';
import { appStore } from '@store';
import { authSelector, useShallow } from '@selectors';

/**
 * Router declaration for the demo app.
 */
export default function AppRouterProviderComponent() {
  const { authToken } = appStore(useShallow(authSelector));

  return (
    <RouterProvider router={authToken !== '' ? privateRouter : publicRouter} />
  );
}
