import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import { LearningFormDrawer } from '../LearningFormDrawer';

// Mock @provider to break circular dependency during test import phase
jest.mock('@provider', () => ({
  ThemeProvider: ({ children }: any) => (
    <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
  ),
}));

describe('LearningFormDrawer component', () => {
  const mockOnSave = jest.fn();
  const mockOnOpenChange = jest.fn();

  const defaultProps = {
    isOpen: true,
    onOpenChange: mockOnOpenChange,
    onSave: mockOnSave,
    isSaving: false,
    editItem: null,
    existingTitles: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders drawer header, footer, tabs and form inputs', () => {
    renderWithProviders(<LearningFormDrawer {...defaultProps} />);

    expect(screen.getByText('Add Learning')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Topic Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Topic Subtitle')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type your markdown content here...')).toBeInTheDocument();
  });

  it('populates fields when editItem is passed', () => {
    const editItem = {
      title: 'Existing Learning',
      subtitle: 'Existing Subtitle',
      tags: ['TypeScript', 'Testing'],
      content: 'Detailed markdown learning content',
      createdAt: '2026-07-02T12:00:00.000Z',
      updatedAt: '2026-07-02T12:00:00.000Z',
    };

    renderWithProviders(<LearningFormDrawer {...defaultProps} editItem={editItem} />);

    expect(screen.getByText('Edit Learning')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Topic Title')).toHaveValue('Existing Learning');
    expect(screen.getByPlaceholderText('e.g. Topic Subtitle')).toHaveValue('Existing Subtitle');
    expect(screen.getByPlaceholderText('Type your markdown content here...')).toHaveValue('Detailed markdown learning content');

    // Tags should render as badges
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Testing')).toBeInTheDocument();
  });

  it('manages adding and removing tags via keydown events', async () => {
    renderWithProviders(<LearningFormDrawer {...defaultProps} />);

    const tagInput = screen.getByPlaceholderText('e.g. Tag1, Tag2 (Press Enter to add)');

    // Type a tag and press Enter
    await act(async () => {
      fireEvent.change(tagInput, { target: { value: 'Rust' } });
      fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' });
    });

    expect(screen.getByText('Rust')).toBeInTheDocument();

    // Remove the tag
    const removeBtns = screen.getAllByRole('button', { name: 'Remove tag' });
    await act(async () => {
      fireEvent.click(removeBtns[0]);
    });

    expect(screen.queryByText('Rust')).not.toBeInTheDocument();
  });

  it('submits form values on save click', async () => {
    renderWithProviders(<LearningFormDrawer {...defaultProps} />);

    const titleInput = screen.getByPlaceholderText('e.g. Topic Title');
    const subtitleInput = screen.getByPlaceholderText('e.g. Topic Subtitle');
    const contentInput = screen.getByPlaceholderText('Type your markdown content here...');
    const saveBtn = screen.getByRole('button', { name: 'Save' });

    await act(async () => {
      fireEvent.change(titleInput, { target: { value: 'New Learning Topic' } });
      fireEvent.change(subtitleInput, { target: { value: 'Short intro' } });
      fireEvent.change(contentInput, { target: { value: 'This is the core content.' } });
    });

    await act(async () => {
      fireEvent.click(saveBtn);
    });

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Learning Topic',
          subtitle: 'Short intro',
          content: 'This is the core content.',
        })
      );
    });
  });

  it('allows switching between write and preview tabs for markdown description', async () => {
    renderWithProviders(<LearningFormDrawer {...defaultProps} />);

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
    expect(screen.getByPlaceholderText('Type your markdown content here...')).toBeInTheDocument();
  });
});
