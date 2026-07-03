import { HabitItem, HabitLogItem } from '@store';

/**
 * Props for the HabitCalendar component.
 */
export interface HabitCalendarProps {
  /** The currently viewed year (e.g. 2026) */
  year: number;
  /** The currently viewed month (0-indexed, 0 = January) */
  month: number;
  /** List of all active habits */
  habits: HabitItem[];
  /** List of all habit check-in logs */
  logs: HabitLogItem[];
  /** Callback fired when a calendar day cell is clicked */
  onDayClick: (dateStr: string) => void;
  /** Callback fired when the calendar month/year changes */
  onMonthChange: (year: number, month: number) => void;
}

/**
 * Props for the HabitCalendarDay component.
 */
export interface HabitCalendarDayProps {
  /** The day number of the month (e.g. 15) */
  day: number | null;
  /** The full ISO date string (YYYY-MM-DD), or null if empty cell padding */
  dateStr: string | null;
  /** Total number of habits active on this day */
  activeHabitsCount: number;
  /** Total number of completed habits on this day */
  completedHabitsCount: number;
  /** Calculated completion percentage (0 to 100) */
  completionPercentage: number;
  /** Theme semantic token string for the heat-map background */
  heatMapBgToken: string;
  /** Callback fired when this day cell is clicked */
  onClick?: () => void;
  /** Whether this day cell represents the current date (today) */
  isToday: boolean;
  /** Whether this day falls on a weekend (Saturday or Sunday) */
  isWeekend?: boolean;
}

/**
 * Props for the HabitDayDrawer component.
 */
export interface HabitDayDrawerProps {
  /** The selected ISO date string (YYYY-MM-DD) being viewed/tracked */
  dateStr: string;
  /** Whether the drawer is open */
  isOpen: boolean;
  /** Callback to close the drawer */
  onClose: () => void;
  /** List of all habit definitions */
  habits: HabitItem[];
  /** List of all check-in logs */
  logs: HabitLogItem[];
  /** Callback mutation trigger to save/upsert a log entry */
  onSaveLog: (log: Omit<HabitLogItem, 'id'>) => Promise<any>;
}

/**
 * Props for the HabitDayListItem component.
 */
export interface HabitDayListItemProps {
  /** The habit definition item */
  habit: HabitItem;
  /** Optional log entry for this habit on the selected date */
  log?: HabitLogItem;
  /** Callback fired when the completed status is toggled */
  onToggle: (completed: boolean, note: string) => void;
}

/**
 * Props for the AddHabitModal component.
 */
export interface AddHabitModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Callback fired when a new habit is saved */
  onSaveHabit: (habit: Omit<HabitItem, 'id'>) => Promise<any>;
  /** Optional habit item if editing, null if creating new */
  editItem?: HabitItem | null;
}

/**
 * Props for the SeeHabitModal component.
 */
export interface SeeHabitModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** List of all habit definitions */
  habits: HabitItem[];
  /** List of all check-in logs */
  logs: HabitLogItem[];
  /** Optional callback to trigger habit deletion */
  onDeleteHabit?: (habitId: string) => Promise<any>;
  /** Optional callback to trigger habit edit */
  onEditHabit?: (habit: HabitItem) => void;
}
