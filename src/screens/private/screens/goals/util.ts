import { GoalItem } from '@store';

/**
 * Sanitizes a goal title to create a safe file name for Google Drive.
 *
 * @param title The goal title.
 * @returns The sanitized title string.
 */
export const sanitizeGoalTitle = (title: string): string => {
  return title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
};

/**
 * Filters the list of goals based on a case-insensitive search query.
 * Matches title, subtitle, details, tags, and timeline entries.
 *
 * @param goals The list of goals to filter.
 * @param query The search query.
 * @returns The filtered list of goals.
 */
export const filterGoals = (goals: GoalItem[], query: string): GoalItem[] => {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) {
    return goals;
  }

  return goals.filter((goal) => {
    const titleMatch = goal.title.toLowerCase().includes(cleanQuery);
    const subtitleMatch = goal.subtitle.toLowerCase().includes(cleanQuery);
    const detailsMatch = goal.details.toLowerCase().includes(cleanQuery);
    const tagMatch = goal.tags.some((tag) =>
      tag.toLowerCase().includes(cleanQuery),
    );
    const timelineMatch = goal.timeline.some((item) =>
      item.toLowerCase().includes(cleanQuery),
    );

    return (
      titleMatch || subtitleMatch || detailsMatch || tagMatch || timelineMatch
    );
  });
};
