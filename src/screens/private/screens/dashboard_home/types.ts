import { GoalItem, LearningItem } from '@store';

/**
 * Props for the GreetingHero component.
 */
export interface GreetingHeroProps {
  /** The user's first/display name shown in the greeting. */
  name: string;
}

/**
 * Props for the StatsTiles component.
 */
export interface StatsTilesProps {
  /** Total number of goals. */
  goalsCount: number;
  /** Number of in-progress goals. */
  activeGoalsCount: number;
  /** Total number of learnings. */
  learningsCount: number;
  /** Total number of stored credentials. */
  credsCount: number;
  /** Total number of plans. */
  plansCount: number;
  /** Total number of projects. */
  projectsCount: number;
}

/**
 * Props for the RecentGoals component.
 */
export interface RecentGoalsProps {
  /** List of the most recently updated goals to display. */
  goals: GoalItem[];
}

/**
 * Props for the RecentLearnings component.
 */
export interface RecentLearningsProps {
  /** List of the most recently updated learnings to display. */
  learnings: LearningItem[];
}

export type QuickActionsProps = Record<string, never>;

/**
 * Props for the ExpenseSummary component.
 * The component fetches its own data via the useGetExpensesDataForDate hook.
 */
export type ExpenseSummaryProps = Record<string, never>;
