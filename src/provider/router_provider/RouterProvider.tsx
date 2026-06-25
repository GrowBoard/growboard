import { appRouter } from '@router';
import { RouterProvider } from 'react-router-dom';

/**
 * Router declaration for the demo app.
 */
export default function AppRouterProviderComponent() {
  return <RouterProvider router={appRouter} />;
}
