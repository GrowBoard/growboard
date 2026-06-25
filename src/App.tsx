import {
  ThemeProvider,
  ImagePreviewModalProvider,
  AppRouterProviderComponent,
} from '@provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 5,
      retryDelay: 1000,
    },
  },
});

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID ?? '';

/**
 * Component definition for the app component.
 * @returns The app component.
 */
function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <React.StrictMode>
          <HelmetProvider>
            <ThemeProvider>
              <ImagePreviewModalProvider>
                <AppRouterProviderComponent />
              </ImagePreviewModalProvider>
            </ThemeProvider>
          </HelmetProvider>
        </React.StrictMode>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

// Export the app component.
export default App;
