import React from 'react';
import { LazyLearningsScreenComponent } from '@provider';
import { Route } from 'react-router-dom';

const LearningRoutes = (
  <Route path="learning" element={<LazyLearningsScreenComponent />} />
) as React.ReactNode;

export { LearningRoutes };

