import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import { ProjectFormDrawer } from '../ProjectFormDrawer';

// Mock @provider to break circular dependency during test import phase
jest.mock('@provider', () => ({
  ThemeProvider: ({ children }: any) => (
    <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
  ),
}));

describe('ProjectFormDrawer component', () => {
  const mockOnSave = jest.fn();
  const mockOnOpenChange = jest.fn();

  const defaultProps = {
    isOpen: true,
    onOpenChange: mockOnOpenChange,
    onSave: mockOnSave,
    isSaving: false,
    editItem: undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders drawer header, footer, tabs and form inputs', () => {
    renderWithProviders(<ProjectFormDrawer {...defaultProps} />);

    expect(screen.getByText('Add Project')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Project Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Project Subtitle')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. https://example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Any additional notes, configurations...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Owner Name')).toBeInTheDocument();
  });

  it('populates fields when editItem is passed', () => {
    const editItem = {
      Id: 'p-1',
      title: 'Existing Project',
      subtitle: 'Existing Subtitle',
      link: 'http://existing.com',
      tags: ['React', 'Jest'],
      about_project: 'Awesome project desc',
      remark: 'Keep track',
      owner: 'Amit',
      status: 'started' as const,
    };

    renderWithProviders(<ProjectFormDrawer {...defaultProps} editItem={editItem} />);

    expect(screen.getByText('Edit Project')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Project Title')).toHaveValue('Existing Project');
    expect(screen.getByPlaceholderText('e.g. Project Subtitle')).toHaveValue('Existing Subtitle');
    expect(screen.getByPlaceholderText('e.g. https://example.com')).toHaveValue('http://existing.com');
    expect(screen.getByPlaceholderText('Any additional notes, configurations...')).toHaveValue('Keep track');
    expect(screen.getByPlaceholderText('e.g. Owner Name')).toHaveValue('Amit');

    // Tags should render as badges
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Jest')).toBeInTheDocument();
  });

  it('manages adding and removing tags via keydown events', async () => {
    renderWithProviders(<ProjectFormDrawer {...defaultProps} />);

    const tagInput = screen.getByPlaceholderText('e.g. Tag1, Tag2 (Press Enter to add)');

    // Type a tag and press Enter
    await act(async () => {
      fireEvent.change(tagInput, { target: { value: 'Frontend' } });
      fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' });
    });

    expect(screen.getByText('Frontend')).toBeInTheDocument();

    // Add another tag
    await act(async () => {
      fireEvent.change(tagInput, { target: { value: 'Backend' } });
      fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' });
    });

    expect(screen.getByText('Backend')).toBeInTheDocument();

    // Remove the first tag
    const removeBtns = screen.getAllByRole('button', { name: 'Remove tag' });
    await act(async () => {
      fireEvent.click(removeBtns[0]);
    });

    expect(screen.queryByText('Frontend')).not.toBeInTheDocument();
  });

  it('submits form values on save click', async () => {
    renderWithProviders(<ProjectFormDrawer {...defaultProps} />);

    const titleInput = screen.getByPlaceholderText('e.g. Project Title');
    const subtitleInput = screen.getByPlaceholderText('e.g. Project Subtitle');
    const aboutInput = screen.getByPlaceholderText('Write project details, requirements, features here...');
    const saveBtn = screen.getByRole('button', { name: 'Save' });

    await act(async () => {
      fireEvent.change(titleInput, { target: { value: 'New Proj' } });
      fireEvent.change(subtitleInput, { target: { value: 'New Sub' } });
      fireEvent.change(aboutInput, { target: { value: 'This is the description.' } });
    });

    await act(async () => {
      fireEvent.click(saveBtn);
    });

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Proj',
          subtitle: 'New Sub',
          about_project: 'This is the description.',
          status: 'pending',
        })
      );
    });
  });

  it('allows switching between write and preview tabs for markdown', async () => {
    renderWithProviders(<ProjectFormDrawer {...defaultProps} />);

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
    expect(screen.getByPlaceholderText('Write project details, requirements, features here...')).toBeInTheDocument();
  });
});
