import { renderHook } from '@testing-library/react';
import useGetExpensesDataForDate from '../useGetExpensesDataForDate';
import { appStore } from '@store';
import { useGetExpensesData } from '@services/hooks/private';

// Mock useGetExpensesData hook
jest.mock('@services/hooks/private', () => ({
  useGetExpensesData: jest.fn(() => ({
    isLoading: false,
    data: 'mock-expenses',
  })),
}));

describe('useGetExpensesDataForDate hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calculates correct start and end date of the month and queries expenses data', () => {
    appStore.setState({
      Expense: {
        ...appStore.getState().Expense,
        overview: {
          timeWindow: 'MONTH',
          month: 5, // June (0-indexed is 5)
          year: 2026,
        },
        date: new Date('2026-06-15'),
      },
    });

    const { result } = renderHook(() => useGetExpensesDataForDate());

    expect(useGetExpensesData).toHaveBeenCalledWith({
      start_date: '2026-06-02',
      end_date: '2026-07-01',
    });

    expect(result.current).toEqual({
      isLoading: false,
      data: 'mock-expenses',
    });
  });

  it('handles fallback date state if yearState or date is missing', () => {
    appStore.setState({
      Expense: {
        ...appStore.getState().Expense,
        overview: {
          timeWindow: 'MONTH',
          month: 5,
          year: undefined as any,
        },
        date: undefined as any,
      },
    });

    renderHook(() => useGetExpensesDataForDate());

    // Should default to current year
    const currentYear = new Date().getFullYear();
    expect(useGetExpensesData).toHaveBeenCalledWith(
      expect.objectContaining({
        start_date: expect.stringContaining(`${currentYear}-06-02`),
        end_date: expect.stringContaining(`${currentYear}-07-01`),
      })
    );
  });
});
