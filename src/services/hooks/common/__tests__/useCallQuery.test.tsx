import { renderHook } from '@testing-library/react';
import useCallQuery from '../useCallQuery';
import { useQuery } from '@tanstack/react-query';

// Mock useQuery
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn((options) => {
    // Execute queryFn to simulate complete coverage
    if (options && typeof options.queryFn === 'function') {
      options.queryFn();
    }
    return { data: 'mock-data' };
  }),
}));

describe('useCallQuery hook', () => {
  it('calls useQuery and invokes method function in queryFn', () => {
    const mockMethod = jest.fn();
    const queryOptions = {
      queryKey: ['test-key'],
    };

    const { result } = renderHook(() =>
      useCallQuery({
        method: mockMethod,
        queryOptions,
      }),
    );

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['test-key'],
      }),
    );

    expect(mockMethod).toHaveBeenCalled();
    expect(result.current).toEqual({ data: 'mock-data' });
  });
});
