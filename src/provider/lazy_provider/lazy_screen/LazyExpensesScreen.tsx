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

const ExpenseMainScreen = lazy(
  () => import('@screens/private/screens/expenses/expense_main/ExpenseMain'),
);

const LazyExpenseMainScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <ExpenseMainScreen />
    </LazyComponentProvider>
  );
};

const ExpensePreviewScreen = lazy(
  () =>
    import('@screens/private/screens/expenses/expense_preview/ExpensePreview'),
);

const LazyExpensePreviewScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <ExpensePreviewScreen />
    </LazyComponentProvider>
  );
};

const ExpenseEditScreen = lazy(
  () => import('@screens/private/screens/expenses/expense_edit/ExpenseEdit'),
);

const LazyExpenseEditScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <ExpenseEditScreen />
    </LazyComponentProvider>
  );
};

const ExpenseAddScreen = lazy(
  () => import('@screens/private/screens/expenses/expense_add/ExpenseAdd'),
);

const LazyExpenseAddScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <ExpenseAddScreen />
    </LazyComponentProvider>
  );
};

const ExpenseDeleteScreen = lazy(
  () =>
    import('@screens/private/screens/expenses/expense_delete/ExpenseDelete'),
);
const LazyExpenseDeleteScreenComponent = () => {
  return (
    <LazyComponentProvider>
      <ExpenseDeleteScreen />
    </LazyComponentProvider>
  );
};

export {
  LazyExpenseScreenComponent,
  LazyExpenseAddScreenComponent,
  LazyExpenseDeleteScreenComponent,
  LazyExpenseEditScreenComponent,
  LazyExpenseMainScreenComponent,
  LazyExpensePreviewScreenComponent,
};
