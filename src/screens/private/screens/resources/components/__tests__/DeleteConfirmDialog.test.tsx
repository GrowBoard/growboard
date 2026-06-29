import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import DeleteConfirmDialog from '../DeleteConfirmDialog';

describe('DeleteConfirmDialog component', () => {
  const mockOnConfirm = jest.fn();
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders confirmation text correctly', () => {
    renderWithProviders(
      <DeleteConfirmDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        title="Chakra UI docs"
        onConfirm={mockOnConfirm}
      />,
    );

    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    expect(screen.getByText('Chakra UI docs')).toBeInTheDocument();
  });

  it('calls confirm callback when Delete is clicked', () => {
    renderWithProviders(
      <DeleteConfirmDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        title="Chakra UI docs"
        onConfirm={mockOnConfirm}
      />,
    );

    const deleteBtn = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(deleteBtn);
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls open change callback when Cancel is clicked', () => {
    renderWithProviders(
      <DeleteConfirmDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        title="Chakra UI docs"
        onConfirm={mockOnConfirm}
      />,
    );

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelBtn);
    expect(mockOnOpenChange).toHaveBeenCalledWith({ open: false });
  });
});
