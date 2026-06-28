import React from 'react';
import {
  LazyProfileMainScreenComponent,
  LazyProfilePreviewScreenComponent,
} from '@provider';
import { Route } from 'react-router-dom';

const LearningRoutes = (
  <Route path="learning" element={<LazyProfileMainScreenComponent />}>
    <Route path="" element={<LazyProfilePreviewScreenComponent />} />
    <Route path="preview" element={<LazyProfilePreviewScreenComponent />} />
  </Route>
) as React.ReactNode;

export { LearningRoutes };
