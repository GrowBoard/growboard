import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

import { renderWithProviders } from '../../../../../../../../testUtils/renderUtils';
import AddExpenseButton from '../AddExpenseButton';
import { appStore } from '@store';
import { ExpenseType } from '../../../../types';

// Mock @provider to break circular dependency during test import phase
jest.mock('@provider', () => ({
  ThemeProvider: ({ children }: any) => (
    <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
  ),
}));

describe('AddExpenseButton component', () => {
  const defaultProps = {
    date: '2026-07-02',
    type: 'Food' as ExpenseType,
  };

  it('renders correct button and triggers setAddExpense on click', () => {
    const setAddExpenseMock = jest.fn();
    appStore.setState({
      Expense: {
        ...appStore.getState().Expense,
        setAddExpense: setAddExpenseMock,
      },
    });

    renderWithProviders(<AddExpenseButton {...defaultProps} />);

    const btn = screen.getByRole('button', { name: /Add expense/i });
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);
    expect(setAddExpenseMock).toHaveBeenCalledWith(true, 'Food', '2026-07-02');
  });
});
