import React from 'react';
import { LazyResourcesScreenComponent } from '@provider';
import { Route } from 'react-router-dom';

const ResourceRoutes = (
  <Route path="resources" element={<LazyResourcesScreenComponent />} />
) as React.ReactNode;

export { ResourceRoutes };
