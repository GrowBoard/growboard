import { appStore } from '../../../store';
import { act } from '@testing-library/react';

describe('Goals slice', () => {
  it('should have initial empty state values', () => {
    const state = appStore.getState().Goals;
    expect(state.goalsData).toEqual([]);
  });

  it('should update goals successfully', () => {
    const testGoals = [
      {
        title: 'Learn Jest',
        subtitle: 'Sub',
        details: 'Detail',
        status: 'pending' as const,
        tags: [],
        timeline: [],
        updatedAt: '2026-07-02T20:00:00.000Z',
      },
    ];

    act(() => {
      appStore.getState().Goals.updateGoals(testGoals);
    });

    expect(appStore.getState().Goals.goalsData).toEqual(testGoals);
  });

  it('should clear goals on removeGoals', () => {
    act(() => {
      appStore.getState().Goals.updateGoals([
        {
          title: 'Learn Jest',
          subtitle: 'Sub',
          details: 'Detail',
          status: 'pending' as const,
          tags: [],
          timeline: [],
          updatedAt: '2026-07-02T20:00:00.000Z',
        },
      ]);
    });

    act(() => {
      appStore.getState().Goals.removeGoals();
    });

    expect(appStore.getState().Goals.goalsData).toEqual([]);
  });
});
