interface TechData {
  names: string;
  icon: string;
}

interface ProjectTodo {
  todoName: string;
  projectDesc: string;
  isCompleted: boolean;
}

interface ProjectFeature {
  featureName: string;
  featureDesc: string;
  isCompleted: boolean;
}
export type ProjectData = {
  [x: string]: any;
  projectId: string;
  userId: string;
  projectName: string;
  projectDesc: string;
  projectIcon: string;
  techUsed: TechData[];
  projectLink: string;
  githubLink: string;
  hostingerLink: string;
  images: string[];
  isLive: boolean;
  relatedIdeas: string[];
  startedOn: string;
  features: ProjectFeature[];
  todos: ProjectTodo[];
  projectCompleted: number;
  backendLink: string;
};

export type ProjectDataState = {
  projects: ProjectData[];
};

export interface ProjectDataStateActions {
  addProjects: (projects: ProjectData[]) => void;
  addSingleProject: (project: ProjectData) => void;
  updateSingleProject: (project: ProjectData) => void;
  removeProjects: (projectId: string) => void;
}

export type ProjectStateSlice = ProjectDataState & ProjectDataStateActions;
