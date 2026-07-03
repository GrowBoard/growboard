import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import { PlanFormDrawer } from '../PlanFormDrawer';

// Mock @provider to break circular dependency during test import phase
jest.mock('@provider', () => ({
  ThemeProvider: ({ children }: any) => (
    <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
  ),
}));

describe('PlanFormDrawer component', () => {
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

  it('renders drawer header, footer, and form inputs', () => {
    renderWithProviders(<PlanFormDrawer {...defaultProps} />);

    expect(screen.getByText('Add Plan')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Plan Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Plan Subtitle')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Describe the plan objectives and scope...')).toBeInTheDocument();
  });

  it('populates fields when editItem is passed', () => {
    const editItem = {
      Id: 'p-1',
      title: 'Existing Plan',
      subtitle: 'Existing Subtitle',
      date: '2026-07-02',
      time: '14:30',
      tags: ['Daily', 'Sprint'],
      about_plan: 'Awesome plan desc',
    };

    renderWithProviders(<PlanFormDrawer {...defaultProps} editItem={editItem} />);

    expect(screen.getByText('Edit Plan')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Plan Title')).toHaveValue('Existing Plan');
    expect(screen.getByPlaceholderText('e.g. Plan Subtitle')).toHaveValue('Existing Subtitle');
    expect(screen.getByPlaceholderText('Describe the plan objectives and scope...')).toHaveValue('Awesome plan desc');

    // Tags should render as badges
    expect(screen.getByText('Daily')).toBeInTheDocument();
    expect(screen.getByText('Sprint')).toBeInTheDocument();
  });

  it('manages adding and removing tags via keydown events', async () => {
    renderWithProviders(<PlanFormDrawer {...defaultProps} />);

    const tagInput = screen.getByPlaceholderText('e.g. Tag1, Tag2 (Press Enter to add)');

    // Type a tag and press Enter
    await act(async () => {
      fireEvent.change(tagInput, { target: { value: 'Work' } });
      fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' });
    });

    expect(screen.getByText('Work')).toBeInTheDocument();

    // Remove tag
    const removeBtns = screen.getAllByRole('button', { name: 'Remove tag' });
    await act(async () => {
      fireEvent.click(removeBtns[0]);
    });

    expect(screen.queryByText('Work')).not.toBeInTheDocument();
  });

  it('submits form values on save click', async () => {
    renderWithProviders(<PlanFormDrawer {...defaultProps} />);

    const titleInput = screen.getByPlaceholderText('e.g. Plan Title');
    const subtitleInput = screen.getByPlaceholderText('e.g. Plan Subtitle');
    const aboutInput = screen.getByPlaceholderText('Describe the plan objectives and scope...');
    const saveBtn = screen.getByRole('button', { name: 'Save' });

    await act(async () => {
      fireEvent.change(titleInput, { target: { value: 'New Plan Title' } });
      fireEvent.change(subtitleInput, { target: { value: 'New Subtitle' } });
      fireEvent.change(aboutInput, { target: { value: 'Objectives and milestones' } });
    });

    await act(async () => {
      fireEvent.click(saveBtn);
    });

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Plan Title',
          subtitle: 'New Subtitle',
          about_plan: 'Objectives and milestones',
        })
      );
    });
  });
});
