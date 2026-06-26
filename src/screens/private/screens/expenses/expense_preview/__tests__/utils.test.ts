import {
  getIsCurrentMonth,
  getSelectedMonthName,
  getTodayRowData,
  calculateStats,
} from '../utils';

describe('expense_preview utils', () => {
  describe('getIsCurrentMonth', () => {
    it('should return true for current month and year', () => {
      const today = new Date();
      expect(getIsCurrentMonth(today.getMonth(), today.getFullYear())).toBe(
        true,
      );
    });

    it('should return false for different month/year', () => {
      expect(getIsCurrentMonth(0, 2000)).toBe(false);
    });
  });

  describe('getSelectedMonthName', () => {
    it('should return correct month name', () => {
      expect(getSelectedMonthName(0, 2025)).toBe('January');
      expect(getSelectedMonthName(11, 2025)).toBe('December');
    });
  });

  describe('getTodayRowData', () => {
    it('should find row data for today if present', () => {
      const mockData = [
        { date: '2026-06-26', data: [], sum: 100 },
        { date: '2026-06-25', data: [], sum: 50 },
      ];
      const result = getTodayRowData(mockData, '2026-06-26');
      expect(result.sum).toBe(100);
    });

    it('should return default fallback data if today is not found', () => {
      const mockData = [{ date: '2026-06-25', data: [], sum: 50 }];
      const result = getTodayRowData(mockData, '2026-06-26');
      expect(result.date).toBe('2026-06-26');
      expect(result.sum).toBe(0);
      expect(result.data).toEqual([]);
    });
  });

  describe('calculateStats', () => {
    it('should return default values when loading or query response has no data', () => {
      expect(calculateStats(true, null, 5, 2026, 0)).toEqual({
        totalTransactions: 0,
        highestCategory: null,
        dailyAverage: 0,
      });
    });

    it('should correctly calculate statistics', () => {
      const mockQueryResponse = {
        data: [
          { amount: 100, category: 'Food', date_time: '2026-06-25' },
          { amount: 200, category: 'Rent', date_time: '2026-06-26' },
          { amount: 50, category: 'Food', date_time: '2026-06-26' },
        ],
      };
      // totalSum = 350, June days = 30
      const result = calculateStats(false, mockQueryResponse, 5, 2026, 350);
      expect(result.totalTransactions).toBe(3);
      expect(result.highestCategory).toEqual({ name: 'Rent', amount: 200 });
      expect(result.dailyAverage).toBeCloseTo(350 / 30);
    });
  });
});
