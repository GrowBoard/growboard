import React from 'react';
import { LazyPlansScreenComponent } from '@provider';
import { Route } from 'react-router-dom';

const PlanRoutes = (
  <Route path="plans" element={<LazyPlansScreenComponent />} />
) as React.ReactNode;

export { PlanRoutes };
