import React from 'react';
import {
  LazyCredsMainScreenComponent,
  LazyProfileMainScreenComponent,
  LazyProfilePreviewScreenComponent,
} from '@provider';
import { Route } from 'react-router-dom';

const ResourceRoutes = (
  <Route path="resources" element={<LazyProfileMainScreenComponent />}>
    <Route path="" element={<LazyCredsMainScreenComponent />} />
    <Route path="preview" element={<LazyProfilePreviewScreenComponent />} />
  </Route>
) as React.ReactNode;

export { ResourceRoutes };
