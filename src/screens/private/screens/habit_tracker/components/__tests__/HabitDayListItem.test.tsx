import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import HabitDayListItem from '../HabitDayListItem';
import { HabitItem, HabitLogItem } from '@store';

describe('HabitDayListItem component', () => {
  const mockOnToggle = jest.fn();

  const habit: HabitItem = {
    id: 'h1',
    name: 'Yoga',
    startDate: '2026-07-01',
    endDate: '',
    targetPercentage: 90,
    createdAt: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders habit info and uncompleted square icon when log is absent/uncompleted', () => {
    renderWithProviders(
      <HabitDayListItem habit={habit} onToggle={mockOnToggle} />,
    );

    expect(screen.getByText('Yoga')).toBeInTheDocument();
    expect(screen.getByText('Target: 90%')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Mark Habit Completed' }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add progress note...')).toHaveValue('');
  });

  it('renders checkmark icon and note value when completed log is passed', () => {
    const log: HabitLogItem = {
      id: 'l1',
      habitId: 'h1',
      date: '2026-07-05',
      completed: true,
      note: 'Felt energetic',
      loggedAt: '',
    };

    renderWithProviders(
      <HabitDayListItem habit={habit} log={log} onToggle={mockOnToggle} />,
    );

    expect(
      screen.getByRole('button', { name: 'Mark Habit Uncompleted' }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add progress note...')).toHaveValue(
      'Felt energetic',
    );
  });

  it('fires toggle callback on checkbox click', () => {
    renderWithProviders(
      <HabitDayListItem habit={habit} onToggle={mockOnToggle} />,
    );

    const checkBtn = screen.getByRole('button', {
      name: 'Mark Habit Completed',
    });
    fireEvent.click(checkBtn);

    expect(mockOnToggle).toHaveBeenCalledWith(true, '');
  });

  it('fires toggle callback on input blur when note changes', () => {
    const log: HabitLogItem = {
      id: 'l1',
      habitId: 'h1',
      date: '2026-07-05',
      completed: true,
      note: 'Felt energetic',
      loggedAt: '',
    };

    renderWithProviders(
      <HabitDayListItem habit={habit} log={log} onToggle={mockOnToggle} />,
    );

    const input = screen.getByPlaceholderText('Add progress note...');
    fireEvent.change(input, { target: { value: 'Very tired today' } });
    fireEvent.blur(input);

    expect(mockOnToggle).toHaveBeenCalledWith(true, 'Very tired today');
  });
});
