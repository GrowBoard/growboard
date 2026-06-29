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
        targetTitle="Learn Kubernetes"
        onConfirm={mockOnConfirm}
        isSaving={false}
      />,
    );

    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Are you sure you want to delete this goal? This action is permanent and cannot be undone.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Learn Kubernetes')).toBeInTheDocument();
  });

  it('calls confirm callback when Yes is clicked', () => {
    renderWithProviders(
      <DeleteConfirmDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        targetTitle="Learn Kubernetes"
        onConfirm={mockOnConfirm}
        isSaving={false}
      />,
    );

    const yesBtn = screen.getByRole('button', { name: 'Yes' });
    fireEvent.click(yesBtn);
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls open change callback when No is clicked', () => {
    renderWithProviders(
      <DeleteConfirmDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        targetTitle="Learn Kubernetes"
        onConfirm={mockOnConfirm}
        isSaving={false}
      />,
    );

    const noBtn = screen.getByRole('button', { name: 'No' });
    fireEvent.click(noBtn);
    expect(mockOnOpenChange).toHaveBeenCalledWith({ open: false });
  });
});
