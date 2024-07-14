import React from 'react';
import {
  LazyProjectsScreenComponent,
  LazyProjectMainScreenComponent,
  LazyProjectPreviewComponent,
  LazyProjectAddComponent,
  LazyProjectEditComponent,
  LazyProjectDeleteComponent,
} from '@provider';
import { Route } from 'react-router-dom';

const ProjectRoutes = (
  <Route path="projects" element={<LazyProjectsScreenComponent />}>
    <Route path="" element={<LazyProjectMainScreenComponent />} />
    <Route path="preview" element={<LazyProjectPreviewComponent />}>
      <Route path=":id" element={<LazyProjectPreviewComponent />} />
    </Route>
    <Route path="add" element={<LazyProjectAddComponent />} />
    <Route path="edit" element={<LazyProjectEditComponent />}>
      <Route path=":id" element={<LazyProjectEditComponent />} />
    </Route>
    <Route path="delete" element={<LazyProjectDeleteComponent />}>
      <Route path=":id" element={<LazyProjectDeleteComponent />} />
    </Route>
  </Route>
) as React.ReactNode;

export { ProjectRoutes };
