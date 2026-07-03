import { renderHook } from '@testing-library/react';
import useErrorToast from '../useErrorToast';
import { toaster } from '../../toaster';

// Mock toaster
jest.mock('../../toaster', () => ({
  toaster: {
    create: jest.fn(),
  },
}));

describe('useErrorToast hook', () => {
  it('calls create with translated title and type error', () => {
    const { result } = renderHook(() => useErrorToast());
    result.current('some.error.key');
    expect(toaster.create).toHaveBeenCalledWith({
      title: 'some.error.key',
      type: 'error',
    });
  });
});
