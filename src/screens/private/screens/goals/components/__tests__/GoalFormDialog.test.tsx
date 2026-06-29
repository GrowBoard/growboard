import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import GoalFormDialog from '../GoalFormDialog';
import { GoalItem } from '@store';

describe('GoalFormDialog component', () => {
  const mockEditItem: GoalItem = {
    title: 'Learn System Design',
    subtitle: 'Understand scalable architectures',
    tags: ['tech'],
    details: 'Study microservices, replication, partitioning.',
    timeline: ['Read DDIA book'],
    status: 'In-Progress',
    ranking: 1,
    createdAt: '2026-06-28T00:00:00.000Z',
    updatedAt: '2026-06-28T00:00:00.000Z',
  };

  const mockOnSave = jest.fn();
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders add mode dialog correctly', () => {
    renderWithProviders(
      <GoalFormDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        editItem={null}
        onSave={mockOnSave}
        isSaving={false}
        existingTitles={[]}
      />,
    );

    expect(screen.getByText('Add Goal')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. Learn System Design/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. Master high-level architecture/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Break down what you need to study/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Status/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. 1/i)).toBeInTheDocument();
  });

  it('renders edit mode dialog correctly with pre-filled values', () => {
    renderWithProviders(
      <GoalFormDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        editItem={mockEditItem}
        onSave={mockOnSave}
        isSaving={false}
        existingTitles={['Learn System Design']}
      />,
    );

    expect(screen.getByText('Edit Goal')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Learn System Design')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Understand scalable architectures')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Study microservices, replication, partitioning.')).toBeInTheDocument();
    expect(screen.getByText('tech')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Read DDIA book')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Status/i })).toHaveValue('In-Progress');
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
  });

  it('supports adding and removing tags dynamically', async () => {
    renderWithProviders(
      <GoalFormDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        editItem={null}
        onSave={mockOnSave}
        isSaving={false}
        existingTitles={[]}
      />,
    );

    const tagInput = screen.getByPlaceholderText(/e.g. Tech/i);
    const addTagBtn = screen.getByRole('button', { name: /^Add$/i });

    fireEvent.change(tagInput, { target: { value: 'Golang' } });
    fireEvent.click(addTagBtn);

    // Verify tag is added
    expect(await screen.findByText('Golang')).toBeInTheDocument();

    // Verify tag input is cleared
    expect(tagInput).toHaveValue('');

    // Remove the tag
    const removeTagBtn = screen.getByRole('button', { name: /Remove tag Golang/i });
    fireEvent.click(removeTagBtn);

    // Verify tag is removed
    await waitFor(() => {
      expect(screen.queryByText('Golang')).not.toBeInTheDocument();
    });
  });

  it('supports adding and removing timeline milestones dynamically', async () => {
    renderWithProviders(
      <GoalFormDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        editItem={null}
        onSave={mockOnSave}
        isSaving={false}
        existingTitles={[]}
      />,
    );

    const addMilestoneBtn = screen.getByRole('button', { name: /Add Milestone/i });
    
    // Add row
    fireEvent.click(addMilestoneBtn);

    const milestoneInputs = await screen.findAllByPlaceholderText(/e.g. Read Designing/i);
    expect(milestoneInputs).toHaveLength(2); // Initial blank row + added row

    // Type in second row
    fireEvent.change(milestoneInputs[1], { target: { value: 'New Milestone' } });
    expect(milestoneInputs[1]).toHaveValue('New Milestone');

    // Remove first row
    const deleteButtons = screen.getAllByRole('button', { name: /Delete milestone/i });
    fireEvent.click(deleteButtons[0]);

    // Verify only one milestone row remains
    await waitFor(() => {
      const remainingInputs = screen.getAllByPlaceholderText(/e.g. Read Designing/i);
      expect(remainingInputs).toHaveLength(1);
      expect(remainingInputs[0]).toHaveValue('New Milestone');
    });
  });

  it('validates empty inputs and submits valid data on save', async () => {
    renderWithProviders(
      <GoalFormDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        editItem={null}
        onSave={mockOnSave}
        isSaving={false}
        existingTitles={['Existing Goal']}
      />,
    );

    const saveBtn = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveBtn);

    // Validation messages should display
    expect(await screen.findByText('Title is required.')).toBeInTheDocument();
    expect(screen.getByText('Details are required.')).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();

    // Type duplicate title
    const titleInput = screen.getByPlaceholderText(/e.g. Learn System Design/i);
    fireEvent.change(titleInput, { target: { value: 'Existing Goal' } });
    fireEvent.click(saveBtn);

    expect(await screen.findByText('A goal with this title already exists.')).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();

    // Fill valid data
    fireEvent.change(titleInput, { target: { value: 'Unique Goal' } });
    const detailsInput = screen.getByPlaceholderText(/Break down what you need to study/i);
    fireEvent.change(detailsInput, { target: { value: 'Details of goal.' } });

    // Validate ranking positive integer check
    const rankInput = screen.getByPlaceholderText(/e.g. 1/i);
    fireEvent.change(rankInput, { target: { value: '-2' } });
    fireEvent.click(saveBtn);

    expect(await screen.findByText('Rank must be a positive integer.')).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();

    // Fix ranking input
    fireEvent.change(rankInput, { target: { value: '3' } });
    fireEvent.click(saveBtn);
    
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Unique Goal',
          details: 'Details of goal.',
          status: 'Pending',
          ranking: 3,
        }),
      );
    });
  });
});
