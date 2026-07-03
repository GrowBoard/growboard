import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import LazyComponentProvider from '../LazyComponent';

jest.mock('@components', () => ({
  PageLoadingComponent: () => (
    <div data-testid="page-loading">Loading...</div>
  ),
}));

describe('LazyComponentProvider', () => {
  it('renders children wrapped in Suspense', async () => {
    render(
      <LazyComponentProvider>
        <div data-testid="eager-child">Eager Child</div>
      </LazyComponentProvider>
    );

    expect(screen.getByTestId('eager-child')).toBeInTheDocument();
  });
});
