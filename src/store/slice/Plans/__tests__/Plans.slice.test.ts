import { appStore } from '../../../store';
import { act } from '@testing-library/react';

describe('Plans slice', () => {
  it('should have initial empty state values', () => {
    const state = appStore.getState().Plans;
    expect(state.plansData).toEqual([]);
  });

  it('should update plans successfully', () => {
    const testPlans = [
      {
        Id: 'plan-1',
        title: 'Title',
        subtitle: 'Sub',
        date: '2026-07-02',
        time: '12:00',
        tags: [],
        about_plan: 'About',
      },
    ];

    act(() => {
      appStore.getState().Plans.updatePlans(testPlans);
    });

    expect(appStore.getState().Plans.plansData).toEqual(testPlans);
  });

  it('should clear plans on removePlans', () => {
    act(() => {
      appStore.getState().Plans.updatePlans([
        {
          Id: 'plan-1',
          title: 'Title',
          subtitle: 'Sub',
          date: '2026-07-02',
          time: '12:00',
          tags: [],
          about_plan: 'About',
        },
      ]);
    });

    act(() => {
      appStore.getState().Plans.removePlans();
    });

    expect(appStore.getState().Plans.plansData).toEqual([]);
  });
});
