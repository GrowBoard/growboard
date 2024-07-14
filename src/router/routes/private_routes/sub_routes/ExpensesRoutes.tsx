import React from 'react';
import {
  LazyExpenseScreenComponent,
  LazyExpenseMainScreenComponent,
  LazyExpensePreviewScreenComponent,
  LazyExpenseAddScreenComponent,
  LazyExpenseEditScreenComponent,
  LazyExpenseDeleteScreenComponent,
} from '@provider';
import { Route } from 'react-router-dom';

const ExpensesRoutes = (
  <Route path="expenses" element={<LazyExpenseScreenComponent />}>
    <Route path="" element={<LazyExpenseMainScreenComponent />} />
    <Route path="preview" element={<LazyExpensePreviewScreenComponent />} />
    <Route path="add" element={<LazyExpenseAddScreenComponent />} />
    <Route path="edit" element={<LazyExpenseEditScreenComponent />} />
    <Route path="delete" element={<LazyExpenseDeleteScreenComponent />} />
  </Route>
) as React.ReactNode;

export { ExpensesRoutes };
