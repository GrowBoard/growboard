import { appStore } from '../../../store';
import { act } from '@testing-library/react';

describe('Resources slice', () => {
  it('should have initial empty state values', () => {
    const state = appStore.getState().Resources;
    expect(state.resourcesData).toEqual([]);
  });

  it('should update resources successfully', () => {
    const testResources = [
      {
        Id: 'res-1',
        title: 'Title',
        subtitle: 'Sub',
        link: 'http://link',
        tags: [],
        about_resource: 'About',
      },
    ];

    act(() => {
      appStore.getState().Resources.updateResources(testResources);
    });

    expect(appStore.getState().Resources.resourcesData).toEqual(testResources);
  });

  it('should clear resources on removeResources', () => {
    act(() => {
      appStore.getState().Resources.updateResources([
        {
          Id: 'res-1',
          title: 'Title',
          subtitle: 'Sub',
          link: 'http://link',
          tags: [],
          about_resource: 'About',
        },
      ]);
    });

    act(() => {
      appStore.getState().Resources.removeResources();
    });

    expect(appStore.getState().Resources.resourcesData).toEqual([]);
  });
});
