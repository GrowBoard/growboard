import { lazy } from 'react';
import LazyComponentProvider from '../component/LazyComponent';

const ExpenseScreen = lazy(
  () => import('@screens/private/screens/expenses/ExpenseScreen'),
);

const LazyExpenseScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <ExpenseScreen />
    </LazyComponentProvider>
  );
};

const ExpensePreviewScreen = lazy(() =>
  import('@screens/private/screens/expenses/expense_preview').then(
    (module) => ({ default: module.ExpensePreviewScreen }),
  ),
);

const LazyExpensePreviewScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <ExpensePreviewScreen />
    </LazyComponentProvider>
  );
};

export { LazyExpenseScreenComponent, LazyExpensePreviewScreenComponent };
