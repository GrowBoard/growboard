import { ExpenseDataPoint } from '@services/hooks/private';
import { groupBy } from 'lodash';

export const getExpenseDataSumForCategory = (
  expenseData: ExpenseDataPoint[] | undefined,
) => {
  if (!expenseData || expenseData.length === 0) {
    return {};
  }

  const groupedDataByCategory = groupBy(expenseData, 'category');

  const sumByCategory = Object.keys(groupedDataByCategory).reduce(
    (accumulator, category) => {
      const sum = groupedDataByCategory[category].reduce(
        (acc: number, curr: ExpenseDataPoint) => acc + curr.amount,
        0,
      );
      accumulator[category] = sum;
      return accumulator;
    },
    {} as Record<string, number>,
  );

  const totalSum = Object.values(sumByCategory).reduce(
    (acc, curr) => acc + curr,
    0,
  );

  return { sumByCategory, totalSum };
};

export const getExpenseDataForTable = (
  queryResponse:
    | {
        data: ExpenseDataPoint[];
        status: string;
        successMessage: string;
      }
    | undefined,
  month: number,
) => {
  if (
    !queryResponse ||
    !queryResponse.data ||
    queryResponse.data.length === 0
  ) {
    return [];
  }

  const expenseData = queryResponse.data;

  const daysInMonth = new Date(
    new Date().getFullYear(),
    month + 1,
    0,
  ).getDate();

  const groupedData = groupBy(expenseData, 'date_time');

  const dataToShow = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(new Date().getFullYear(), month, i + 1)
      .toISOString()
      .split('T')[0];
    return {
      date,
      data: groupedData[date] || [],
      sum: (groupedData[date] || []).reduce(
        (acc: number, curr: ExpenseDataPoint) => acc + curr.amount,
        0,
      ),
    };
  });

  return dataToShow;
};
