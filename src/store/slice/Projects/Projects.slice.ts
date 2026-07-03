import { AppStoreSlice } from '@store';
import { ProjectDataState, ProjectStateSlice } from './types';

/**
 * The initial state configuration for the projects slice.
 */
const initialState: ProjectDataState = {
  projects: [],
  lastFetched: undefined,
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
      state.Projects.lastFetched = Date.now();
    });
  },
  removeProjectsState() {
    set((state) => {
      state.Projects.projects = initialState.projects;
      state.Projects.lastFetched = undefined;
    });
  },
});

export default createProjectsSlice;
