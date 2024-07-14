import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { AlreadyLoginServiceProvider } from './provider';
import {
  AlertToastProvider,
  ImagePreviewModalProvider,
  NotificationProvider,
  AppRouterProviderComponent,
  ThemeProvider,
} from '@provider';
// init localization
import '@localization';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ImagePreviewModalProvider>
        <AlreadyLoginServiceProvider>
          <NotificationProvider>
            <AlertToastProvider>
              <AppRouterProviderComponent />
            </AlertToastProvider>
          </NotificationProvider>
        </AlreadyLoginServiceProvider>
      </ImagePreviewModalProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
