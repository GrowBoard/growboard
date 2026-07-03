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

    const { appStore } = require('@store');
    (appStore as jest.Mock).mockImplementation((selector: any) => {
      return selector({
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
      });
    });

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
    const titleInput = await screen.findByPlaceholderText(/Account Title/i);
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

  it('shows no matching results empty state when search query does not match', async () => {
    renderWithProviders(<CredsScreen />);

    // Type a non-matching query in the search input
    const searchInput = screen.getByPlaceholderText(
      /Search by title or field/i,
    );
    fireEvent.change(searchInput, {
      target: { value: 'Non-existent service' },
    });

    // Verify empty state for search results
    expect(screen.getByText('No matching results')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Try adjusting your search query or clearing the filter/i,
      ),
    ).toBeInTheDocument();
    // Add button should NOT be inside the empty state
    expect(
      screen.queryByRole('button', { name: 'Add' }),
    ).not.toBeInTheDocument();
  });

  it('shows no credentials empty state when user has no credentials', () => {
    const { appStore } = require('@store');
    (appStore as jest.Mock).mockImplementation((selector: any) => {
      return selector({
        Creds: {
          credsData: [],
          updateCreds: mockUpdateCreds,
          removeCreds: mockRemoveCreds,
        },
      });
    });

    renderWithProviders(<CredsScreen />);

    expect(
      screen.getByText(
        'No credentials found. Click "Add Credential" to create one.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Click "Add" to create a new credential/i),
    ).toBeInTheDocument();
    // Should show add button in the empty state
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('can toggle between card and list view modes', async () => {
    renderWithProviders(<CredsScreen />);

    // By default, cards are rendered in Grid (card view)
    expect(screen.getByText('AWS Production')).toBeInTheDocument();

    // Switch to List View
    const listViewBtn = screen.getByRole('button', { name: /List View/i });
    fireEvent.click(listViewBtn);

    // Verify it renders the list view (each field is rendered in custom label-value format, e.g. "Username:")
    expect(screen.getByText('Username:')).toBeInTheDocument();
    expect(screen.getByText('Password:')).toBeInTheDocument();

    // Switch back to Card View
    const cardViewBtn = screen.getByRole('button', { name: /Card View/i });
    fireEvent.click(cardViewBtn);

    // In card view, "Username:" label is rendered as a standalone header text "Username" (no colon)
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.queryByText('Username:')).not.toBeInTheDocument();
  });
});
