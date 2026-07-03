import { renderHook } from '@testing-library/react';
import useGetExpensesData from '../useGetExpensesData';
import { googleSheetsExpenseService } from '@services/googleSheets';
import { useQuery } from '@tanstack/react-query';

// Mock react-query's useQuery
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    isLoading: false,
    data: 'mock-query-result',
  })),
}));

// Mock googleSheetsExpenseService
jest.mock('@services/googleSheets', () => ({
  googleSheetsExpenseService: {
    getExpensesForMonth: jest.fn(),
  },
}));

describe('useGetExpensesData hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls useQuery with correct keys and fetches expenses for month', () => {
    renderHook(() =>
      useGetExpensesData({
        start_date: '2026-06-02',
        end_date: '2026-07-01',
      })
    );

    // Verify useQuery was called
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['start_date_2026-06-02', 'end_date_2026-07-01'],
        retry: 1,
      })
    );

    // Extract queryFn from useQuery call and invoke it
    const queryFn = (useQuery as jest.Mock).mock.calls[0][0].queryFn;
    queryFn();

    // Verify it called getExpensesForMonth (June is 5, 2026 is 2026)
    expect(googleSheetsExpenseService.getExpensesForMonth).toHaveBeenCalledWith(2026, 5);
  });
});
