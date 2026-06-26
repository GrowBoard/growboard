import { getExpenseDataSumForCategory } from './ExpensesTable/utils';

export const getIsCurrentMonth = (
  month: number,
  yearState: number,
): boolean => {
  const todayObj = new Date();
  return todayObj.getFullYear() === yearState && todayObj.getMonth() === month;
};

export const getSelectedMonthName = (
  month: number,
  yearState: number,
): string => {
  const d = new Date(yearState, month, 1);
  return d.toLocaleString('default', { month: 'long' });
};

export const getTodayRowData = (dataToShow: any[], today: string): any => {
  const found = dataToShow.find((row) => row.date === today);
  return (
    found || {
      date: today,
      data: [],
      sum: 0,
    }
  );
};

export const calculateStats = (
  isLoading: boolean,
  queryResponse: any,
  month: number,
  yearState: number,
  totalSum: number | null,
) => {
  if (isLoading || !queryResponse?.data) {
    return { totalTransactions: 0, highestCategory: null, dailyAverage: 0 };
  }
  const data = queryResponse.data;
  const totalTransactions = data.length;

  const { sumByCategory: monthlySumByCategory } =
    getExpenseDataSumForCategory(data);
  let maxCat = '';
  let maxAmt = 0;
  Object.entries(monthlySumByCategory || {}).forEach(([cat, amt]) => {
    if (amt > maxAmt) {
      maxAmt = amt;
      maxCat = cat;
    }
  });

  const highestCategory = maxAmt > 0 ? { name: maxCat, amount: maxAmt } : null;

  const daysInMonth = new Date(yearState, month + 1, 0).getDate();
  const dailyAverage = (totalSum ?? 0) / daysInMonth;

  return { totalTransactions, highestCategory, dailyAverage };
};
