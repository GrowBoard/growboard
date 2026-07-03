import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import ExpensePreviewScreen from '../ExpensePreviewScreen';
import { appStore } from '@store';

// Mock @provider to break circular dependency during test import phase
jest.mock('@provider', () => ({
  ThemeProvider: ({ children }: any) => (
    <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
  ),
}));

// Mock subcomponents
jest.mock('../ExpensesTimeWindow', () => ({
  ExpensesTimeWindow: () => (
    <div data-testid="mock-time-window">Mock Time Window</div>
  ),
}));

jest.mock('../Charts', () => ({
  Charts: () => <div data-testid="mock-charts">Mock Charts</div>,
}));

jest.mock('../ExpensesTable', () => ({
  ExpensesTable: () => (
    <div data-testid="mock-expenses-table">Mock Expenses Table</div>
  ),
}));

jest.mock('../ExpensesTable/components', () => ({
  ExpenseRow: () => (
    <tr data-testid="mock-expense-row">
      <td>Mock Expense Row</td>
    </tr>
  ),
}));

// Mock hooks
const mockGetExpensesDataForDate = jest.fn();
jest.mock('@hooks', () => ({
  useGetExpensesDataForDate: () => mockGetExpensesDataForDate(),
}));

// Mock utils
jest.mock('../ExpensesTable/utils', () => ({
  getExpenseDataSumForCategory: jest.fn(() => ({
    sumByCategory: { Food: 120, Rent: 400 },
    totalSum: 520,
  })),
  getExpenseDataForTable: jest.fn(() => [{ date: '2026-07-02' }]),
}));

jest.mock('../utils/downloadCSV', () => ({
  downloadCSV: jest.fn(),
}));

jest.mock('../utils/downloadPDF', () => ({
  downloadPDF: jest.fn(),
}));

describe('ExpensePreviewScreen component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock store setup
    appStore.setState({
      Expense: {
        ...appStore.getState().Expense,
        overview: {
          timeWindow: 'MONTH',
          month: 6, // July
          year: 2026,
        },
        date: new Date('2026-07-02'),
      },
    });

    mockGetExpensesDataForDate.mockReturnValue({
      isLoading: false,
      data: {
        data: [],
      },
    });
  });

  it('renders all section components and layouts', () => {
    renderWithProviders(<ExpensePreviewScreen />);

    expect(screen.getByTestId('mock-time-window')).toBeInTheDocument();
    expect(screen.getByTestId('mock-charts')).toBeInTheDocument();
    expect(screen.getByTestId('mock-expenses-table')).toBeInTheDocument();
    expect(screen.getByText('Add Expense')).toBeInTheDocument();
  });

  it('renders spinner when loading', () => {
    mockGetExpensesDataForDate.mockReturnValue({
      isLoading: true,
      data: null,
    });

    renderWithProviders(<ExpensePreviewScreen />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('triggers setAddExpense action when Add Expense clicked', () => {
    const setAddExpenseMock = jest.fn();
    appStore.setState({
      Expense: {
        ...appStore.getState().Expense,
        setAddExpense: setAddExpenseMock,
      },
    });

    renderWithProviders(<ExpensePreviewScreen />);

    const addBtn = screen.getByRole('button', { name: /Add Expense/i });
    fireEvent.click(addBtn);

    expect(setAddExpenseMock).toHaveBeenCalledWith(true);
  });
});
