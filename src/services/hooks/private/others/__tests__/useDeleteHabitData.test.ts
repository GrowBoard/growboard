import { renderHook } from '@testing-library/react';
import useDeleteHabitData from '../useDeleteHabitData';
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
    deleteHabit: jest.fn(),
  },
}));

describe('useDeleteHabitData hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls deleteHabit and invalidates queries on success', () => {
    renderHook(() => useDeleteHabitData());

    const mutationFn = mockMutationFnExec.mock.calls[0][0];
    mutationFn('h-123');

    expect(googleSheetsHabitsService.deleteHabit).toHaveBeenCalledWith('h-123');
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ['sheetHabits'],
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ['sheetHabitLogs'],
    });
  });
});
