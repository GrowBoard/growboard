import { authCheckTest } from '@services/backend';
import { useCallQuery } from '@services/hooks/common';
import { UseQueryResult } from '@tanstack/react-query';

const useAuthCheckTest = (): UseQueryResult<{ status: string }, Error> => {
  return useCallQuery({
    method: () => authCheckTest(),
    queryOptions: {
      queryKey: ['authCheckTest'],
      staleTime: 1000 * 60 * 60 * 24,
    },
  });
};

export default useAuthCheckTest;
