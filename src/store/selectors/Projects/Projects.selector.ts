import { AppStoreState } from '@store';

/**
 * projectsSelector.
 * Selects the project data and mutation actions from the central store.
 *
 * @param state The AppStoreState.
 * @returns Object holding projectData array and project slice actions.
 */
export const projectsSelector = (state: AppStoreState) => ({
  /**
   * The list of projects currently loaded.
   */
  projectData: state.Projects.projects,
  /**
   * Action trigger to add or bulk set projects.
   */
  addProjects: state.Projects.addProjects,
  /**
   * Action trigger to clear projects.
   */
  removeProjectsState: state.Projects.removeProjectsState,
});

export default projectsSelector;
