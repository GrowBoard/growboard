import { renderHook } from '@testing-library/react';
import useCallSBMutation from '../useCallSBMutation';
import { useMutation } from '@tanstack/react-query';

// Mock useMutation
jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn((options) => {
    // Execute mutationFn to simulate complete coverage
    if (options && typeof options.mutationFn === 'function') {
      options.mutationFn('mock-request');
    }
    return { mutate: jest.fn(), mutateAsync: jest.fn() };
  }),
}));

describe('useCallSBMutation hook', () => {
  it('calls useMutation and invokes method function in mutationFn', () => {
    const mockMethod = jest.fn();
    const mutationOptions = {
      onSuccess: jest.fn(),
    };

    renderHook(() =>
      useCallSBMutation({
        method: mockMethod,
        mutationOptions,
      })
    );

    expect(useMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        onSuccess: expect.any(Function),
      })
    );

    expect(mockMethod).toHaveBeenCalledWith('mock-request');
  });
});
