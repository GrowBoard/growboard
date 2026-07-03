import { TimeWindow } from '@store';
import {
  getWindowString,
  getPrevDate,
  getNextDate,
  getDateFromState,
} from '../utils';

describe('ExpensesTimeWindow utils', () => {
  const date = { day: 15, month: 5, year: 2024 };

  describe('getWindowString', () => {
    it('returns day-level string for TimeWindow.DAY', () => {
      const result = getWindowString(TimeWindow.DAY, date);
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('returns month-level string for TimeWindow.MONTH', () => {
      const result = getWindowString(TimeWindow.MONTH, date);
      expect(result).toContain('2024');
      expect(result).not.toContain('15');
    });

    it('returns year string for TimeWindow.YEAR', () => {
      const result = getWindowString(TimeWindow.YEAR, date);
      expect(result).toBe('2024');
    });
  });

  describe('getPrevDate', () => {
    it('goes to previous day within the month', () => {
      const result = getPrevDate(TimeWindow.DAY, {
        day: 10,
        month: 5,
        year: 2024,
      });
      expect(result).toEqual({ day: 9, month: 5, year: 2024 });
    });

    it('goes to last day of previous month when day=1 and month>1', () => {
      const result = getPrevDate(TimeWindow.DAY, {
        day: 1,
        month: 3,
        year: 2024,
      });
      expect(result).toEqual({ day: 29, month: 2, year: 2024 }); // March 1 → Feb 29 (leap year)
    });

    it('goes to Dec 31 of previous year when day=1, month=1', () => {
      const result = getPrevDate(TimeWindow.DAY, {
        day: 1,
        month: 1,
        year: 2024,
      });
      expect(result).toEqual({ day: 31, month: 11, year: 2023 });
    });

    it('goes to previous month', () => {
      const result = getPrevDate(TimeWindow.MONTH, {
        day: 15,
        month: 5,
        year: 2024,
      });
      expect(result).toEqual({ day: 15, month: 4, year: 2024 });
    });

    it('wraps to December of previous year when month=0', () => {
      const result = getPrevDate(TimeWindow.MONTH, {
        day: 15,
        month: 0,
        year: 2024,
      });
      expect(result).toEqual({ day: 15, month: 11, year: 2023 });
    });

    it('goes to previous year', () => {
      const result = getPrevDate(TimeWindow.YEAR, {
        day: 15,
        month: 5,
        year: 2024,
      });
      expect(result).toEqual({ day: 15, month: 5, year: 2023 });
    });
  });

  describe('getNextDate', () => {
    it('goes to next day within the month', () => {
      const result = getNextDate(TimeWindow.DAY, {
        day: 10,
        month: 5,
        year: 2024,
      });
      expect(result).toEqual({ day: 11, month: 5, year: 2024 });
    });

    it('goes to first day of next month when last day of month', () => {
      // May has 31 days; month=5 means day=new Date(2024, 5, 0).getDate() = 31
      const result = getNextDate(TimeWindow.DAY, {
        day: 31,
        month: 5,
        year: 2024,
      });
      expect(result).toEqual({ day: 1, month: 6, year: 2024 });
    });

    it('goes to Jan 1 of next year when last day of Dec', () => {
      const result = getNextDate(TimeWindow.DAY, {
        day: 31,
        month: 12,
        year: 2024,
      });
      expect(result).toEqual({ day: 1, month: 1, year: 2025 });
    });

    it('goes to next month', () => {
      const result = getNextDate(TimeWindow.MONTH, {
        day: 15,
        month: 5,
        year: 2024,
      });
      expect(result).toEqual({ day: 15, month: 6, year: 2024 });
    });

    it('wraps to January of next year when month=11', () => {
      const result = getNextDate(TimeWindow.MONTH, {
        day: 15,
        month: 11,
        year: 2024,
      });
      expect(result).toEqual({ day: 15, month: 0, year: 2025 });
    });

    it('goes to next year', () => {
      const result = getNextDate(TimeWindow.YEAR, {
        day: 15,
        month: 5,
        year: 2024,
      });
      expect(result).toEqual({ day: 15, month: 5, year: 2025 });
    });
  });

  describe('getDateFromState', () => {
    it('returns startDate for DAY window', () => {
      const result = getDateFromState(TimeWindow.DAY, {
        day: 5,
        month: 5,
        year: 2024,
      });
      expect(result).toEqual({ startDate: '2024-06-5' });
    });

    it('returns startDate for MONTH window (day fixed to 01)', () => {
      const result = getDateFromState(TimeWindow.MONTH, {
        day: 15,
        month: 5,
        year: 2024,
      });
      expect(result).toEqual({ startDate: '2024-06-01' });
    });

    it('returns startDate for YEAR window (Jan 1st)', () => {
      const result = getDateFromState(TimeWindow.YEAR, {
        day: 15,
        month: 5,
        year: 2024,
      });
      expect(result).toEqual({ startDate: '2024-01-01' });
    });

    it('pads single-digit month correctly', () => {
      const result = getDateFromState(TimeWindow.MONTH, {
        day: 1,
        month: 0,
        year: 2024,
      });
      expect(result).toEqual({ startDate: '2024-01-01' });
    });
  });
});
