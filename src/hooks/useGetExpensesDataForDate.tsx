import { useShallow, dateSelector, overviewInputSelector } from '@selectors';
import { useGetExpensesData } from '@services/hooks/private';
import { appStore } from '@store';
import { useMemo } from 'react';

const useGetExpensesDataForDate = () => {
  const {
    dateState: { month, year: yearState },
  } = appStore(useShallow(overviewInputSelector));
  const dateRaw = appStore(useShallow(dateSelector));
  const date = useMemo(() => {
    return dateRaw instanceof Date ? dateRaw : new Date(dateRaw || Date.now());
  }, [dateRaw]);

  const { monthStartDate, monthEndDate } = useMemo(() => {
    const year = date.getFullYear();
    const monthStartDate = new Date(yearState ?? year, month, 2)
      .toISOString()
      .split('T')[0];
    const monthEndDate = new Date(yearState ?? year, month + 1, 1)
      .toISOString()
      .split('T')[0];
    return { monthStartDate, monthEndDate };
  }, [date, month, yearState]);

  return useGetExpensesData({
    start_date: monthStartDate,
    end_date: monthEndDate,
  });
};

export default useGetExpensesDataForDate;
