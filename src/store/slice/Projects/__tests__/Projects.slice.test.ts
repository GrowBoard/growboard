import { appStore } from '../../../store';
import { act } from '@testing-library/react';

describe('Projects slice', () => {
  it('should have initial empty state values', () => {
    const state = appStore.getState().Projects;
    expect(state.projects).toEqual([]);
  });

  it('should add projects successfully', () => {
    const testProjects = [
      {
        Id: 'proj-1',
        title: 'Project 1',
        subtitle: 'Sub',
        link: 'http://link',
        tags: [],
        about_project: 'About',
        remark: 'Remark',
        owner: 'Owner',
        status: 'pending' as const,
      },
    ];

    act(() => {
      appStore.getState().Projects.addProjects(testProjects);
    });

    expect(appStore.getState().Projects.projects).toEqual(testProjects);
  });

  it('should clear projects on removeProjectsState', () => {
    act(() => {
      appStore.getState().Projects.addProjects([
        {
          Id: 'proj-1',
          title: 'Project 1',
          subtitle: 'Sub',
          link: 'http://link',
          tags: [],
          about_project: 'About',
          remark: 'Remark',
          owner: 'Owner',
          status: 'pending' as const,
        },
      ]);
    });

    act(() => {
      appStore.getState().Projects.removeProjectsState();
    });

    expect(appStore.getState().Projects.projects).toEqual([]);
  });
});
