import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  renderWithRouter,
  renderWithProvidersAndRouter,
  renderHookWithProviders,
} from '../renderUtils';

jest.mock('@provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('renderUtils', () => {
  describe('renderWithRouter', () => {
    it('renders component inside BrowserRouter', () => {
      renderWithRouter(<div data-testid="router-child">Hello Router</div>);
      expect(screen.getByTestId('router-child')).toBeInTheDocument();
    });

    it('returns a result with container', () => {
      const { container } = renderWithRouter(<span>test</span>);
      expect(container).toBeTruthy();
    });
  });

  describe('renderWithProvidersAndRouter', () => {
    it('renders without throwing', () => {
      expect(() =>
        renderWithProvidersAndRouter(<div data-testid="full-child">Hello</div>),
      ).not.toThrow();
    });

    it('returns a renderer function', () => {
      const { renderer } = renderWithProvidersAndRouter(<div>Initial</div>);
      expect(typeof renderer).toBe('function');
      // Calling renderer should not throw
      expect(() =>
        renderer(<div data-testid="rerendered">Updated</div>),
      ).not.toThrow();
    });
  });

  describe('renderHookWithProviders', () => {
    it('renders a hook inside RouterProvider and returns result', () => {
      const { result } = renderHookWithProviders(() => {
        return 'hook-value';
      });
      expect(result.current).toBe('hook-value');
    });

    it('supports generic result type', () => {
      const { result } = renderHookWithProviders(() => ({ count: 42 }));
      expect(result.current.count).toBe(42);
    });
  });
});
