/**
 * GoalItem type definition.
 * Represents a single goal configuration object.
 */
export interface GoalItem {
  /** The unique title identifying the goal */
  title: string;
  /** A short description or subtitle */
  subtitle: string;
  /** List of tags associated with the goal */
  tags: string[];
  /** Detailed description or multiline details of the goal */
  details: string;
  /** List of timeline entry milestones or steps */
  timeline: string[];
  /** Status of the goal */
  status: 'Pending' | 'In-Progress' | 'Completed';
  /** Optional positive integer rank */
  ranking?: number;
  /** Creation ISO timestamp */
  createdAt: string;
  /** Update ISO timestamp */
  updatedAt: string;
}

/**
 * GoalsState type definition.
 * Holds the state object structure for goals.
 */
export type GoalsState = {
  /** The current list of goals */
  goalsData: GoalItem[];
  /** Timestamp when goals were last fetched from Google Drive */
  lastFetched?: number;
};

/**
 * GoalsStateActions interface.
 * Defines callback mutation handlers to update store state.
 */
export interface GoalsStateActions {
  /** Callback action to update the full goals list */
  updateGoals: (goals: GoalItem[]) => void;
  /** Callback action to clear/remove all goals */
  removeGoals: () => void;
}

/**
 * Combined goals slice holding both state and actions.
 */
export type GoalsStateSlice = GoalsState & GoalsStateActions;
