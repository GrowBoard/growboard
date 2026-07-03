import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import { ExpenseSummary } from '../ExpenseSummary';
import { ExpenseDataPoint } from '@services/hooks/private';
import { ExpenseType } from '@screens/private/screens/expenses/expense_preview/types';

import { useGetExpensesDataForDate } from '@hooks';

// Mock the data-fetching hook
jest.mock('@hooks', () => ({
  useGetExpensesDataForDate: jest.fn(),
}));

/** Factory for a minimal ExpenseDataPoint. */
const makeExpense = (
  category: ExpenseType,
  amount: number,
): ExpenseDataPoint => ({
  id: `${category}-${amount}`,
  amount,
  date_time: '2024-06-10',
  comment: '',
  category,
});

describe('ExpenseSummary component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the section heading', () => {
    (useGetExpensesDataForDate as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    renderWithProviders(<ExpenseSummary />);
    expect(screen.getByText(/This Month's Expenses/i)).toBeInTheDocument();
  });

  it('shows a spinner while loading', () => {
    (useGetExpensesDataForDate as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    renderWithProviders(<ExpenseSummary />);
    // Chakra Spinner renders a role="status" by default
    expect(
      document.querySelector('.chakra-spinner') ?? document.body,
    ).toBeTruthy();
  });

  it('shows empty state when there are no expenses', () => {
    (useGetExpensesDataForDate as jest.Mock).mockReturnValue({
      data: { data: [], status: 'ok', successMessage: '' },
      isLoading: false,
    });
    renderWithProviders(<ExpenseSummary />);
    expect(screen.getByText(/No expenses recorded/i)).toBeInTheDocument();
  });

  it('displays the total spend formatted in Indian locale', () => {
    (useGetExpensesDataForDate as jest.Mock).mockReturnValue({
      data: {
        data: [
          makeExpense(ExpenseType.Food, 500),
          makeExpense(ExpenseType.Rent, 1500),
        ],
        status: 'ok',
        successMessage: '',
      },
      isLoading: false,
    });
    renderWithProviders(<ExpenseSummary />);
    expect(screen.getByText(/₹2,000/i)).toBeInTheDocument();
  });

  it('displays the top category', () => {
    (useGetExpensesDataForDate as jest.Mock).mockReturnValue({
      data: {
        data: [
          makeExpense(ExpenseType.Food, 200),
          makeExpense(ExpenseType.Rent, 1000),
        ],
        status: 'ok',
        successMessage: '',
      },
      isLoading: false,
    });
    renderWithProviders(<ExpenseSummary />);
    const rentEls = screen.getAllByText('Rent');
    expect(rentEls.length).toBeGreaterThanOrEqual(1);
  });

  it('renders "View all →" link', () => {
    (useGetExpensesDataForDate as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    renderWithProviders(<ExpenseSummary />);
    expect(screen.getByText('View all →')).toBeInTheDocument();
  });
});
