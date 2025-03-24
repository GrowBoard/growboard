import { privateRouter, publicRouter } from '@router';
import { isUserLoggedInSelector, useShallow } from '@selectors';
import { appStore } from '@store';
import { RouterProvider } from 'react-router-dom';

/**
 * Router declaration for the demo app.
 */
export default function AppRouterProviderComponent() {
  const isUserLoggedIn = appStore(useShallow(isUserLoggedInSelector));

  return (
    <RouterProvider router={isUserLoggedIn ? privateRouter : publicRouter} />
  );
}
