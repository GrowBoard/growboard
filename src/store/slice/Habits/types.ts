/**
 * HabitItem type definition.
 * Represents a single habit definition created by the user.
 */
export interface HabitItem {
  /** Unique identifier for the habit */
  id: string;
  /** Display name of the habit */
  name: string;
  /** ISO date string (YYYY-MM-DD) when the habit starts */
  startDate: string;
  /** ISO date string (YYYY-MM-DD) when the habit ends; empty string means open-ended */
  endDate: string;
  /** Target completion percentage (0–100) used as a personal benchmark */
  targetPercentage: number;
  /** ISO timestamp when the habit was created */
  createdAt: string;
}

/**
 * HabitLogItem type definition.
 * Represents a single daily check-in record for a specific habit.
 */
export interface HabitLogItem {
  /** Unique identifier for this log entry */
  id: string;
  /** Foreign key referencing HabitItem.id */
  habitId: string;
  /** ISO date string (YYYY-MM-DD) for the logged day */
  date: string;
  /** Whether the habit was completed on this day */
  completed: boolean;
  /** Optional free-text note for the day */
  note: string;
  /** ISO timestamp when this log entry was recorded */
  loggedAt: string;
}

/**
 * HabitsState type definition.
 * Holds the state object structure for habits and their daily logs.
 */
export type HabitsState = {
  /** The current list of habit definitions */
  habitsData: HabitItem[];
  /** The current list of daily habit log entries */
  habitLogsData: HabitLogItem[];
};

/**
 * HabitsStateActions interface.
 * Defines callback mutation handlers to update the habits store state.
 */
export interface HabitsStateActions {
  /** Callback action to replace the full habits list */
  updateHabits: (habits: HabitItem[]) => void;
  /** Callback action to clear all habit definitions */
  removeHabits: () => void;
  /** Callback action to replace the full habit logs list */
  updateHabitLogs: (logs: HabitLogItem[]) => void;
  /** Callback action to clear all habit log entries */
  removeHabitLogs: () => void;
}

/**
 * Combined habits slice holding both state and actions.
 */
export type HabitsStateSlice = HabitsState & HabitsStateActions;
