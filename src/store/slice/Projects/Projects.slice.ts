import { AppStoreSlice } from '@store';
import { ProjectDataState, ProjectStateSlice, ProjectData } from './types';

const initialState: ProjectDataState = {
  projects: [],
};

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
        (p) => p.id === project.projects,
      );
      state.Projects.projects[projectIndex] = project;
    });
  },
  removeProjects(projectId: string) {
    set((state) => {
      state.Projects.projects = state.Projects.projects.filter(
        (project: ProjectData) => project.id !== projectId,
      );
    });
  },
});

export default createProjectsSlice;
