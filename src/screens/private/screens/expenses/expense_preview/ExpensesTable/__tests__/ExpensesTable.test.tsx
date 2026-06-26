import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../../../../testUtils/renderUtils';
import ExpenseTable from '../ExpensesTable';

jest.mock('@hooks', () => ({
  useGetExpensesDataForDate: jest.fn(() => ({
    data: { data: [] },
    isLoading: false,
  })),
}));

jest.mock('@store', () => ({
  appStore: jest.fn((selector) => {
    return {
      dateState: { month: 5 },
    };
  }),
}));

describe('ExpenseTable component', () => {
  it('should render the expenses register header', () => {
    renderWithProviders(<ExpenseTable />);
    expect(screen.getByText('Expenses Register')).toBeDefined();
  });
});
