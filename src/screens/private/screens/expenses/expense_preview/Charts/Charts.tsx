import { HStack } from '@chakra-ui/react';
import {
  PieChart,
  PIE_CHART_DATA,
  LINE_DAY_CHART_DATA,
  LineChart,
  LINE_MONTH_CHART_DATA,
} from '@components';
import { appStore, TimeWindow } from '@store';
import { timeWindowSelector, useShallow } from '@selectors';
import { ExpenseSummary } from './sub_components';

const Charts = () => {
  const timeWindow = appStore(useShallow(timeWindowSelector));
  return (
    <HStack
      w={'100%'}
      alignItems={'start'}
      paddingX={2}
      borderRadius={10}
      p={3}
      shadow={'0px 0px 10px rgba(0, 0, 0, 0.25)'}
    >
      <LineChart
        data={
          timeWindow === TimeWindow.MONTH
            ? LINE_DAY_CHART_DATA
            : LINE_MONTH_CHART_DATA
        }
        width={'58%'}
        height={'100%'}
        timeWindow={timeWindow}
      />
      <PieChart data={PIE_CHART_DATA} width={'30%'} height={'100%'} />
      <ExpenseSummary />
    </HStack>
  );
};

export default Charts;
