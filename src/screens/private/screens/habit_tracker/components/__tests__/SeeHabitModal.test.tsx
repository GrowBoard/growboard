import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import SeeHabitModal from '../SeeHabitModal';
import { HabitItem, HabitLogItem } from '@store';

describe('SeeHabitModal component', () => {
  const mockOnClose = jest.fn();
  const mockOnDeleteHabit = jest.fn().mockResolvedValue(true);

  const habits: HabitItem[] = [
    {
      id: 'h1',
      name: 'Yoga',
      startDate: '2026-07-01',
      endDate: '2026-07-10',
      targetPercentage: 80,
      createdAt: '',
    },
    {
      id: 'h2',
      name: 'Drink Water',
      startDate: '2026-07-02',
      endDate: '',
      targetPercentage: 90,
      createdAt: '',
    },
  ];

  const logs: HabitLogItem[] = [
    {
      id: 'l1',
      habitId: 'h1',
      date: '2026-07-05',
      completed: true,
      note: 'Yoga notes',
      loggedAt: '',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    renderWithProviders(
      <SeeHabitModal
        isOpen={false}
        onClose={mockOnClose}
        habits={habits}
        logs={logs}
      />,
    );

    expect(screen.queryByText('Track / Inspect Habit')).not.toBeInTheDocument();
  });

  it('renders dropdown and stats for selected habit', () => {
    renderWithProviders(
      <SeeHabitModal
        isOpen={true}
        onClose={mockOnClose}
        habits={habits}
        logs={logs}
      />,
    );

    expect(screen.getByText('Track / Inspect Habit')).toBeInTheDocument();

    // Dropdown contains both habits, defaults to first (Yoga)
    expect(screen.getByRole('heading', { name: 'Yoga' })).toBeInTheDocument();
    expect(
      screen.getByText('Active since: 2026-07-01 to 2026-07-10'),
    ).toBeInTheDocument();

    // Yoga has 1 log, 1 completion, target 80%
    expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('80%')).toBeInTheDocument(); // Daily Target

    // Log history rendered
    expect(screen.getByText('2026-07-05')).toBeInTheDocument();
    expect(screen.getByText('Note: Yoga notes')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('calls onDeleteHabit when delete and confirm delete buttons are clicked', async () => {
    renderWithProviders(
      <SeeHabitModal
        isOpen={true}
        onClose={mockOnClose}
        habits={habits}
        logs={logs}
        onDeleteHabit={mockOnDeleteHabit}
      />,
    );

    const deleteBtn = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(deleteBtn);

    // Prompt changes to confirm
    const confirmBtn = screen.getByRole('button', { name: 'Confirm?' });
    expect(confirmBtn).toBeInTheDocument();
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockOnDeleteHabit).toHaveBeenCalledWith('h1');
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onEditHabit when edit button is clicked', () => {
    const mockOnEditHabit = jest.fn();
    renderWithProviders(
      <SeeHabitModal
        isOpen={true}
        onClose={mockOnClose}
        habits={habits}
        logs={logs}
        onEditHabit={mockOnEditHabit}
      />,
    );

    const editBtn = screen.getByRole('button', { name: 'Edit' });
    fireEvent.click(editBtn);

    expect(mockOnEditHabit).toHaveBeenCalledWith(habits[0]);
  });
});
