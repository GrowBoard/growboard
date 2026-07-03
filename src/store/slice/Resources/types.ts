/**
 * ResourceItem type definition.
 * Represents a single resource item object retrieved from Google Sheets.
 */
export interface ResourceItem {
  /** The unique identifier of the resource */
  Id: string;
  /** The primary title of the resource */
  title: string;
  /** A short description or subtitle */
  subtitle: string;
  /** Direct link/URL to the resource */
  link: string;
  /** Associated tag badges */
  tags: string[];
  /** Detailed content explaining the resource (markdown supported) */
  about_resource: string;
}

/**
 * ResourcesState type definition.
 * Stores the list of resources fetched.
 */
export interface ResourcesState {
  /** The current list of resources */
  resourcesData: ResourceItem[];
  /** Timestamp when resources were last fetched from Google Sheets */
  lastFetched?: number;
}

/**
 * ResourcesStateActions interface.
 * Defines state modification handlers for resources.
 */
export interface ResourcesStateActions {
  /** Updates the local resources list in the store */
  updateResources: (resources: ResourceItem[]) => void;
  /** Resets the resources state to initial empty array */
  removeResources: () => void;
}

/**
 * Combined resources state slice containing state data and mutation actions.
 */
export type ResourcesStateSlice = ResourcesState & ResourcesStateActions;
