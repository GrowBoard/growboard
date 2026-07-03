import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../testUtils/renderUtils';
import ExpenseScreen from '../ExpenseScreen';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/private/expenses',
  }),
}));

describe('ExpenseScreen component', () => {
  it('renders and displays the correct navigation path title', () => {
    renderWithProviders(<ExpenseScreen />);

    // Renders output of getSubNavTitle('/private/expenses') which is ['', 'PRIVATE > ', 'EXPENSES']
    expect(screen.getByText(/PRIVATE > EXPENSES/i)).toBeInTheDocument();
  });
});
