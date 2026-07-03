import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import DeleteConfirmDialog from '../DeleteConfirmDialog';

describe('DeleteConfirmDialog component (Plans)', () => {
  const defaultProps = {
    isOpen: true,
    onOpenChange: jest.fn(),
    title: 'Daily Gym Routine',
    onConfirm: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders confirmation text with title', () => {
    renderWithProviders(<DeleteConfirmDialog {...defaultProps} />);
    expect(
      screen.getByText(/Are you sure you want to delete the plan/),
    ).toBeInTheDocument();
    expect(screen.getByText('Daily Gym Routine')).toBeInTheDocument();
  });

  it('calls onConfirm when Delete button is clicked', () => {
    renderWithProviders(<DeleteConfirmDialog {...defaultProps} />);
    const deleteBtn = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteBtn);
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenChange with open false when Cancel button is clicked', () => {
    renderWithProviders(<DeleteConfirmDialog {...defaultProps} />);
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);
    expect(defaultProps.onOpenChange).toHaveBeenCalledWith({ open: false });
  });
});
