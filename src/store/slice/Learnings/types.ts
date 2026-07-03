/**
 * LearningItem type definition.
 * Represents a single learning item object.
 */
export interface LearningItem {
  /** The unique title identifying the learning */
  title: string;
  /** A short description or subtitle */
  subtitle: string;
  /** List of tags associated with the learning */
  tags: string[];
  /** Detailed content formatted in markdown */
  content: string;
  /** Creation ISO timestamp */
  createdAt: string;
  /** Update ISO timestamp */
  updatedAt: string;
}

/**
 * LearningsState type definition.
 * Holds the state object structure for learnings.
 */
export type LearningsState = {
  /** The current list of learnings */
  learningsData: LearningItem[];
  /** Timestamp when learnings were last fetched from Google Drive */
  lastFetched?: number;
};

/**
 * LearningsStateActions interface.
 * Defines callback mutation handlers to update store state.
 */
export interface LearningsStateActions {
  /** Callback action to update the full learnings list */
  updateLearnings: (learnings: LearningItem[]) => void;
  /** Callback action to clear/remove all learnings */
  removeLearnings: () => void;
}

/**
 * Combined learnings slice holding both state and actions.
 */
export type LearningsStateSlice = LearningsState & LearningsStateActions;
