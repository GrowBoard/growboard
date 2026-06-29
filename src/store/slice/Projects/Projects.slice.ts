import { AppStoreSlice } from '@store';
import { ProjectDataState, ProjectStateSlice } from './types';

/**
 * The initial state configuration for the projects slice.
 */
const initialState: ProjectDataState = {
  projects: [],
};

/**
 * createProjectsSlice.
 * Initializes the state slice and actions for projects data.
 *
 * @param set Central store setter callback.
 * @returns The projects state and actions slice.
 */
const createProjectsSlice: AppStoreSlice<ProjectStateSlice> = (set) => ({
  ...initialState,
  addProjects(projects) {
    set((state) => {
      state.Projects.projects = projects;
    });
  },
  removeProjectsState() {
    set((state) => {
      state.Projects.projects = initialState.projects;
    });
  },
});

export default createProjectsSlice;
