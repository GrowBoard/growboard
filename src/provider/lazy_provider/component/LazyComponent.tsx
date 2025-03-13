import * as React from 'react';
import { PageLoadingComponent } from '@components';
import { LazyComponentProviderProps } from './types';

const LazyComponentProvider = (props: LazyComponentProviderProps) => {
  return (
    <React.Suspense fallback={<PageLoadingComponent />}>
      {props.children}
    </React.Suspense>
  );
};

export default LazyComponentProvider;
