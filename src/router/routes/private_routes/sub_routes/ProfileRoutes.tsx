import React from 'react';
import {
  LazyProfileMainScreenComponent,
  LazyProfilePreviewScreenComponent,
  LazyProfileSettingScreenComponent,
} from '@provider';
import { Route, Navigate } from 'react-router-dom';

const ProfileRoutes = (
  <Route path="profile" element={<LazyProfileMainScreenComponent />}>
    <Route path="" element={<Navigate to="preview" replace />} />
    <Route path="preview" element={<LazyProfilePreviewScreenComponent />} />
    <Route path="settings" element={<LazyProfileSettingScreenComponent />} />
  </Route>
) as React.ReactNode;

export { ProfileRoutes };
