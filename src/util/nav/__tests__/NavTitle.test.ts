import getSubNavTitle from '../NavTitle';

describe('getSubNavTitle', () => {
  it('should handle root path', () => {
    const result = getSubNavTitle('/');
    expect(result).toEqual(['', '']);
  });

  it('should split and uppercase paths correctly for single level path', () => {
    const result = getSubNavTitle('/expenses');
    expect(result).toEqual(['', 'EXPENSES']);
  });

  it('should split, uppercase, and format nested paths with separator arrows', () => {
    const result = getSubNavTitle('/private/expenses/preview');
    expect(result).toEqual(['', 'PRIVATE > ', 'EXPENSES > ', 'PREVIEW']);
  });

  it('should handle empty paths', () => {
    const result = getSubNavTitle('');
    expect(result).toEqual(['']);
  });
});
