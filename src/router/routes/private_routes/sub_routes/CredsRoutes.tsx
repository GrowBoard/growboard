import React from 'react';
import { LazyCredsScreenComponent } from '@provider';
import { Route } from 'react-router-dom';

const CredsRoutes = (
  <Route path="creds" element={<LazyCredsScreenComponent />} />
) as React.ReactNode;

export { CredsRoutes };
