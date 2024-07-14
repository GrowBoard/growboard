import React from 'react';
import {
  LazyCredsAddScreenComponent,
  LazyCredsDeleteScreenComponent,
  LazyCredsEditScreenComponent,
  LazyCredsMainScreenComponent,
  LazyCredsPreviewScreenComponent,
  LazyCredsScreenComponent,
} from '@provider';
import { Route } from 'react-router-dom';

const CredsRoutes = (
  <Route path="creds" element={<LazyCredsScreenComponent />}>
    <Route path="" element={<LazyCredsMainScreenComponent />} />
    <Route path="preview" element={<LazyCredsPreviewScreenComponent />} />
    <Route path="add" element={<LazyCredsAddScreenComponent />} />
    <Route path="edit" element={<LazyCredsEditScreenComponent />} />
    <Route path="delete" element={<LazyCredsDeleteScreenComponent />} />
  </Route>
) as React.ReactNode;

export { CredsRoutes };
