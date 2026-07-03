import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import HabitCalendarDay from '../HabitCalendarDay';

describe('HabitCalendarDay component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty cell padding when day is null', () => {
    const { container } = renderWithProviders(
      <HabitCalendarDay
        day={null}
        dateStr={null}
        activeHabitsCount={0}
        completedHabitsCount={0}
        completionPercentage={0}
        heatMapBgToken="bg.habit.none"
        isToday={false}
      />,
    );

    expect(container.firstChild).toBeInTheDocument();
    expect(screen.queryByText(/[0-9]/)).not.toBeInTheDocument();
  });

  it('renders day number and no habits text when count is 0', () => {
    renderWithProviders(
      <HabitCalendarDay
        day={15}
        dateStr="2026-07-15"
        activeHabitsCount={0}
        completedHabitsCount={0}
        completionPercentage={0}
        heatMapBgToken="bg.habit.none"
        onClick={mockOnClick}
        isToday={false}
      />,
    );

    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('No habits active')).toBeInTheDocument();
  });

  it('renders completion stats when habits are active', () => {
    renderWithProviders(
      <HabitCalendarDay
        day={15}
        dateStr="2026-07-15"
        activeHabitsCount={5}
        completedHabitsCount={3}
        completionPercentage={60}
        heatMapBgToken="bg.habit.mid"
        onClick={mockOnClick}
        isToday={false}
      />,
    );

    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('3/5 Done')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    renderWithProviders(
      <HabitCalendarDay
        day={15}
        dateStr="2026-07-15"
        activeHabitsCount={5}
        completedHabitsCount={3}
        completionPercentage={60}
        heatMapBgToken="bg.habit.mid"
        onClick={mockOnClick}
        isToday={false}
      />,
    );

    const cell = screen.getByText('15').closest('div');
    expect(cell).toBeInTheDocument();
    if (cell) {
      fireEvent.click(cell);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    }
  });
});
