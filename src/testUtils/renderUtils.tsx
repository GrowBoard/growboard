import { ThemeProvider } from '@provider';
import { render, renderHook } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromChildren,
  Route,
} from 'react-router-dom';

import { RouterProvider as RouterProviderReactDom } from 'react-router-dom';

const RouterProvider = ({ children }: { children: React.ReactElement }) => {
  return (
    <RouterProviderReactDom
      router={createBrowserRouter(
        createRoutesFromChildren(<Route path="/" element={children}></Route>),
      )}
    />
  );
};

/**
 * Render with providers.
 * @param ui - The UI to render.
 * @returns The rendered component.
 */
export const renderWithProviders = (ui: React.ReactElement) => {
  // const queryClient = new QueryClient();
  const { rerender, ...result } = render(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider>
        <RouterProvider>{children}</RouterProvider>
        {/* <QueryClientProvider client={queryClient}></QueryClientProvider> */}
      </ThemeProvider>
    ),
  });

  return {
    ...result,
    renderer: (renderUi: React.ReactElement) =>
      rerender(
        <ThemeProvider>
          {/* <QueryClientProvider client={queryClient}> */}
          <RouterProvider>{renderUi}</RouterProvider>
          {/* </QueryClientProvider> */}
        </ThemeProvider>,
      ),
  };
};

/**
 * Render with router.
 * @param ui - The UI to render.
 * @returns The rendered component.
 */
export const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

/**
 * Render with providers and router.
 * @param ui - The UI to render.
 * @returns The rendered component.
 */
export const renderWithProvidersAndRouter = (ui: React.ReactElement) => {
  // const queryClient = new QueryClient();
  const { rerender, ...result } = render(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider>
        <HelmetProvider>
          {/* <QueryClientProvider client={queryClient}> */}
          <RouterProvider>{children}</RouterProvider>
          {/* </QueryClientProvider> */}
        </HelmetProvider>
      </ThemeProvider>
    ),
  });

  return {
    ...result,
    renderer: (renderUi: React.ReactElement) =>
      rerender(
        <ThemeProvider>
          {/* <QueryClientProvider client={queryClient}> */}
          <RouterProvider>{renderUi}</RouterProvider>
          {/* </QueryClientProvider> */}
        </ThemeProvider>,
      ),
  };
};

/**
 * Render hook with providers.
 * @param renderCallback - The render callback.
 * @returns The rendered hook.
 */
export const renderHookWithProviders = <Result, Props>(
  renderCallback: (props: Props) => Result,
) => {
  // const queryClient = new QueryClient();

  return renderHook(renderCallback, {
    wrapper: ({ children }) => (
      // <QueryClientProvider client={queryClient}>
      <RouterProvider>{children}</RouterProvider>
      // </QueryClientProvider>
    ),
  });
};
