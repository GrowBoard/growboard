import { ExpenseDataPoint } from '@services/hooks/private';
import { groupBy } from 'lodash';
import { ExpenseType } from '../types';

export const getExpenseDataSumForCategory = (
  expenseData: ExpenseDataPoint[] | undefined,
) => {
  if (!expenseData || expenseData.length === 0) {
    return {};
  }

  const groupedDataByCategory = groupBy(expenseData, 'category');

  const sumByCategory = Object.values(ExpenseType)?.reduce(
    (accumulator, category) => {
      const sum =
        groupedDataByCategory[category]?.reduce(
          (acc: number, curr: ExpenseDataPoint) => acc + curr.amount,
          0,
        ) ?? 0;
      accumulator[category] = sum;
      return accumulator;
    },
    {} as Record<string, number>,
  );

  console.log(sumByCategory);

  const totalSum = Object.values(sumByCategory).reduce((acc, expense) => {
    acc += expense;
    return acc;
  }, 0);

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
  if (!queryResponse || !queryResponse.data) {
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
    const date = new Date(new Date().getFullYear(), month, i + 2)
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
