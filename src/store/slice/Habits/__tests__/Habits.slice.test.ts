import { appStore } from '../../../store';
import { act } from '@testing-library/react';
import { HabitItem, HabitLogItem } from '../types';

describe('Habits slice', () => {
  beforeEach(() => {
    act(() => {
      appStore.getState().Habits.removeHabits();
      appStore.getState().Habits.removeHabitLogs();
    });
  });

  it('should have initial empty state values', () => {
    const state = appStore.getState().Habits;
    expect(state.habitsData).toEqual([]);
    expect(state.habitLogsData).toEqual([]);
  });

  it('should update and remove habits successfully', () => {
    const testHabits: HabitItem[] = [
      {
        id: 'h-1',
        name: 'Yoga',
        startDate: '2026-07-01',
        endDate: '',
        targetPercentage: 100,
        createdAt: '2026-07-01T00:00:00Z',
      },
    ];

    act(() => {
      appStore.getState().Habits.updateHabits(testHabits);
    });
    expect(appStore.getState().Habits.habitsData).toEqual(testHabits);

    act(() => {
      appStore.getState().Habits.removeHabits();
    });
    expect(appStore.getState().Habits.habitsData).toEqual([]);
  });

  it('should update and remove habit logs successfully', () => {
    const testLogs: HabitLogItem[] = [
      {
        id: 'log-1',
        habitId: 'h-1',
        date: '2026-07-05',
        completed: true,
        note: 'good',
        loggedAt: '2026-07-05T08:00:00Z',
      },
    ];

    act(() => {
      appStore.getState().Habits.updateHabitLogs(testLogs);
    });
    expect(appStore.getState().Habits.habitLogsData).toEqual(testLogs);

    act(() => {
      appStore.getState().Habits.removeHabitLogs();
    });
    expect(appStore.getState().Habits.habitLogsData).toEqual([]);
  });
});
