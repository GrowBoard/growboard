import { renderHook } from '@testing-library/react';
import useAuthCheckTest from '../useAuthCheckTest';
import { useCallSBMutation } from '@services/hooks/common';
import { authCheckTest } from '@services/backend';

jest.mock('@services/hooks/common', () => ({
  useCallSBMutation: jest.fn(),
}));

jest.mock('@services/backend', () => ({
  authCheckTest: jest.fn(),
}));

describe('useAuthCheckTest hook', () => {
  it('calls useCallSBMutation with correct configuration', () => {
    (useCallSBMutation as jest.Mock).mockReturnValue('mutation-instance');

    const options = { mutationKey: ['authCheck'] };
    const { result } = renderHook(() => useAuthCheckTest(options));

    expect(useCallSBMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        mutationOptions: expect.objectContaining({
          retry: 2,
          retryDelay: 1000,
          mutationKey: ['authCheck'],
        }),
      }),
    );

    // Verify method invocation works
    const method = (useCallSBMutation as jest.Mock).mock.calls[0][0].method;
    method();
    expect(authCheckTest).toHaveBeenCalled();

    expect(result.current).toBe('mutation-instance');
  });
});
