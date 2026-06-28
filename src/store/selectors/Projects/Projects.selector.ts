import { AppStoreState } from '@store';

/**
 * projectsSelector.
 * Selects the project data and mutation actions from the central store.
 * 
 * @param state The AppStoreState.
 * @returns Object holding projectData array and project slice action triggers.
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
   * Action trigger to add a single new project.
   */
  addSingleProject: state.Projects.addSingleProject,
  /**
   * Action trigger to update values of a specific project.
   */
  updateSingleProject: state.Projects.updateSingleProject,
  /**
   * Action trigger to delete/remove a project by identifier.
   */
  removeProjects: state.Projects.removeProjects,
});
export default projectsSelector;
