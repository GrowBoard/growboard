import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppRouterProviderComponent from '../RouterProvider';

jest.mock('react-router-dom', () => ({
  RouterProvider: ({ router }: any) => (
    <div data-testid="mock-router-provider" data-router={router ? 'present' : 'absent'}>
      Router Provider
    </div>
  ),
}));

jest.mock('@router', () => ({
  appRouter: { mockRouter: true },
}));

describe('RouterProvider component', () => {
  it('renders React Router Provider with appRouter config', () => {
    render(<AppRouterProviderComponent />);
    const provider = screen.getByTestId('mock-router-provider');
    expect(provider).toBeInTheDocument();
    expect(provider).toHaveAttribute('data-router', 'present');
  });
});
