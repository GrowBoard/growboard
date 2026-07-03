import { renderHook } from '@testing-library/react';
import useSuccessToast from '../useSuccessToast';
import { toaster } from '../../toaster';

// Mock toaster
jest.mock('../../toaster', () => ({
  toaster: {
    create: jest.fn(),
  },
}));

describe('useSuccessToast hook', () => {
  it('calls create with translated title and type success', () => {
    const { result } = renderHook(() => useSuccessToast());
    result.current('some.key');
    expect(toaster.create).toHaveBeenCalledWith({
      title: 'some.key',
      type: 'success',
    });
  });
});
