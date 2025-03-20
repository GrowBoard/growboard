import React from 'react';
import {
  LazyExpensePreviewScreenComponent,
  LazyExpenseScreenComponent,
} from '@provider';
import { Route } from 'react-router-dom';

const ExpensesRoutes = (
  <Route path="expenses" element={<LazyExpenseScreenComponent />}>
    <Route path="" element={<LazyExpensePreviewScreenComponent />} />
  </Route>
) as React.ReactNode;

export { ExpensesRoutes };
