/**
 * Type definition for the tech data.
 */
interface TechData {
  names: string;
  icon: string;
}

/**
 * Type definition for the project todo.
 */
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

interface ProjectDataSchema {
  project_id: string;
  user_id: string;
  project_name: string;
  project_desc: string;
  project_icon: string;
  tech_used: { data: TechData[] };
  project_link: string;
  github_link: string;
  hostinger_link: string;
  images: { data: string[] };
  is_live: boolean;
  related_ideas: { data: string[] };
  started_on: string;
  features: { data: ProjectFeature[] };
  todos: { data: ProjectTodo[] };
  project_completed: number;
  backend_link: string;
}

interface ProjectData {
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
}

// Export the type
export type {
  ProjectData,
  ProjectDataSchema,
  TechData,
  ProjectTodo,
  ProjectFeature,
};
