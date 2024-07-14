import React from 'react';
import {
  LazyCredsMainScreenComponent,
  LazyProfileMainScreenComponent,
  LazyProfilePreviewScreenComponent,
} from '@provider';
import { Route } from 'react-router-dom';

const LearningRoutes = (
  <Route path="learning" element={<LazyProfileMainScreenComponent />}>
    <Route path="" element={<LazyCredsMainScreenComponent />} />
    <Route path="preview" element={<LazyProfilePreviewScreenComponent />} />
  </Route>
) as React.ReactNode;

export { LearningRoutes };
