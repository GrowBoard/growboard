import React from 'react';
import {
  LazyProfileMainScreenComponent,
  LazyProfilePreviewScreenComponent,
} from '@provider';
import { Route } from 'react-router-dom';

const ResourceRoutes = (
  <Route path="resources" element={<LazyProfileMainScreenComponent />}>
    <Route path="" element={<LazyProfilePreviewScreenComponent />} />
    <Route path="preview" element={<LazyProfilePreviewScreenComponent />} />
  </Route>
) as React.ReactNode;

export { ResourceRoutes };
