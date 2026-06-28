import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PrivateRouteGuard, PublicRouteGuard } from '../AppRouter';
import { appStore } from '@store';
import { useSilentRefresh } from '@services/hooks/private';

jest.mock('@services/hooks/private', () => ({
  useSilentRefresh: jest.fn(),
}));

jest.mock('@store', () => {
  const mockStore: any = jest.fn((selector) => {
    return selector(mockStore.getState());
  });
  (mockStore as any).getState = jest.fn(() => ({
    Auth: {
      token: '',
    },
  }));
  return {
    appStore: mockStore,
  };
});

describe('AppRouter Route Guards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PrivateRouteGuard', () => {
    it('redirects to /login when user is not logged in', () => {
      (appStore.getState as jest.Mock).mockReturnValue({
        Auth: {
          token: '',
        },
      });

      render(
        <MemoryRouter initialEntries={['/private']}>
          <Routes>
            <Route element={<PrivateRouteGuard />}>
              <Route path="/private" element={<div>Private Area</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Private Area')).not.toBeInTheDocument();
      expect(useSilentRefresh).toHaveBeenCalledTimes(1); // Registers even if redirecting
    });

    it('renders child outlet when user is logged in', () => {
      (appStore.getState as jest.Mock).mockReturnValue({
        Auth: {
          token: 'valid-token',
        },
      });

      render(
        <MemoryRouter initialEntries={['/private']}>
          <Routes>
            <Route element={<PrivateRouteGuard />}>
              <Route path="/private" element={<div>Private Area</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByText('Private Area')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
      expect(useSilentRefresh).toHaveBeenCalledTimes(1);
    });
  });

  describe('PublicRouteGuard', () => {
    it('renders child outlet when user is not logged in', () => {
      (appStore.getState as jest.Mock).mockReturnValue({
        Auth: {
          token: '',
        },
      });

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route element={<PublicRouteGuard />}>
              <Route path="/login" element={<div>Login Page</div>} />
            </Route>
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });

    it('redirects to /dashboard when user is logged in', () => {
      (appStore.getState as jest.Mock).mockReturnValue({
        Auth: {
          token: 'valid-token',
        },
      });

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route element={<PublicRouteGuard />}>
              <Route path="/login" element={<div>Login Page</div>} />
            </Route>
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });
  });
});
