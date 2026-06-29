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
        targetTitle="AWS Production"
        onConfirm={mockOnConfirm}
        isSaving={false}
      />,
    );

    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Are you sure you want to delete the credential "AWS Production"\? This action cannot be undone\./i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Type "AWS Production" below to confirm deletion:/i),
    ).toBeInTheDocument();
  });

  it('requires matching title input to enable confirm button', () => {
    renderWithProviders(
      <DeleteConfirmDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        targetTitle="AWS Production"
        onConfirm={mockOnConfirm}
        isSaving={false}
      />,
    );

    const deleteBtn = screen.getByRole('button', { name: 'Delete' });
    expect(deleteBtn).toBeDisabled();

    // Fill incorrect title
    const confirmInput = screen.getByPlaceholderText('Type title here');
    fireEvent.change(confirmInput, { target: { value: 'AWS Prod' } });
    expect(deleteBtn).toBeDisabled();

    // Fill exact matching title
    fireEvent.change(confirmInput, { target: { value: 'AWS Production' } });
    expect(deleteBtn).not.toBeDisabled();

    // Click confirm delete
    fireEvent.click(deleteBtn);
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });
});
