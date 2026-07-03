import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import DeleteConfirmDialog from '../DeleteConfirmDialog';

describe('DeleteConfirmDialog component', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with title', () => {
    renderWithProviders(
      <DeleteConfirmDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        title="Project X"
        onConfirm={mockOnConfirm}
      />,
    );

    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    expect(screen.getByText('Project X')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Are you sure you want to delete the project "Project X"? This action cannot be undone.',
      ),
    ).toBeInTheDocument();
  });

  it('calls onConfirm when delete is clicked', () => {
    renderWithProviders(
      <DeleteConfirmDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        title="Project X"
        onConfirm={mockOnConfirm}
      />,
    );

    const deleteBtn = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(deleteBtn);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenChange with false when cancel is clicked', () => {
    renderWithProviders(
      <DeleteConfirmDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        title="Project X"
        onConfirm={mockOnConfirm}
      />,
    );

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelBtn);

    expect(mockOnOpenChange).toHaveBeenCalledWith({ open: false });
  });
});
