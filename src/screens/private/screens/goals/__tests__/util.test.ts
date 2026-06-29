import { GoalItem } from '@store';
import { sanitizeGoalTitle, filterGoals } from '../util';

describe('sanitizeGoalTitle', () => {
  it('should lowercase the title and replace special characters with underscores', () => {
    expect(sanitizeGoalTitle('Learn System Design!')).toBe('learn_system_design_');
    expect(sanitizeGoalTitle('Goal-123_abc')).toBe('goal-123_abc');
    expect(sanitizeGoalTitle('  space title  ')).toBe('__space_title__');
  });
});

describe('filterGoals', () => {
  const mockGoals: GoalItem[] = [
    {
      title: 'Learn Go',
      subtitle: 'Build microservices in Go',
      tags: ['tech', 'backend'],
      details: 'Read books, build a server',
      timeline: ['Phase 1: syntax', 'Phase 2: concurrency'],
      status: 'Pending',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      title: 'Workout daily',
      subtitle: 'Stay healthy',
      tags: ['health'],
      details: 'Go to gym, run in park',
      timeline: ['Week 1: 3 days', 'Week 2: 5 days'],
      status: 'Pending',
      createdAt: '2026-01-02T00:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z',
    },
  ];

  it('should return all goals when query is empty', () => {
    expect(filterGoals(mockGoals, '')).toEqual(mockGoals);
    expect(filterGoals(mockGoals, '   ')).toEqual(mockGoals);
  });

  it('should filter by title (case-insensitive)', () => {
    const result = filterGoals(mockGoals, 'learn');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Learn Go');
  });

  it('should filter by subtitle', () => {
    const result = filterGoals(mockGoals, 'microservices');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Learn Go');
  });

  it('should filter by details', () => {
    const result = filterGoals(mockGoals, 'gym');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Workout daily');
  });

  it('should filter by tags', () => {
    const result = filterGoals(mockGoals, 'backend');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Learn Go');
  });

  it('should filter by timeline entries', () => {
    const result = filterGoals(mockGoals, 'concurrency');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Learn Go');
  });

  it('should return empty list when no match is found', () => {
    const result = filterGoals(mockGoals, 'cooking');
    expect(result).toHaveLength(0);
  });
});
