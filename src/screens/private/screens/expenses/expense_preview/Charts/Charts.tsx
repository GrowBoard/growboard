import { HStack } from '@chakra-ui/react';
import { PieChart, LineChart } from '@components';
import { appStore, TimeWindow } from '@store';
import {
  overviewInputSelector,
  timeWindowSelector,
  useShallow,
} from '@selectors';
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
    const newDate = new Date(year, month, day + 1);
    return getIstDate({
      day: newDate.getDate(),
      month: newDate.getMonth(),
      year: newDate.getFullYear(),
    });
  }, [year, month, day]);

  const data = queryResponse?.data;
  const groupedData = useMemo(() => groupBy(data, 'date_time'), [data]);
  const daysInMonthCount = parseInt(monthEndDate, 10);

  // Calculate high-fidelity insights to show in the Doughnut card
  const EXPENSES_BY_CATEGORY = useMemo(() => {
    return Object.values(ExpenseType).reduce(
      (acc, category) => ({
        ...acc,
        [category]:
          (timeWindow === TimeWindow.DAY ? groupedData[date] : data)?.reduce(
            (sum: number, curr: any) =>
              curr.category === category ? sum + curr.amount : sum,
            0,
          ) ?? 0,
      }),
      {} as Record<ExpenseType, number>,
    );
  }, [data, groupedData, date, timeWindow]);

  const totalTransactions = data?.length ?? 0;

  const highestCategory = useMemo(() => {
    if (!EXPENSES_BY_CATEGORY) return null;
    let maxCat = '';
    let maxAmt = 0;
    Object.entries(EXPENSES_BY_CATEGORY).forEach(([cat, amt]) => {
      if (amt > maxAmt) {
        maxAmt = amt;
        maxCat = cat;
      }
    });
    if (maxAmt === 0) return null;
    return {
      name: maxCat,
      amount: maxAmt,
      color: EXPENSE_TYPE_COLOR[maxCat as ExpenseType] || '#A0AEC0',
    };
  }, [EXPENSES_BY_CATEGORY]);

  const dailyAverage = useMemo(() => {
    if (!data || data.length === 0) return 0;
    const total = data.reduce((acc: number, curr: any) => acc + curr.amount, 0);
    return total / daysInMonthCount;
  }, [data, daysInMonthCount]);

  const LINE_DAY_CHART_DATA = useMemo(() => {
    return {
      datasets: [
        {
          label: 'Daily Spend',
          data: Array.from({ length: daysInMonthCount }, (_, i) => i + 1).map(
            (index) => {
              const dateStr = new Date(year, month, index + 1)
                .toISOString()
                .split('T')[0];

              return (
                groupedData[dateStr]?.reduce(
                  (acc: number, curr: any) => acc + curr.amount,
                  0,
                ) ?? 0
              );
            },
          ),
          backgroundColor: '#1AAFA0',
        },
      ],
      labels: Array.from({ length: daysInMonthCount }, (_, i) => {
        const d = new Date(year, month, i + 2);
        return d.toISOString().split('T')[0];
      }),
    };
  }, [daysInMonthCount, year, month, groupedData]);

  const PIE_CHART_DATA = useMemo(() => {
    return {
      datasets: [
        {
          data: Object.values(ExpenseType).map(
            (type) =>
              (timeWindow === TimeWindow.DAY
                ? groupedData[date]
                : data
              )?.reduce(
                (acc: number, curr: any) =>
                  curr.category === type ? acc + curr.amount : acc,
                0,
              ) ?? 0,
          ),
          backgroundColor: Object.values(EXPENSE_TYPE_COLOR),
        },
      ],
      labels: Object.values(ExpenseType),
    };
  }, [data, groupedData, date, timeWindow]);

  if (isLoading) {
    return (
      <HStack w={'100%'} justifyContent={'center'}>
        Loading...
      </HStack>
    );
  }

  return (
    <HStack
      w={'100%'}
      h={{ base: 'auto', lg: '320px' }}
      alignItems={'stretch'}
      bg="bg.glass"
      backdropFilter="blur(24px)"
      borderRadius={'xl'}
      border={'1px solid'}
      borderColor="border.subtle"
      p={4}
      shadow={'2xl'}
      flexDirection={{ base: 'column', lg: 'row' }}
      gap={4}
    >
      <PieChart
        data={PIE_CHART_DATA}
        width={{ base: '100%', lg: '45%' }}
        height={'100%'}
        totalTransactions={totalTransactions}
        highestCategory={highestCategory}
        dailyAverage={dailyAverage}
      />
      <LineChart
        data={LINE_DAY_CHART_DATA}
        width={{ base: '100%', lg: '55%' }}
        height={'100%'}
        timeWindow={timeWindow}
      />
    </HStack>
  );
};

export default Charts;
