import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import HabitDayDrawer from '../HabitDayDrawer';
import { HabitItem, HabitLogItem } from '@store';

describe('HabitDayDrawer component', () => {
  const mockOnClose = jest.fn();
  const mockOnSaveLog = jest.fn().mockResolvedValue(true);

  const habits: HabitItem[] = [
    {
      id: 'h1',
      name: 'Yoga',
      startDate: '2026-07-01',
      endDate: '',
      targetPercentage: 80,
      createdAt: '',
    },
    {
      id: 'h2',
      name: 'Read Book',
      startDate: '2026-07-06',
      endDate: '',
      targetPercentage: 90,
      createdAt: '',
    },
  ];

  const logs: HabitLogItem[] = [];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render if isOpen is false', () => {
    renderWithProviders(
      <HabitDayDrawer
        dateStr="2026-07-05"
        isOpen={false}
        onClose={mockOnClose}
        habits={habits}
        logs={logs}
        onSaveLog={mockOnSaveLog}
      />,
    );

    expect(screen.queryByText('Track Habits')).not.toBeInTheDocument();
  });

  it('renders active habits checklist when isOpen is true', () => {
    renderWithProviders(
      <HabitDayDrawer
        dateStr="2026-07-05"
        isOpen={true}
        onClose={mockOnClose}
        habits={habits}
        logs={logs}
        onSaveLog={mockOnSaveLog}
      />,
    );

    expect(screen.getByText('Track Habits')).toBeInTheDocument();
    expect(
      screen.getByText('Logging checklist for 2026-07-05'),
    ).toBeInTheDocument();

    // Yoga is active, Read Book is NOT active on July 5
    expect(screen.getByText('Yoga')).toBeInTheDocument();
    expect(screen.queryByText('Read Book')).not.toBeInTheDocument();
  });

  it('renders empty state when no habits are active on date', () => {
    renderWithProviders(
      <HabitDayDrawer
        dateStr="2026-06-30"
        isOpen={true}
        onClose={mockOnClose}
        habits={habits}
        logs={logs}
        onSaveLog={mockOnSaveLog}
      />,
    );

    expect(screen.getByText('No habits active')).toBeInTheDocument();
    expect(screen.queryByText('Yoga')).not.toBeInTheDocument();
  });

  it('calls onSaveLog when a habit checklist row is toggled', () => {
    renderWithProviders(
      <HabitDayDrawer
        dateStr="2026-07-05"
        isOpen={true}
        onClose={mockOnClose}
        habits={habits}
        logs={logs}
        onSaveLog={mockOnSaveLog}
      />,
    );

    const checkBtn = screen.getByRole('button', {
      name: 'Mark Habit Completed',
    });
    fireEvent.click(checkBtn);

    expect(mockOnSaveLog).toHaveBeenCalledWith(
      expect.objectContaining({
        habitId: 'h1',
        date: '2026-07-05',
        completed: true,
        note: '',
      }),
    );
  });
});
