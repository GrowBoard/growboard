import { getGreeting, getDailyQuote, getFormattedDate, getRecentGoals, getActiveGoalsCount } from '../util';
import { GoalItem } from '@store';

/** Factory helper to build a minimal GoalItem for testing. */
const makeGoal = (overrides: Partial<GoalItem> = {}): GoalItem => ({
  title: 'Test Goal',
  subtitle: '',
  tags: [],
  details: '',
  timeline: [],
  status: 'Pending',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

describe('getGreeting', () => {
  it('returns a morning greeting for hours before 12', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(9);
    expect(getGreeting('Alice')).toBe('Good Morning, Alice');
    jest.restoreAllMocks();
  });

  it('returns an afternoon greeting for hours 12–16', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(14);
    expect(getGreeting('Bob')).toBe('Good Afternoon, Bob');
    jest.restoreAllMocks();
  });

  it('returns an evening greeting for hours 17+', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(20);
    expect(getGreeting('Carol')).toBe('Good Evening, Carol');
    jest.restoreAllMocks();
  });

  it('handles the exact boundary hour 12 as afternoon', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(12);
    expect(getGreeting('Dave')).toBe('Good Afternoon, Dave');
    jest.restoreAllMocks();
  });

  it('handles the exact boundary hour 17 as evening', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(17);
    expect(getGreeting('Eve')).toBe('Good Evening, Eve');
    jest.restoreAllMocks();
  });
});

describe('getDailyQuote', () => {
  it('returns a non-empty string', () => {
    const quote = getDailyQuote();
    expect(typeof quote).toBe('string');
    expect(quote.length).toBeGreaterThan(0);
  });
});

describe('getFormattedDate', () => {
  it('returns a non-empty string', () => {
    const date = getFormattedDate();
    expect(typeof date).toBe('string');
    expect(date.length).toBeGreaterThan(0);
  });
});

describe('getRecentGoals', () => {
  it('returns an empty array when given no goals', () => {
    expect(getRecentGoals([])).toEqual([]);
  });

  it('returns goals sorted by updatedAt descending', () => {
    const goals = [
      makeGoal({ title: 'Old', updatedAt: '2024-01-01T00:00:00.000Z' }),
      makeGoal({ title: 'New', updatedAt: '2024-06-01T00:00:00.000Z' }),
      makeGoal({ title: 'Mid', updatedAt: '2024-03-01T00:00:00.000Z' }),
    ];
    const result = getRecentGoals(goals);
    expect(result[0].title).toBe('New');
    expect(result[1].title).toBe('Mid');
    expect(result[2].title).toBe('Old');
  });

  it('returns at most 3 goals', () => {
    const goals = Array.from({ length: 6 }, (_, i) =>
      makeGoal({ title: `Goal ${i}`, updatedAt: `2024-0${i + 1}-01T00:00:00.000Z` }),
    );
    expect(getRecentGoals(goals)).toHaveLength(3);
  });

  it('does not mutate the original array', () => {
    const goals = [
      makeGoal({ title: 'A', updatedAt: '2024-01-01T00:00:00.000Z' }),
      makeGoal({ title: 'B', updatedAt: '2024-06-01T00:00:00.000Z' }),
    ];
    const original = [...goals];
    getRecentGoals(goals);
    expect(goals[0].title).toBe(original[0].title);
  });
});

describe('getActiveGoalsCount', () => {
  it('returns 0 for an empty list', () => {
    expect(getActiveGoalsCount([])).toBe(0);
  });

  it('counts only In-Progress goals', () => {
    const goals = [
      makeGoal({ status: 'In-Progress' }),
      makeGoal({ status: 'Completed' }),
      makeGoal({ status: 'Pending' }),
      makeGoal({ status: 'In-Progress' }),
    ];
    expect(getActiveGoalsCount(goals)).toBe(2);
  });

  it('returns 0 when no goals are in-progress', () => {
    const goals = [
      makeGoal({ status: 'Completed' }),
      makeGoal({ status: 'Pending' }),
    ];
    expect(getActiveGoalsCount(goals)).toBe(0);
  });
});
