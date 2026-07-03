import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import HabitCalendar from '../HabitCalendar';
import { HabitItem, HabitLogItem } from '@store';

describe('HabitCalendar component', () => {
  const mockOnDayClick = jest.fn();
  const mockOnMonthChange = jest.fn();

  const habits: HabitItem[] = [
    {
      id: 'h1',
      name: 'Read',
      startDate: '2026-07-01',
      endDate: '',
      targetPercentage: 100,
      createdAt: '',
    },
  ];

  const logs: HabitLogItem[] = [
    {
      id: 'l1',
      habitId: 'h1',
      date: '2026-07-05',
      completed: true,
      loggedAt: '',
      note: '',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with month and year header and weekday labels', () => {
    renderWithProviders(
      <HabitCalendar
        year={2026}
        month={6} // 6 = July
        habits={habits}
        logs={logs}
        onDayClick={mockOnDayClick}
        onMonthChange={mockOnMonthChange}
      />,
    );

    expect(screen.getByText('July 2026')).toBeInTheDocument();
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();

    // July 1st, 2026 is Wednesday (index 3). Sun=28th June padding, Mon=29, Tue=30, Wed=1.
    // Let's check that 1 is rendered.
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('triggers onMonthChange when prev or next month button is clicked', () => {
    renderWithProviders(
      <HabitCalendar
        year={2026}
        month={6} // July
        habits={habits}
        logs={logs}
        onDayClick={mockOnDayClick}
        onMonthChange={mockOnMonthChange}
      />,
    );

    const prevBtn = screen.getByRole('button', { name: 'Previous Month' });
    fireEvent.click(prevBtn);
    expect(mockOnMonthChange).toHaveBeenCalledWith(2026, 5); // June

    const nextBtn = screen.getByRole('button', { name: 'Next Month' });
    fireEvent.click(nextBtn);
    expect(mockOnMonthChange).toHaveBeenCalledWith(2026, 7); // August
  });

  it('triggers onMonthChange to current date when Today is clicked', () => {
    renderWithProviders(
      <HabitCalendar
        year={2020}
        month={0}
        habits={habits}
        logs={logs}
        onDayClick={mockOnDayClick}
        onMonthChange={mockOnMonthChange}
      />,
    );

    const todayBtn = screen.getByRole('button', { name: 'Today' });
    fireEvent.click(todayBtn);

    const today = new Date();
    expect(mockOnMonthChange).toHaveBeenCalledWith(
      today.getFullYear(),
      today.getMonth(),
    );
  });

  it('triggers onDayClick when a day cell is clicked', () => {
    renderWithProviders(
      <HabitCalendar
        year={2026}
        month={6}
        habits={habits}
        logs={logs}
        onDayClick={mockOnDayClick}
        onMonthChange={mockOnMonthChange}
      />,
    );

    const dayCell = screen.getByText('5').closest('div');
    expect(dayCell).toBeInTheDocument();
    if (dayCell) {
      fireEvent.click(dayCell);
      expect(mockOnDayClick).toHaveBeenCalledWith('2026-07-05');
    }
  });
});
