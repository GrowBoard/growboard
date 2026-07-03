/**
 * ProjectItem interface.
 * Represents a single project record stored in Google Sheets.
 */
export interface ProjectItem {
  /** The unique identifier of the project */
  Id: string;
  /** The primary title of the project */
  title: string;
  /** A short description or subtitle */
  subtitle: string;
  /** Link/URL to the live project or github repo */
  link: string;
  /** Associated tags for categorization */
  tags: string[];
  /** Detailed content explaining the project (markdown format) */
  about_project: string;
  /** Direct remarks/notes about the project */
  remark: string;
  /** The owner/assignee of the project */
  owner: string;
  /** The current status of the project */
  status: 'pending' | 'ideaphase' | 'started' | 'done';
}

/**
 * ProjectDataState interface.
 * Defines the projects slice state schema.
 */
export interface ProjectDataState {
  /** Loaded list of projects */
  projects: ProjectItem[];
  /** Timestamp when projects were last fetched from Google Sheets */
  lastFetched?: number;
}

/**
 * ProjectDataStateActions interface.
 * Actions to update projects state slice.
 */
export interface ProjectDataStateActions {
  /** Set or overwrite the entire loaded projects list */
  addProjects: (projects: ProjectItem[]) => void;
  /** Clear or reset the projects state to empty */
  removeProjectsState: () => void;
}

/**
 * Combined project state slice.
 */
export type ProjectStateSlice = ProjectDataState & ProjectDataStateActions;
