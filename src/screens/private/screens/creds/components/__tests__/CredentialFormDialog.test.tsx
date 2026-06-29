import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import CredentialFormDialog from '../CredentialFormDialog';

describe('CredentialFormDialog component', () => {
  const mockOnSave = jest.fn();
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders add mode dialog correctly', () => {
    renderWithProviders(
      <CredentialFormDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        editItem={null}
        onSave={mockOnSave}
        isSaving={false}
      />,
    );

    expect(screen.getByText('Add Credential')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('e.g. Account Title'),
    ).toBeInTheDocument();
  });

  it('renders edit mode dialog correctly with pre-filled values', () => {
    const editItem = {
      credTitle: 'Existing Server',
      credData: [{ name: 'IP', value: '127.0.0.1' }],
    };

    renderWithProviders(
      <CredentialFormDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        editItem={editItem}
        onSave={mockOnSave}
        isSaving={false}
      />,
    );

    expect(screen.getByText('Edit Credential')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Server')).toBeInTheDocument();
    expect(screen.getByDisplayValue('IP')).toBeInTheDocument();
    expect(screen.getByDisplayValue('127.0.0.1')).toBeInTheDocument();
  });

  it('applies preset templates when clicked', () => {
    renderWithProviders(
      <CredentialFormDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        editItem={null}
        onSave={mockOnSave}
        isSaving={false}
      />,
    );

    // Apply login preset
    const loginPresetBtn = screen.getByRole('button', {
      name: /Login \(URL\/User\/Pass\)/i,
    });
    fireEvent.click(loginPresetBtn);

    expect(screen.getByDisplayValue('URL')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Username')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Password')).toBeInTheDocument();
  });

  it('can add and remove field rows', () => {
    renderWithProviders(
      <CredentialFormDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        editItem={null}
        onSave={mockOnSave}
        isSaving={false}
      />,
    );

    // Click "Add Row" button
    const addRowBtn = screen.getByRole('button', { name: /Add Row/i });
    fireEvent.click(addRowBtn);

    // Should now have 2 sets of inputs
    const nameInputs = screen.getAllByPlaceholderText('Name');
    expect(nameInputs.length).toBe(2);

    // Check if the delete buttons are enabled
    const deleteRowBtns = screen.getAllByRole('button', {
      name: /Delete Row/i,
    });
    expect(deleteRowBtns[0]).not.toBeDisabled();
    expect(deleteRowBtns[1]).not.toBeDisabled();

    // Click delete row button on second row
    fireEvent.click(deleteRowBtns[1]);

    // Should go back to 1 input
    expect(screen.getAllByPlaceholderText('Name').length).toBe(1);
  });

  it('submits successfully when fields are valid', async () => {
    renderWithProviders(
      <CredentialFormDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        editItem={null}
        onSave={mockOnSave}
        isSaving={false}
      />,
    );

    const titleInput = screen.getByPlaceholderText(
      'e.g. Account Title',
    );
    const nameInputs = screen.getAllByPlaceholderText('Name');
    const valueInputs = screen.getAllByPlaceholderText('Value');

    fireEvent.change(titleInput, { target: { value: 'New Account' } });
    fireEvent.change(nameInputs[0], { target: { value: 'API_KEY' } });
    fireEvent.change(valueInputs[0], { target: { value: 'xyz123' } });

    const saveBtn = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        credTitle: 'New Account',
        credData: [{ name: 'API_KEY', value: 'xyz123' }],
      });
    });
  });
});
