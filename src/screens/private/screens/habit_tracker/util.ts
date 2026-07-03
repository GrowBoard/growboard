import { HabitItem, HabitLogItem } from '@store';
import { HEAT_MAP_TOKENS } from './const';

/**
 * Checks if a habit is active on a specific date.
 * Lexicographical string comparison is safe since dates are in YYYY-MM-DD format.
 *
 * @param habit The habit definition.
 * @param dateStr ISO date string (YYYY-MM-DD).
 * @returns True if active, false otherwise.
 */
export const isHabitActiveOnDate = (
  habit: HabitItem,
  dateStr: string,
): boolean => {
  const start = habit.startDate;
  const end = habit.endDate;

  if (dateStr < start) {
    return false;
  }

  if (end && dateStr > end) {
    return false;
  }

  if (habit.days && habit.days.length > 0) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon, etc.
    if (!habit.days.includes(dayOfWeek)) {
      return false;
    }
  }

  return true;
};

/**
 * Calculates completion statistics for a given date.
 *
 * @param dateStr ISO date string (YYYY-MM-DD).
 * @param habits List of all habit definitions.
 * @param logs List of all check-in logs.
 * @returns Statistics including active count, completed count, and completion percentage.
 */
export const calcDayCompletionStats = (
  dateStr: string,
  habits: HabitItem[],
  logs: HabitLogItem[],
) => {
  // Find habits active on this day
  const activeHabits = habits.filter((habit) =>
    isHabitActiveOnDate(habit, dateStr),
  );
  const activeCount = activeHabits.length;

  if (activeCount === 0) {
    return { activeCount: 0, completedCount: 0, percentage: 0 };
  }

  // Find completed logs for this day for the active habits
  const completedCount = logs.filter((log) => {
    return (
      log.date === dateStr &&
      log.completed &&
      activeHabits.some((h) => h.id === log.habitId)
    );
  }).length;

  const percentage = Math.round((completedCount / activeCount) * 100);

  return {
    activeCount,
    completedCount,
    percentage,
  };
};

/**
 * Maps a completion percentage and active count to the correct theme semantic background color token.
 *
 * @param percentage Completion percentage (0 to 100).
 * @param activeCount Number of active habits.
 * @returns Semantic color token string.
 */
export const getHeatMapBgToken = (
  percentage: number,
  activeCount: number,
): string => {
  if (activeCount === 0 || percentage === 0) {
    return HEAT_MAP_TOKENS.NONE;
  }
  if (percentage <= 39) {
    return HEAT_MAP_TOKENS.LOW;
  }
  if (percentage <= 69) {
    return HEAT_MAP_TOKENS.MID;
  }
  if (percentage <= 99) {
    return HEAT_MAP_TOKENS.HIGH;
  }
  return HEAT_MAP_TOKENS.FULL;
};

/**
 * Generates the full 7-column calendar grid for a given month and year.
 * Pads the beginning and end with nulls to line up with days of the week.
 *
 * @param year Full year (e.g. 2026).
 * @param month 0-indexed month (0 = Jan).
 * @returns Array of date strings (YYYY-MM-DD) or null for padding.
 */
export const getMonthGrid = (
  year: number,
  month: number,
): Array<string | null> => {
  const firstDay = new Date(year, month, 1);
  const startDayOfWeek = firstDay.getDay(); // 0 = Sun, 1 = Mon, etc.

  const lastDay = new Date(year, month + 1, 0);
  const numDays = lastDay.getDate();

  const grid: Array<string | null> = [];

  // Padding for empty days at the start of the month
  for (let i = 0; i < startDayOfWeek; i++) {
    grid.push(null);
  }

  // Fill in active dates
  for (let day = 1; day <= numDays; day++) {
    const d = new Date(year, month, day);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    grid.push(`${yyyy}-${mm}-${dd}`);
  }

  // Padding for empty days at the end of the month to make it complete week grids (multiples of 7)
  const remaining = grid.length % 7;
  if (remaining !== 0) {
    for (let i = 0; i < 7 - remaining; i++) {
      grid.push(null);
    }
  }

  return grid;
};

/**
 * Formats a local date to YYYY-MM-DD.
 * Prevents UTC timezone shift issues.
 *
 * @param date The JS Date object.
 * @returns ISO YYYY-MM-DD string.
 */
export const formatLocalDate = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};
