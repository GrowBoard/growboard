import { appStore } from '../../../store';
import { act } from '@testing-library/react';

describe('Learnings slice', () => {
  it('should have initial empty state values', () => {
    const state = appStore.getState().Learnings;
    expect(state.learningsData).toEqual([]);
  });

  it('should update learnings successfully', () => {
    const testLearnings = [
      {
        title: 'Jest Testing',
        subtitle: 'Sub',
        content: 'Content',
        tags: ['jest'],
        updatedAt: '2026-07-02T20:00:00.000Z',
      },
    ];

    act(() => {
      appStore.getState().Learnings.updateLearnings(testLearnings);
    });

    expect(appStore.getState().Learnings.learningsData).toEqual(testLearnings);
  });

  it('should clear learnings on removeLearnings', () => {
    act(() => {
      appStore.getState().Learnings.updateLearnings([
        {
          title: 'Jest Testing',
          subtitle: 'Sub',
          content: 'Content',
          tags: ['jest'],
          updatedAt: '2026-07-02T20:00:00.000Z',
        },
      ]);
    });

    act(() => {
      appStore.getState().Learnings.removeLearnings();
    });

    expect(appStore.getState().Learnings.learningsData).toEqual([]);
  });
});
