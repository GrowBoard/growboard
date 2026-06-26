import { TimeWindow } from '@store';
import {
  getWindowString,
  getPrevDate,
  getNextDate,
  getDateFromState,
} from '../utils';

describe('ExpensesTimeWindow utils', () => {
  describe('getWindowString', () => {
    it('should return correct string for DAY time window', () => {
      const date = { day: 15, month: 5, year: 2026 }; // June
      const result = getWindowString(TimeWindow.DAY, date);
      expect(result).toBe('15 June 2026');
    });

    it('should return correct string for MONTH time window', () => {
      const date = { day: 15, month: 5, year: 2026 }; // June
      const result = getWindowString(TimeWindow.MONTH, date);
      expect(result).toBe('June 2026');
    });

    it('should return correct string for YEAR time window', () => {
      const date = { day: 15, month: 5, year: 2026 };
      const result = getWindowString(TimeWindow.YEAR, date);
      expect(result).toBe('2026');
    });
  });

  describe('getPrevDate', () => {
    it('should handle MONTH prev date correctly', () => {
      const date = { day: 15, month: 5, year: 2026 };
      expect(getPrevDate(TimeWindow.MONTH, date)).toEqual({
        day: 15,
        month: 4,
        year: 2026,
      });

      const JanDate = { day: 15, month: 0, year: 2026 };
      expect(getPrevDate(TimeWindow.MONTH, JanDate)).toEqual({
        day: 15,
        month: 11,
        year: 2025,
      });
    });

    it('should handle YEAR prev date correctly', () => {
      const date = { day: 15, month: 5, year: 2026 };
      expect(getPrevDate(TimeWindow.YEAR, date)).toEqual({
        day: 15,
        month: 5,
        year: 2025,
      });
    });
  });

  describe('getNextDate', () => {
    it('should handle MONTH next date correctly', () => {
      const date = { day: 15, month: 5, year: 2026 };
      expect(getNextDate(TimeWindow.MONTH, date)).toEqual({
        day: 15,
        month: 6,
        year: 2026,
      });

      const DecDate = { day: 15, month: 11, year: 2026 };
      expect(getNextDate(TimeWindow.MONTH, DecDate)).toEqual({
        day: 15,
        month: 0,
        year: 2027,
      });
    });

    it('should handle YEAR next date correctly', () => {
      const date = { day: 15, month: 5, year: 2026 };
      expect(getNextDate(TimeWindow.YEAR, date)).toEqual({
        day: 15,
        month: 5,
        year: 2027,
      });
    });
  });

  describe('getDateFromState', () => {
    it('should return correct startDate for DAY', () => {
      const date = { day: 15, month: 5, year: 2026 };
      expect(getDateFromState(TimeWindow.DAY, date)).toEqual({
        startDate: '2026-06-15',
      });
    });

    it('should return correct startDate for MONTH', () => {
      const date = { day: 15, month: 5, year: 2026 };
      expect(getDateFromState(TimeWindow.MONTH, date)).toEqual({
        startDate: '2026-06-01',
      });
    });

    it('should return correct startDate for YEAR', () => {
      const date = { day: 15, month: 5, year: 2026 };
      expect(getDateFromState(TimeWindow.YEAR, date)).toEqual({
        startDate: '2026-01-01',
      });
    });
  });
});
