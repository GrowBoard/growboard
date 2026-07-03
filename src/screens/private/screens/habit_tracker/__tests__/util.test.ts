import {
  isHabitActiveOnDate,
  calcDayCompletionStats,
  getHeatMapBgToken,
  getMonthGrid,
  formatLocalDate,
} from '../util';
import { HabitItem, HabitLogItem } from '@store';
import { HEAT_MAP_TOKENS } from '../const';

describe('Habit Tracker Utilities', () => {
  describe('isHabitActiveOnDate', () => {
    const habit: HabitItem = {
      id: 'h1',
      name: 'Exercise',
      startDate: '2026-07-01',
      endDate: '2026-07-10',
      targetPercentage: 100,
      createdAt: '2026-07-01T00:00:00Z',
    };

    const openHabit: HabitItem = {
      id: 'h2',
      name: 'Drink Water',
      startDate: '2026-07-01',
      endDate: '',
      targetPercentage: 80,
      createdAt: '2026-07-01T00:00:00Z',
    };

    it('returns false for dates before start date', () => {
      expect(isHabitActiveOnDate(habit, '2026-06-30')).toBe(false);
      expect(isHabitActiveOnDate(openHabit, '2026-06-30')).toBe(false);
    });

    it('returns true for start date', () => {
      expect(isHabitActiveOnDate(habit, '2026-07-01')).toBe(true);
      expect(isHabitActiveOnDate(openHabit, '2026-07-01')).toBe(true);
    });

    it('returns true for dates between start and end date inclusive', () => {
      expect(isHabitActiveOnDate(habit, '2026-07-05')).toBe(true);
      expect(isHabitActiveOnDate(habit, '2026-07-10')).toBe(true);
    });

    it('returns false for dates after end date', () => {
      expect(isHabitActiveOnDate(habit, '2026-07-11')).toBe(false);
    });

    it('returns true indefinitely for open-ended habits after start date', () => {
      expect(isHabitActiveOnDate(openHabit, '2026-08-31')).toBe(true);
      expect(isHabitActiveOnDate(openHabit, '2030-01-01')).toBe(true);
    });

    it('handles day of week constraints correctly', () => {
      const constrainedHabit: HabitItem = {
        id: 'h3',
        name: 'Mon Wed Fri Yoga',
        startDate: '2026-07-01',
        endDate: '',
        targetPercentage: 80,
        createdAt: '2026-07-01T00:00:00Z',
        days: [1, 3, 5], // Monday, Wednesday, Friday
      };

      // 2026-07-01 is a Wednesday (day 3) -> should be active
      expect(isHabitActiveOnDate(constrainedHabit, '2026-07-01')).toBe(true);
      
      // 2026-07-02 is a Thursday (day 4) -> should NOT be active
      expect(isHabitActiveOnDate(constrainedHabit, '2026-07-02')).toBe(false);

      // 2026-07-03 is a Friday (day 5) -> should be active
      expect(isHabitActiveOnDate(constrainedHabit, '2026-07-03')).toBe(true);

      // 2026-07-05 is a Sunday (day 0) -> should NOT be active
      expect(isHabitActiveOnDate(constrainedHabit, '2026-07-05')).toBe(false);
    });
  });

  describe('calcDayCompletionStats', () => {
    const habits: HabitItem[] = [
      {
        id: 'h1',
        name: 'H1',
        startDate: '2026-07-01',
        endDate: '',
        targetPercentage: 100,
        createdAt: '',
      },
      {
        id: 'h2',
        name: 'H2',
        startDate: '2026-07-01',
        endDate: '2026-07-05',
        targetPercentage: 80,
        createdAt: '',
      },
    ];

    it('returns 0s if no habits are active', () => {
      const stats = calcDayCompletionStats('2026-06-30', habits, []);
      expect(stats).toEqual({
        activeCount: 0,
        completedCount: 0,
        percentage: 0,
      });
    });

    it('returns correct counts when habits are active but none completed', () => {
      const stats = calcDayCompletionStats('2026-07-02', habits, []);
      expect(stats).toEqual({
        activeCount: 2,
        completedCount: 0,
        percentage: 0,
      });
    });

    it('returns correct stats when some habits are completed', () => {
      const logs: HabitLogItem[] = [
        {
          id: 'l1',
          habitId: 'h1',
          date: '2026-07-02',
          completed: true,
          loggedAt: '',
          note: '',
        },
        {
          id: 'l2',
          habitId: 'h2',
          date: '2026-07-02',
          completed: false,
          loggedAt: '',
          note: '',
        },
      ];
      const stats = calcDayCompletionStats('2026-07-02', habits, logs);
      expect(stats).toEqual({
        activeCount: 2,
        completedCount: 1,
        percentage: 50,
      });
    });

    it('filters out logs for inactive habits or different dates', () => {
      const logs: HabitLogItem[] = [
        {
          id: 'l1',
          habitId: 'h1',
          date: '2026-07-02',
          completed: true,
          loggedAt: '',
          note: '',
        },
        {
          id: 'l2',
          habitId: 'h2',
          date: '2026-07-06', // H2 is inactive on this day anyway, and log is on wrong date
          completed: true,
          loggedAt: '',
          note: '',
        },
      ];
      const stats = calcDayCompletionStats('2026-07-02', habits, logs);
      expect(stats).toEqual({
        activeCount: 2,
        completedCount: 1,
        percentage: 50,
      });
    });

    it('handles ended habits correctly', () => {
      const logs: HabitLogItem[] = [
        {
          id: 'l1',
          habitId: 'h1',
          date: '2026-07-06',
          completed: true,
          loggedAt: '',
          note: '',
        },
      ];
      // On 2026-07-06, only H1 is active. So 1 active, 1 completed.
      const stats = calcDayCompletionStats('2026-07-06', habits, logs);
      expect(stats).toEqual({
        activeCount: 1,
        completedCount: 1,
        percentage: 100,
      });
    });
  });

  describe('getHeatMapBgToken', () => {
    it('returns NONE if activeCount is 0 or percentage is 0', () => {
      expect(getHeatMapBgToken(0, 0)).toBe(HEAT_MAP_TOKENS.NONE);
      expect(getHeatMapBgToken(100, 0)).toBe(HEAT_MAP_TOKENS.NONE);
      expect(getHeatMapBgToken(0, 5)).toBe(HEAT_MAP_TOKENS.NONE);
    });

    it('returns LOW for percentages <= 39', () => {
      expect(getHeatMapBgToken(1, 1)).toBe(HEAT_MAP_TOKENS.LOW);
      expect(getHeatMapBgToken(39, 2)).toBe(HEAT_MAP_TOKENS.LOW);
    });

    it('returns MID for percentages 40 to 69', () => {
      expect(getHeatMapBgToken(40, 1)).toBe(HEAT_MAP_TOKENS.MID);
      expect(getHeatMapBgToken(69, 3)).toBe(HEAT_MAP_TOKENS.MID);
    });

    it('returns HIGH for percentages 70 to 99', () => {
      expect(getHeatMapBgToken(70, 1)).toBe(HEAT_MAP_TOKENS.HIGH);
      expect(getHeatMapBgToken(99, 4)).toBe(HEAT_MAP_TOKENS.HIGH);
    });

    it('returns FULL for percentage === 100', () => {
      expect(getHeatMapBgToken(100, 1)).toBe(HEAT_MAP_TOKENS.FULL);
    });
  });

  describe('getMonthGrid', () => {
    it('generates the correct grid for a given month/year', () => {
      // January 2026 starts on a Thursday (4 padding nulls: Sun=0, Mon=1, Tue=2, Wed=3)
      // Jan has 31 days.
      // Grid length should be a multiple of 7.
      // 4 paddings + 31 days = 35 entries. 35 is a multiple of 7.
      const grid = getMonthGrid(2026, 0); // 0 = Jan
      expect(grid).toHaveLength(35);
      expect(grid.slice(0, 4)).toEqual([null, null, null, null]);
      expect(grid[4]).toBe('2026-01-01');
      expect(grid[34]).toBe('2026-01-31');
    });

    it('adds padding at the end if needed', () => {
      // February 2026 starts on Sunday (0 padding).
      // Feb has 28 days.
      // 0 paddings + 28 days = 28 entries.
      const grid = getMonthGrid(2026, 1); // 1 = Feb
      expect(grid).toHaveLength(28);
      expect(grid[0]).toBe('2026-02-01');
      expect(grid[27]).toBe('2026-02-28');
    });
  });

  describe('formatLocalDate', () => {
    it('formats date correctly in local YYYY-MM-DD format', () => {
      const date = new Date(2026, 6, 3); // July 3, 2026
      expect(formatLocalDate(date)).toBe('2026-07-03');
    });
  });
});
