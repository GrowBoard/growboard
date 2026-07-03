import { renderHook } from '@testing-library/react';
import useToast from '../useToast';
import { toaster } from '../../toaster';

// Mock toaster
jest.mock('../../toaster', () => ({
  toaster: {
    create: jest.fn(),
    dismiss: jest.fn(),
    promise: jest.fn(),
  },
}));

describe('useToast hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls create on basic invocation', () => {
    const { result } = renderHook(() => useToast());
    result.current({ title: 'Basic' });
    expect(toaster.create).toHaveBeenCalledWith({ title: 'Basic' });
  });

  it('handles success toast with string and object options', () => {
    const { result } = renderHook(() => useToast());

    result.current.success('Success text');
    expect(toaster.create).toHaveBeenCalledWith({ title: 'Success text', type: 'success' });

    result.current.success({ title: 'Custom Success', duration: 1000 });
    expect(toaster.create).toHaveBeenCalledWith({ title: 'Custom Success', duration: 1000, type: 'success' });
  });

  it('handles error toast', () => {
    const { result } = renderHook(() => useToast());

    result.current.error('Error text');
    expect(toaster.create).toHaveBeenCalledWith({ title: 'Error text', type: 'error' });

    result.current.error({ title: 'Custom Error' });
    expect(toaster.create).toHaveBeenCalledWith({ title: 'Custom Error', type: 'error' });
  });

  it('handles info, warning, and loading toasts', () => {
    const { result } = renderHook(() => useToast());

    result.current.info('Info text');
    expect(toaster.create).toHaveBeenCalledWith({ title: 'Info text', type: 'info' });

    result.current.warning('Warning text');
    expect(toaster.create).toHaveBeenCalledWith({ title: 'Warning text', type: 'warning' });

    result.current.loading('Loading text');
    expect(toaster.create).toHaveBeenCalledWith({ title: 'Loading text', type: 'loading' });
  });

  it('handles dismiss and promise calls', () => {
    const { result } = renderHook(() => useToast());

    result.current.dismiss('t1');
    expect(toaster.dismiss).toHaveBeenCalledWith('t1');

    const promise = Promise.resolve();
    result.current.promise(promise, {});
    expect(toaster.promise).toHaveBeenCalledWith(promise, {});
  });
});
