/**
 * Short labels for the days of the week.
 */
export const DAYS_OF_WEEK: string[] = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];

/**
 * Full names of the calendar months.
 */
export const MONTHS: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Breakpoints and corresponding theme semantic background color tokens
 * for the habit tracker calendar day heat-map cells.
 */
export const HEAT_MAP_TOKENS = {
  NONE: 'bg.habit.none',
  LOW: 'bg.habit.low',
  MID: 'bg.habit.mid',
  HIGH: 'bg.habit.high',
  FULL: 'bg.habit.full',
} as const;
