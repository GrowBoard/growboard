import React from 'react';
import { LazyProjectsScreenComponent } from '@provider';
import { Route } from 'react-router-dom';

const ProjectRoutes = (
  <Route path="projects" element={<LazyProjectsScreenComponent />} />
) as React.ReactNode;

export { ProjectRoutes };
