import { GoalItem } from '@store';
import { GREETING_QUOTES, RECENT_ITEMS_COUNT } from './const';

/**
 * getGreeting
 * Returns a time-aware greeting string based on the current hour.
 *
 * @param name - The user's display name.
 * @returns A greeting string such as "Good Morning, Alice".
 */
export const getGreeting = (name: string): string => {
  const hour = new Date().getHours();
  if (hour < 12) return `Good Morning, ${name}`;
  if (hour < 17) return `Good Afternoon, ${name}`;
  return `Good Evening, ${name}`;
};

/**
 * getDailyQuote
 * Returns the motivational quote for the current day of the week.
 *
 * @returns A quote string selected by the current day index (0=Sunday).
 */
export const getDailyQuote = (): string => {
  const dayIndex = new Date().getDay();
  return GREETING_QUOTES[dayIndex] ?? GREETING_QUOTES[0];
};

/**
 * getFormattedDate
 * Returns the current date formatted as a human-readable string.
 * Example: "Sunday, 29 June 2026"
 *
 * @returns Formatted date string.
 */
export const getFormattedDate = (): string => {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * getRecentGoals
 * Returns the most recently updated goals, sorted by `updatedAt` descending.
 *
 * @param goals - Full list of GoalItem entries.
 * @returns Slice of up to RECENT_ITEMS_COUNT goals.
 */
export const getRecentGoals = (goals: GoalItem[]): GoalItem[] => {
  return [...goals]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, RECENT_ITEMS_COUNT);
};

/**
 * getActiveGoalsCount
 * Counts goals with status "In-Progress".
 *
 * @param goals - Full list of GoalItem entries.
 * @returns Count of in-progress goals.
 */
export const getActiveGoalsCount = (goals: GoalItem[]): number => {
  return goals.filter((g) => g.status === 'In-Progress').length;
};
