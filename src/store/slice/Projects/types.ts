/**
 * TechData interface.
 * Represents information about a technology used in a project.
 */
export interface TechData {
  /** The name of the technology (e.g., React, Chakra UI). */
  names: string;
  /** The icon representation of the technology. */
  icon: string;
}

/**
 * ProjectTodo interface.
 * Represents a specific task or TODO item related to a project.
 */
export interface ProjectTodo {
  /** The name/title of the TODO item. */
  todoName: string;
  /** Description details for the TODO item. */
  projectDesc: string;
  /** Completion status of the TODO item. */
  isCompleted: boolean;
}

/**
 * ProjectFeature interface.
 * Represents a feature or milestone of a project.
 */
export interface ProjectFeature {
  /** The name/title of the feature. */
  featureName: string;
  /** Description details for the feature. */
  featureDesc: string;
  /** Completion status of the feature. */
  isCompleted: boolean;
}

/**
 * ProjectData type.
 * Represents the complete structured dataset for a specific project.
 */
export type ProjectData = {
  /** Unique project identifier. */
  projectId: string;
  /** Owner user identifier. */
  userId: string;
  /** Name of the project. */
  projectName: string;
  /** Description summary of the project. */
  projectDesc: string;
  /** Path/URL to the project's visual icon. */
  projectIcon: string;
  /** List of technologies utilized in this project. */
  techUsed: TechData[];
  /** Live link URL of the deployed application. */
  projectLink: string;
  /** GitHub repository link URL. */
  githubLink: string;
  /** Hostinger backend/panel link URL. */
  hostingerLink: string;
  /** Array of preview screenshot image URLs. */
  images: string[];
  /** Live status indicator. */
  isLive: boolean;
  /** List of related ideas or future scope items. */
  relatedIdeas: string[];
  /** ISO date string denoting when the project started. */
  startedOn: string;
  /** List of features defined for this project. */
  features: ProjectFeature[];
  /** List of TODO items to complete. */
  todos: ProjectTodo[];
  /** Completion percentage representation (0 to 100). */
  projectCompleted: number;
  /** Backend server codebase link URL. */
  backendLink: string;
};

/**
 * ProjectDataState type.
 * Defines the projects slice state schema.
 */
export type ProjectDataState = {
  /** Loaded list of projects. */
  projects: ProjectData[];
};

/**
 * ProjectDataStateActions interface.
 * Defines central reducer action callback triggers for project data modifications.
 */
export interface ProjectDataStateActions {
  /** Set or overwrite the entire loaded projects list. */
  addProjects: (projects: ProjectData[]) => void;
  /** Add a single new project to the list. */
  addSingleProject: (project: ProjectData) => void;
  /** Update details of an existing project in the list. */
  updateSingleProject: (project: ProjectData) => void;
  /** Delete a project from the list by its unique identifier. */
  removeProjects: (projectId: string) => void;
}

/**
 * ProjectStateSlice.
 * Represents the combined project state and actions slice.
 */
export type ProjectStateSlice = ProjectDataState & ProjectDataStateActions;
