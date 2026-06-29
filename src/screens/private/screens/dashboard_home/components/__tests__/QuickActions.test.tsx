import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import { QuickActions } from '../QuickActions';

describe('QuickActions component', () => {
  it('renders all quick action buttons', () => {
    renderWithProviders(<QuickActions />);
    expect(screen.getByRole('button', { name: /Add Goal/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Learning/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Credentials/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Expenses/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Plans/i })).toBeInTheDocument();
  });

  it('clicking each button does not throw', () => {
    renderWithProviders(<QuickActions />);
    const buttons = [
      screen.getByRole('button', { name: /Add Goal/i }),
      screen.getByRole('button', { name: /Add Learning/i }),
      screen.getByRole('button', { name: /Credentials/i }),
      screen.getByRole('button', { name: /Expenses/i }),
      screen.getByRole('button', { name: /Plans/i }),
    ];
    buttons.forEach((btn) => {
      expect(() => fireEvent.click(btn)).not.toThrow();
    });
  });
});
