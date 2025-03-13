import { pingTest } from '../../backend';
import { useCallQuery } from '../common';

const usePingTest = () => {
  return useCallQuery({
    method: () => pingTest(),
    queryOptions: {
      queryKey: ['ping'],
      refetchInterval: 600000,
    },
  });
};

export default usePingTest;
