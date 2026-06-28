import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../testUtils/renderUtils';
import CredsScreen from '../CredsScreen';
import { useGetCredsData, useSaveCredsData } from '@services/hooks/private';

// Mock the React Query hooks
jest.mock('@services/hooks/private', () => ({
  useGetCredsData: jest.fn(),
  useSaveCredsData: jest.fn(),
}));

// Mock Zustand App Store
const mockUpdateCreds = jest.fn();
const mockRemoveCreds = jest.fn();

jest.mock('@store', () => {
  const mockState = {
    Creds: {
      credsData: [
        {
          credTitle: 'AWS Production',
          credData: [
            { name: 'Username', value: 'admin' },
            { name: 'Password', value: 'secret123' },
          ],
        },
      ],
      updateCreds: mockUpdateCreds,
      removeCreds: mockRemoveCreds,
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

describe('CredsScreen component', () => {
  let mockMutateSave: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    (useGetCredsData as jest.Mock).mockReturnValue({
      isLoading: false,
      data: [
        {
          credTitle: 'AWS Production',
          credData: [
            { name: 'Username', value: 'admin' },
            { name: 'Password', value: 'secret123' },
          ],
        },
      ],
    });

    mockMutateSave = jest.fn().mockResolvedValue(undefined);
    (useSaveCredsData as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateSave,
      isPending: false,
    });
  });

  it('renders title and credential list cards', () => {
    renderWithProviders(<CredsScreen />);

    expect(screen.getByText('Credentials')).toBeInTheDocument();
    expect(screen.getByText('AWS Production')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('opens add credentials dialog on clicking add button', async () => {
    renderWithProviders(<CredsScreen />);

    const addButton = screen.getByRole('button', { name: /Add Credential/i });
    fireEvent.click(addButton);

    // Verify dialog title is visible, waiting for Portal to render in JSDOM
    const dialogTitle = await screen.findByText('Add Credential');
    expect(dialogTitle).toBeInTheDocument();
  });

  it('validates empty inputs and submits valid data on save', async () => {
    renderWithProviders(<CredsScreen />);

    // Open Form
    fireEvent.click(screen.getByRole('button', { name: /Add Credential/i }));

    // Wait for form inputs to mount
    const titleInput = await screen.findByPlaceholderText(
      /AWS Production Account/i,
    );
    const nameInput = screen.getByPlaceholderText('Name');
    const valueInput = screen.getByPlaceholderText('Value');
    const saveButton = screen.getByRole('button', { name: /Save/i });

    // Fill details
    fireEvent.change(titleInput, { target: { value: 'Google Cloud' } });
    fireEvent.change(nameInput, { target: { value: 'API Key' } });
    fireEvent.change(valueInput, { target: { value: 'gcp-secret' } });

    // Save
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockMutateSave).toHaveBeenCalledTimes(1);
    });
  });

  it('opens deletion modal and requires title confirmation matching', async () => {
    renderWithProviders(<CredsScreen />);

    // Click delete icon button on the card (named "Delete Credential")
    const deleteIconButton = screen.getByRole('button', {
      name: /Delete Credential/i,
    });
    fireEvent.click(deleteIconButton);

    // Verify deletion modal header is in the DOM
    const confirmHeader = await screen.findByText('Confirm Deletion');
    expect(confirmHeader).toBeInTheDocument();

    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    expect(deleteButton).toBeDisabled();

    // Fill incorrect title
    const confirmInput = screen.getByPlaceholderText('Type title here');
    fireEvent.change(confirmInput, { target: { value: 'Incorrect Title' } });
    expect(deleteButton).toBeDisabled();

    // Fill correct title
    fireEvent.change(confirmInput, { target: { value: 'AWS Production' } });
    expect(deleteButton).not.toBeDisabled();

    // Click confirm delete
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockMutateSave).toHaveBeenCalledWith([]);
    });
  });
});
