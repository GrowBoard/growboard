import { renderHook } from '@testing-library/react';
import useSaveHabitData from '../useSaveHabitData';
import { googleSheetsHabitsService } from '../../../../googleSheets/GoogleSheetsHabitsService';

// Mock react-query
const mockInvalidateQueries = jest.fn();
const mockMutationFnExec = jest.fn();
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(() => ({
    invalidateQueries: mockInvalidateQueries,
  })),
  useMutation: jest.fn((options) => {
    if (options && typeof options.mutationFn === 'function') {
      mockMutationFnExec(options.mutationFn);
    }
    if (options && typeof options.onSuccess === 'function') {
      options.onSuccess();
    }
    return { mutate: jest.fn(), mutateAsync: jest.fn() };
  }),
}));

// Mock GoogleSheetsHabitsService
jest.mock('../../../../googleSheets/GoogleSheetsHabitsService', () => ({
  googleSheetsHabitsService: {
    updateHabit: jest.fn(),
    addHabit: jest.fn(),
  },
}));

describe('useSaveHabitData hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls updateHabit when id is present', () => {
    renderHook(() => useSaveHabitData());

    const mutationFn = mockMutationFnExec.mock.calls[0][0];
    const habitWithId = {
      id: 'h-123',
      name: 'Habit A',
      startDate: '2026-07-01',
      endDate: '',
      targetPercentage: 80,
      createdAt: '',
    };
    mutationFn(habitWithId);

    expect(googleSheetsHabitsService.updateHabit).toHaveBeenCalledWith(
      'h-123',
      habitWithId,
    );
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ['sheetHabits'],
    });
  });

  it('calls addHabit when id is not present', () => {
    renderHook(() => useSaveHabitData());

    const mutationFn = mockMutationFnExec.mock.calls[0][0];
    const habitWithoutId = {
      name: 'Habit B',
      startDate: '2026-07-01',
      endDate: '',
      targetPercentage: 90,
      createdAt: '',
    };
    mutationFn(habitWithoutId);

    expect(googleSheetsHabitsService.addHabit).toHaveBeenCalledWith(
      habitWithoutId,
    );
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ['sheetHabits'],
    });
  });
});
