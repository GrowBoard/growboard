import { habitsSelector } from '../Habits.selector';
import { AppStoreState } from 'src/store/store';

describe('Habits selector', () => {
  const mockState = {
    Habits: {
      habitsData: [
        {
          id: 'h-1',
          name: 'Yoga',
          startDate: '2026-07-01',
          endDate: '',
          targetPercentage: 100,
          createdAt: '',
        },
      ],
      habitLogsData: [
        {
          id: 'l-1',
          habitId: 'h-1',
          date: '2026-07-05',
          completed: true,
          note: '',
          loggedAt: '',
        },
      ],
      updateHabits: jest.fn(),
      removeHabits: jest.fn(),
      updateHabitLogs: jest.fn(),
      removeHabitLogs: jest.fn(),
    },
  } as unknown as AppStoreState;

  it('selects habits state data and actions correctly', () => {
    const selected = habitsSelector(mockState);
    expect(selected.habitsData).toEqual(mockState.Habits.habitsData);
    expect(selected.habitLogsData).toEqual(mockState.Habits.habitLogsData);
    expect(selected.updateHabits).toBe(mockState.Habits.updateHabits);
    expect(selected.removeHabits).toBe(mockState.Habits.removeHabits);
    expect(selected.updateHabitLogs).toBe(mockState.Habits.updateHabitLogs);
    expect(selected.removeHabitLogs).toBe(mockState.Habits.removeHabitLogs);
  });
});
