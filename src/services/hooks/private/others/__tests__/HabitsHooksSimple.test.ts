import { renderHook } from '@testing-library/react';
import useGetHabitsData from '../useGetHabitsData';
import useGetHabitLogsData from '../useGetHabitLogsData';
import useUpsertHabitLog from '../useUpsertHabitLog';
import { googleSheetsHabitsService } from '../../../../googleSheets/GoogleSheetsHabitsService';

// Mock react-query
const mockInvalidateQueries = jest.fn();
const mockMutationFnExec = jest.fn();
const mockQueryFnExec = jest.fn();

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(() => ({
    invalidateQueries: mockInvalidateQueries,
  })),
  useQuery: jest.fn((options) => {
    if (options && typeof options.queryFn === 'function') {
      mockQueryFnExec(options.queryFn);
    }
    return { data: undefined, isLoading: false };
  }),
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
    getHabits: jest.fn(() => Promise.resolve([])),
    getLogs: jest.fn(() => Promise.resolve([])),
    upsertLog: jest.fn(() => Promise.resolve({ id: 'log-123' })),
  },
}));

describe('Habits Simple Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useGetHabitsData', () => {
    it('executes getHabits query function', () => {
      renderHook(() => useGetHabitsData());
      expect(mockQueryFnExec).toHaveBeenCalled();

      const queryFn = mockQueryFnExec.mock.calls[0][0];
      queryFn();
      expect(googleSheetsHabitsService.getHabits).toHaveBeenCalled();
    });
  });

  describe('useGetHabitLogsData', () => {
    it('executes getLogs query function', () => {
      renderHook(() => useGetHabitLogsData());

      const queryFn = mockQueryFnExec.mock.calls[0][0];
      queryFn();
      expect(googleSheetsHabitsService.getLogs).toHaveBeenCalled();
    });
  });

  describe('useUpsertHabitLog', () => {
    it('calls upsertLog and invalidates logs query', () => {
      renderHook(() => useUpsertHabitLog());

      const mutationFn = mockMutationFnExec.mock.calls[0][0];
      const logPayload = {
        habitId: 'h-1',
        date: '2026-07-05',
        completed: true,
        note: '',
        loggedAt: '',
      };
      mutationFn(logPayload);

      expect(googleSheetsHabitsService.upsertLog).toHaveBeenCalledWith(
        logPayload,
      );
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['sheetHabitLogs'],
      });
    });
  });
});
