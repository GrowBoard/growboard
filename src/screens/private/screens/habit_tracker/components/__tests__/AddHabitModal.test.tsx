import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import AddHabitModal from '../AddHabitModal';
import { HabitItem } from '@store';

describe('AddHabitModal component', () => {
  const mockOnClose = jest.fn();
  const mockOnSaveHabit = jest.fn().mockResolvedValue(true);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    renderWithProviders(
      <AddHabitModal
        isOpen={false}
        onClose={mockOnClose}
        onSaveHabit={mockOnSaveHabit}
      />,
    );

    expect(screen.queryByText('Start a Habit')).not.toBeInTheDocument();
  });

  it('renders input fields with default values in create mode', () => {
    renderWithProviders(
      <AddHabitModal
        isOpen={true}
        onClose={mockOnClose}
        onSaveHabit={mockOnSaveHabit}
      />,
    );

    expect(screen.getByText('Start a Habit')).toBeInTheDocument();
    expect(screen.getByLabelText('Habit Name')).toHaveValue('');
    expect(screen.getByLabelText('Start Date')).not.toHaveValue('');
    expect(screen.getByLabelText('End Date (Optional)')).toHaveValue('');
    expect(screen.getByLabelText('Daily Target Percentage (%)')).toHaveValue(
      100,
    );
  });

  it('pre-populates input fields in edit mode', () => {
    const editItem: HabitItem = {
      id: 'h1',
      name: 'Yoga',
      startDate: '2026-07-01',
      endDate: '2026-07-10',
      targetPercentage: 80,
      createdAt: '2026-07-01T00:00:00Z',
    };

    renderWithProviders(
      <AddHabitModal
        isOpen={true}
        onClose={mockOnClose}
        onSaveHabit={mockOnSaveHabit}
        editItem={editItem}
      />,
    );

    expect(screen.getByText('Edit Habit')).toBeInTheDocument();
    expect(screen.getByLabelText('Habit Name')).toHaveValue('Yoga');
    expect(screen.getByLabelText('Start Date')).toHaveValue('2026-07-01');
    expect(screen.getByLabelText('End Date (Optional)')).toHaveValue(
      '2026-07-10',
    );
    expect(screen.getByLabelText('Daily Target Percentage (%)')).toHaveValue(
      80,
    );
  });

  it('shows validation error when name is missing', async () => {
    renderWithProviders(
      <AddHabitModal
        isOpen={true}
        onClose={mockOnClose}
        onSaveHabit={mockOnSaveHabit}
      />,
    );

    const saveBtn = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveBtn);

    expect(
      await screen.findByText('Habit name is required.'),
    ).toBeInTheDocument();
    expect(mockOnSaveHabit).not.toHaveBeenCalled();
  });

  it('calls onSaveHabit and onClose on successful form submission', async () => {
    renderWithProviders(
      <AddHabitModal
        isOpen={true}
        onClose={mockOnClose}
        onSaveHabit={mockOnSaveHabit}
      />,
    );

    const nameInput = screen.getByLabelText('Habit Name');
    fireEvent.change(nameInput, { target: { value: 'Meditation' } });

    const saveBtn = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockOnSaveHabit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Meditation',
          targetPercentage: 100,
          endDate: '',
        }),
      );
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('shows validation error when target percentage is out of 0-100 range', async () => {
    renderWithProviders(
      <AddHabitModal
        isOpen={true}
        onClose={mockOnClose}
        onSaveHabit={mockOnSaveHabit}
      />,
    );

    const nameInput = screen.getByLabelText('Habit Name');
    fireEvent.change(nameInput, { target: { value: 'Meditation' } });

    const pctInput = screen.getByLabelText('Daily Target Percentage (%)');
    fireEvent.change(pctInput, { target: { value: '150' } });

    const saveBtn = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveBtn);

    expect(
      await screen.findByText(
        'Daily target percentage must be between 0 and 100.',
      ),
    ).toBeInTheDocument();
    expect(mockOnSaveHabit).not.toHaveBeenCalled();
  });

  it('shows validation error when no repeat day is selected', async () => {
    renderWithProviders(
      <AddHabitModal
        isOpen={true}
        onClose={mockOnClose}
        onSaveHabit={mockOnSaveHabit}
      />,
    );

    const nameInput = screen.getByLabelText('Habit Name');
    fireEvent.change(nameInput, { target: { value: 'Meditation' } });

    // Deselect all days by clicking "All days" button (initially all 7 are selected)
    const allDaysBtn = screen.getByRole('button', { name: 'All days' });
    fireEvent.click(allDaysBtn);

    const saveBtn = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveBtn);

    expect(
      await screen.findByText('At least one repeat day must be selected.'),
    ).toBeInTheDocument();
    expect(mockOnSaveHabit).not.toHaveBeenCalled();
  });

  it('allows toggling individual day chips and updates onSaveHabit payload', async () => {
    renderWithProviders(
      <AddHabitModal
        isOpen={true}
        onClose={mockOnClose}
        onSaveHabit={mockOnSaveHabit}
      />,
    );

    const nameInput = screen.getByLabelText('Habit Name');
    fireEvent.change(nameInput, { target: { value: 'Meditation' } });

    // Deselect Monday (value 1) and Wednesday (value 3)
    const monBtn = screen.getByRole('button', { name: 'Mon' });
    const wedBtn = screen.getByRole('button', { name: 'Wed' });

    fireEvent.click(monBtn);
    fireEvent.click(wedBtn);

    const saveBtn = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockOnSaveHabit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Meditation',
          days: [0, 2, 4, 5, 6], // Sun, Tue, Thu, Fri, Sat
        }),
      );
    });
  });

  it('selects all days when All days is clicked when not all are selected', async () => {
    renderWithProviders(
      <AddHabitModal
        isOpen={true}
        onClose={mockOnClose}
        onSaveHabit={mockOnSaveHabit}
      />,
    );

    const nameInput = screen.getByLabelText('Habit Name');
    fireEvent.change(nameInput, { target: { value: 'Meditation' } });

    // Deselect Mon to make count < 7
    const monBtn = screen.getByRole('button', { name: 'Mon' });
    fireEvent.click(monBtn);

    // Now click All days to select all again
    const allDaysBtn = screen.getByRole('button', { name: 'All days' });
    fireEvent.click(allDaysBtn);

    const saveBtn = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockOnSaveHabit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Meditation',
          days: [0, 1, 2, 3, 4, 5, 6],
        }),
      );
    });
  });
});
