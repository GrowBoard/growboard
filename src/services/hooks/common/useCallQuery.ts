import { useQuery } from '@tanstack/react-query';
import { useCallSBQueryArgs } from './types';

/**
 * Hook for calling a query.
 * @param method - The method to get called once.
 * @param mutationOptions - The options for the mutation.
 * @returns useQuery result.
 */
const useCallQuery = <TRequest extends object, TResponse extends object>({
  method,
  queryOptions,
}: useCallSBQueryArgs<TResponse, TRequest>) =>
  useQuery({
    ...queryOptions,
    queryFn: (request) => method(request),
  });

export default useCallQuery;
