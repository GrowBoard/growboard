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
});
