import { AppStoreSlice } from '@store';
import { ProjectDataState, ProjectStateSlice, ProjectData } from './types';

/**
 * The initial state configuration for the projects slice.
 */
const initialState: ProjectDataState = {
  projects: [],
};

/**
 * createProjectsSlice.
 * Initializes the state slice and mutation actions for projects data.
 *
 * @param set Central store setter callback.
 * @returns The projects state and actions slice.
 */
const createProjectsSlice: AppStoreSlice<ProjectStateSlice> = (set) => ({
  ...initialState,
  addProjects(projects: ProjectData[]) {
    set((state) => {
      state.Projects.projects = projects;
    });
  },
  addSingleProject(project: ProjectData) {
    set((state) => {
      state.Projects.projects.push(project);
    });
  },
  updateSingleProject(project: ProjectData) {
    set((state) => {
      const projectIndex = state.Projects.projects.findIndex(
        (p) => p.projectId === project.projectId,
      );
      if (projectIndex !== -1) {
        state.Projects.projects[projectIndex] = project;
      }
    });
  },
  removeProjects(projectId: string) {
    set((state) => {
      state.Projects.projects = state.Projects.projects.filter(
        (project: ProjectData) => project.projectId !== projectId,
      );
    });
  },
});

export default createProjectsSlice;
