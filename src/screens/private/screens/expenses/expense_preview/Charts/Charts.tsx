import { HStack } from '@chakra-ui/react';
import { PieChart, LineChart } from '@components';
import { appStore, TimeWindow } from '@store';
import {
  overviewInputSelector,
  timeWindowSelector,
  useShallow,
} from '@selectors';
import { ExpenseSummary } from './sub_components';
import { useGetExpensesDataForDate } from '@hooks';
import { groupBy } from 'lodash';
import { ExpenseType } from '../types';
import { EXPENSE_TYPE_COLOR } from '../ExpensesTable';
import { getIstDate } from '../../../../../../util/input/Input';
import { useMemo } from 'react';

const Charts = () => {
  const timeWindow = appStore(useShallow(timeWindowSelector));
  const {
    dateState: { year, month, day },
  } = appStore(useShallow(overviewInputSelector));
  const { data: queryResponse, isLoading } = useGetExpensesDataForDate();

  const monthEndDate = new Date(year, month, 1)
    .toISOString()
    .split('T')[0]
    .split('-')[2];

  const date = useMemo(() => {
    const newDate = new Date(year, month, day);
    return getIstDate({
      day: newDate.getDate(),
      month: newDate.getMonth(),
      year: newDate.getFullYear(),
    });
  }, [year, month, day]);
  if (isLoading) {
    return (
      <HStack w={'100%'} justifyContent={'center'}>
        Loading...
      </HStack>
    );
  }

  const data = queryResponse?.data;

  const groupedData = groupBy(data, 'date_time');

  const LINE_DAY_CHART_DATA = {
    datasets: [
      {
        data: Array.from(
          { length: parseInt(monthEndDate) },
          (_, i) => i + 1,
        ).map((index) => {
          const date = new Date(year, month, index + 2)
            .toISOString()
            .split('T')[0];

          return groupedData[date]?.reduce((acc, curr) => acc + curr.amount, 0);
        }),
        backgroundColor: '#1AAFA0',
      },
    ],
    labels: Array.from({ length: 30 }, (_, i) => i + 1),
  };

  const PIE_CHART_DATA = {
    datasets: [
      {
        data: Object.values(ExpenseType).map(
          (type) =>
            (timeWindow === TimeWindow.DAY ? groupedData[date] : data)?.reduce(
              (acc, curr) => (curr.category === type ? acc + curr.amount : acc),
              0,
            ) ?? 0,
        ),
        backgroundColor: Object.values(EXPENSE_TYPE_COLOR),
      },
    ],
    labels: Object.values(ExpenseType),
  };

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
        data={LINE_DAY_CHART_DATA}
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
