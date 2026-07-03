import { validateEmail, validatePassword, getIstDate } from '../Input';

describe('Input utility functions', () => {
  describe('validateEmail', () => {
    it('returns true for valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@sub.domain.co')).toBe(true);
    });

    it('returns false for invalid emails', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('user@domain')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('returns true for valid passwords (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)', () => {
      expect(validatePassword('P@ssword123')).toBe(true);
      expect(validatePassword('aB3defgh')).toBe(true);
    });

    it('returns false for invalid passwords', () => {
      expect(validatePassword('short')).toBe(false); // too short
      expect(validatePassword('no_digits_UPPER')).toBe(false); // no digits
      expect(validatePassword('NO_LOWERCASE123')).toBe(false); // no lowercase
      expect(validatePassword('no_uppercase123')).toBe(false); // no uppercase
    });
  });

  describe('getIstDate', () => {
    it('formats year, month, and day into YYYY-MM-DD format in IST timeZone', () => {
      const formatted = getIstDate({ day: 2, month: 6, year: 2026 }); // July is 6
      expect(formatted).toBe('2026-07-02');
    });
  });
});
