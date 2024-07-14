import { AppStoreState } from '@store';

export const projectsSelector = (state: AppStoreState) => ({
  projectData: state.Projects.projects,
  addProjects: state.Projects.addProjects,
  addSingleProject: state.Projects.addSingleProject,
  updateSingleProject: state.Projects.updateSingleProject,
  removeProjects: state.Projects.removeProjects,
});
