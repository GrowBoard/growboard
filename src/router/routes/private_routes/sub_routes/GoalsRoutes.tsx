import React from 'react';
import {
  LazyGoalsAddScreenComponent,
  LazyGoalsDeleteScreenComponent,
  LazyGoalsEditScreenComponent,
  LazyGoalsMainScreenComponent,
  LazyGoalsPreviewScreenComponent,
  LazyGoalsScreenComponent,
} from '@provider';
import { Route } from 'react-router-dom';

const GoalsRoutes = (
  <Route path="goals" element={<LazyGoalsScreenComponent />}>
    <Route path="" element={<LazyGoalsMainScreenComponent />} />
    <Route path="preview" element={<LazyGoalsPreviewScreenComponent />} />
    <Route path="add" element={<LazyGoalsAddScreenComponent />} />
    <Route path="edit" element={<LazyGoalsEditScreenComponent />} />
    <Route path="delete" element={<LazyGoalsDeleteScreenComponent />} />
  </Route>
) as React.ReactNode;

export { GoalsRoutes };
