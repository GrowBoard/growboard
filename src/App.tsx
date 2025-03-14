import {
  ThemeProvider,
  ImagePreviewModalProvider,
  NotificationProvider,
  AppRouterProviderComponent,
} from '@provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 5,
      retryDelay: 1000,
    },
  },
});

/**
 * Component definition for the app component.
 * @returns The app component.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <React.StrictMode>
        <HelmetProvider>
          <ThemeProvider>
            <ImagePreviewModalProvider>
              <NotificationProvider>
                <AppRouterProviderComponent />
              </NotificationProvider>
            </ImagePreviewModalProvider>
          </ThemeProvider>
        </HelmetProvider>
      </React.StrictMode>
    </QueryClientProvider>
  );
}

// Export the app component.
export default App;
