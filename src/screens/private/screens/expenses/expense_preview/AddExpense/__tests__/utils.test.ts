import { isValidAmount } from '../utils';

describe('AddExpense utils', () => {
  describe('isValidAmount', () => {
    it('should return true for positive non-zero amounts', () => {
      expect(isValidAmount('10')).toBe(true);
      expect(expect(isValidAmount('0.5')).toBe(true));
    });

    it('should return false for empty, zero, negative, or invalid strings', () => {
      expect(isValidAmount('')).toBe(false);
      expect(isValidAmount('0')).toBe(false);
      expect(isValidAmount('-10')).toBe(false);
      expect(isValidAmount('abc')).toBe(false);
    });
  });
});
