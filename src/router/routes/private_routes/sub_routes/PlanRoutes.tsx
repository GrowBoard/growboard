import React from 'react';
import {
  LazyPlansScreenComponent,
  LazyPlansMainScreenComponent,
  LazyPlansPreviewScreenComponent,
  LazyPlansAddScreenComponent,
  LazyPlansEditScreenComponent,
  LazyPlansDeleteScreenComponent,
} from '@provider';
import { Route } from 'react-router-dom';

const PlanRoutes = (
  <Route path="plans" element={<LazyPlansScreenComponent />}>
    <Route path="" element={<LazyPlansMainScreenComponent />} />
    <Route path="preview" element={<LazyPlansPreviewScreenComponent />} />
    <Route path="add" element={<LazyPlansAddScreenComponent />} />
    <Route path="edit" element={<LazyPlansEditScreenComponent />} />
    <Route path="delete" element={<LazyPlansDeleteScreenComponent />} />
  </Route>
) as React.ReactNode;

export { PlanRoutes };
