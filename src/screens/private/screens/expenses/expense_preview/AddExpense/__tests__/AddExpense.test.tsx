import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../../testUtils/renderUtils';
import AddExpense from '../AddExpense';
import { useAddExpenseData, useEditExpenseData } from '@services/hooks/private';
import { useGetExpensesDataForDate } from '@hooks';
import { ExpenseType } from '../../types';

// Mock the React Query hooks
jest.mock('@services/hooks/private', () => ({
  useAddExpenseData: jest.fn(),
  useEditExpenseData: jest.fn(),
}));

jest.mock('@hooks', () => ({
  useGetExpensesDataForDate: jest.fn(),
}));

// Mock Zustand App Store
const mockSetAddExpense = jest.fn();

jest.mock('@selectors', () => ({
  useShallow: (val: any) => val,
  addExpenseSelector: (state: any) => state.Expense.addExpense,
  todayDateSelector: (state: any) => state.Expense.todayDate,
  setAddExpenseSelector: (state: any) => state.Expense.setAddExpense,
  dateSelector: (state: any) => state.Expense.date,
}));

jest.mock('@store', () => {
  const mockState = {
    Expense: {
      addExpense: {
        date: '2026-06-28',
        type: 'Food',
        isOpen: true,
        expenseId: null,
      },
      todayDate: new Date('2026-06-28'),
      date: new Date('2026-06-28'),
      setAddExpense: (...args: any[]) => mockSetAddExpense(...args),
    },
  };

  const mockStore = Object.assign(
    jest.fn((selector: (state: typeof mockState) => unknown) => {
      return selector(mockState);
    }),
    {
      getState: jest.fn(() => mockState),
    },
  );

  return {
    appStore: mockStore,
  };
});

describe('AddExpense drawer component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useGetExpensesDataForDate as jest.Mock).mockReturnValue({
      data: { data: [] },
      isLoading: false,
    });

    (useAddExpenseData as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });

    (useEditExpenseData as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });
  });

  it('renders Drawer when open', () => {
    renderWithProviders(<AddExpense />);

    expect(screen.getByText('Add New Expense')).toBeInTheDocument();
    expect(screen.getByText('Amount (₹)')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Comment / Details')).toBeInTheDocument();
  });

  it('calls setAddExpense(false) when cancel is clicked', () => {
    renderWithProviders(<AddExpense />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockSetAddExpense).toHaveBeenCalledWith(false);
  });

  it('correctly sets category background color on selecting category', () => {
    renderWithProviders(<AddExpense />);

    const selectEl = screen.getByRole('combobox') as HTMLSelectElement;
    expect(selectEl.value).toBe(ExpenseType.Food);

    // Food category color is '#1AF0CF'
    expect(selectEl.style.backgroundColor).toBe('rgb(26, 240, 207)');

    // Select Rent category
    fireEvent.change(selectEl, { target: { value: ExpenseType.Rent } });

    // Rent category color is '#66CCFF'
    expect(selectEl.style.backgroundColor).toBe('rgb(102, 204, 255)');
  });
});
