import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import { ResourceFormDrawer } from '../ResourceFormDrawer';

// Mock @provider to break circular dependency during test import phase
jest.mock('@provider', () => ({
  ThemeProvider: ({ children }: any) => (
    <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
  ),
}));

describe('ResourceFormDrawer component', () => {
  const mockOnSave = jest.fn();
  const mockOnOpenChange = jest.fn();

  const defaultProps = {
    isOpen: true,
    onOpenChange: mockOnOpenChange,
    onSave: mockOnSave,
    isSaving: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders drawer header, footer, tabs and form inputs', () => {
    renderWithProviders(<ResourceFormDrawer {...defaultProps} />);

    expect(screen.getByText('Add Resource')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('e.g. Reference Title'),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('e.g. Reference Subtitle'),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('e.g. https://example.com'),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Write description/guides here...'),
    ).toBeInTheDocument();
  });

  it('manages adding and removing tags via keydown events', async () => {
    renderWithProviders(<ResourceFormDrawer {...defaultProps} />);

    const tagInput = screen.getByPlaceholderText(
      'e.g. Tag1, Tag2 (Press Enter to add)',
    );

    // Type a tag and press Enter
    await act(async () => {
      fireEvent.change(tagInput, { target: { value: 'CheatSheet' } });
      fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' });
    });

    expect(screen.getByText('CheatSheet')).toBeInTheDocument();

    // Remove the tag
    const removeBtns = screen.getAllByRole('button', { name: 'Remove tag' });
    await act(async () => {
      fireEvent.click(removeBtns[0]);
    });

    expect(screen.queryByText('CheatSheet')).not.toBeInTheDocument();
  });

  it('submits form values on save click', async () => {
    renderWithProviders(<ResourceFormDrawer {...defaultProps} />);

    const titleInput = screen.getByPlaceholderText('e.g. Reference Title');
    const subtitleInput = screen.getByPlaceholderText(
      'e.g. Reference Subtitle',
    );
    const linkInput = screen.getByPlaceholderText('e.g. https://example.com');
    const aboutInput = screen.getByPlaceholderText(
      'Write description/guides here...',
    );
    const saveBtn = screen.getByRole('button', { name: 'Save' });

    await act(async () => {
      fireEvent.change(titleInput, { target: { value: 'Chakra V3 Guide' } });
      fireEvent.change(subtitleInput, { target: { value: 'Official docs' } });
      fireEvent.change(linkInput, {
        target: { value: 'https://chakra-ui.com' },
      });
      fireEvent.change(aboutInput, {
        target: { value: 'Great reference for component design tokens.' },
      });
    });

    await act(async () => {
      fireEvent.click(saveBtn);
    });

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Chakra V3 Guide',
          subtitle: 'Official docs',
          link: 'https://chakra-ui.com',
          about_resource: 'Great reference for component design tokens.',
        }),
      );
    });
  });

  it('allows switching between write and preview tabs for markdown description', async () => {
    renderWithProviders(<ResourceFormDrawer {...defaultProps} />);

    const writeTab = screen.getByRole('button', { name: /^Write$/i });
    const previewTab = screen.getByRole('button', { name: /^Preview$/i });

    // Click Preview
    await act(async () => {
      fireEvent.click(previewTab);
    });
    expect(screen.getByText('Nothing to preview.')).toBeInTheDocument();

    // Click Write
    await act(async () => {
      fireEvent.click(writeTab);
    });
    expect(
      screen.getByPlaceholderText('Write description/guides here...'),
    ).toBeInTheDocument();
  });
});
