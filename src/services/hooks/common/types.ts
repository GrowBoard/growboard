import {
  MutationFunction,
  QueryFunction,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';

export type useCallSBMutationArgs<
  TRequest extends object,
  TResponse extends object,
> = {
  method: MutationFunction<TResponse, TRequest>;
  mutationOptions?: Omit<
    UseMutationOptions<TResponse, Error, TRequest>,
    'mutationFn'
  >;
};

export type useCallSBQueryArgs<
  TRequest extends object,
  TResponse extends object,
> = {
  method: QueryFunction<TResponse>;
  queryOptions: Omit<UseQueryOptions<TResponse, Error, TRequest>, 'queryFn'>;
};
