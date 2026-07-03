import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

import { renderWithProviders } from '../../../../../../../../testUtils/renderUtils';
import EditDelete from '../EditDelete';
import { appStore } from '@store';
import { ExpenseType } from '../../../../types';

// Mock @provider to break circular dependency during test import phase
jest.mock('@provider', () => ({
  ThemeProvider: ({ children }: any) => (
    <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
  ),
}));

// Mock useDeleteExpenseData hook
const mockDeleteExpense = jest.fn(() => Promise.resolve());
jest.mock('@services/hooks/private', () => ({
  useDeleteExpenseData: jest.fn(() => ({
    mutateAsync: mockDeleteExpense,
    isPending: false,
  })),
}));

describe('EditDelete component', () => {
  const defaultProps = {
    expenseId: 'e-123',
    type: 'Food' as ExpenseType,
    date: '2026-07-02',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.useFakeTimers();
  });

  it('renders edit and delete icons', () => {
    renderWithProviders(<EditDelete {...defaultProps} />);
    expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
  });

  it('triggers setAddExpense when edit button clicked', () => {
    const setAddExpenseMock = jest.fn();
    appStore.setState({
      Expense: {
        ...appStore.getState().Expense,
        setAddExpense: setAddExpenseMock,
      },
    });

    renderWithProviders(<EditDelete {...defaultProps} />);
    const editBtn = screen.getByRole('button', { name: /Edit/i });
    fireEvent.click(editBtn);

    expect(setAddExpenseMock).toHaveBeenCalledWith(true, 'Food', '2026-07-02', 'e-123');
  });

  it('opens confirmation modal on delete click and calls delete mutation on confirm', async () => {
    renderWithProviders(<EditDelete {...defaultProps} />);
    const deleteBtn = screen.getByRole('button', { name: /Delete/i });

    // Dialog is hidden initially
    expect(screen.queryByText('Delete Expense')).not.toBeInTheDocument();

    // Click Delete
    await act(async () => {
      fireEvent.click(deleteBtn);
    });

    // Dialog should open
    expect(await screen.findByText('Delete Expense')).toBeInTheDocument();
    expect(await screen.findByText('Are you sure you want to delete this expense? This action cannot be undone.')).toBeInTheDocument();

    // Click Cancel
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    await act(async () => {
      fireEvent.click(cancelBtn);
    });

    // Dialog should close
    await waitFor(() => {
      expect(screen.queryByText('Delete Expense')).not.toBeInTheDocument();
    });

    // Reopen and Confirm
    await act(async () => {
      fireEvent.click(deleteBtn);
    });
    const confirmBtn = await screen.findByRole('button', { name: 'Delete' });
    await act(async () => {
      fireEvent.click(confirmBtn);
    });

    expect(mockDeleteExpense).toHaveBeenCalledWith({ expenseId: 'e-123', dateStr: '2026-07-02' });
    await waitFor(() => {
      expect(screen.queryByText('Delete Expense')).not.toBeInTheDocument();
    });
  });
});
