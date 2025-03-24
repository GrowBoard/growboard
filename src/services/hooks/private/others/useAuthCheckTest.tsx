import { authCheckTest } from '@services/backend';
import { useCallSBMutation } from '@services/hooks/common';
import { MutationOptions } from '@tanstack/react-query';

const useAuthCheckTest = (
  options?: MutationOptions<{ status: string }, Error, any, any>,
) => {
  return useCallSBMutation({
    method: () => authCheckTest(),
    mutationOptions: {
      retry: 2,
      retryDelay: 1000,
      ...options,
    },
  });
};

export default useAuthCheckTest;
