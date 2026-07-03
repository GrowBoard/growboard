import React from 'react';
import { LazyGoalsScreenComponent } from '@provider';
import { Route } from 'react-router-dom';

const GoalsRoutes = (
  <Route path="goals" element={<LazyGoalsScreenComponent />} />
) as React.ReactNode;

export { GoalsRoutes };
