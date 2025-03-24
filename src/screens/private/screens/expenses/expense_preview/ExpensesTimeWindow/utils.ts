import { appStore, TimeWindow } from '@store';
import { join } from 'lodash';

export const getWindowString = (
  window: TimeWindow,
  date: {
    day: number;
    month: number;
    year: number;
  },
): string => {
  const { day, month, year } = date;
  switch (window) {
    case TimeWindow.DAY:
      return join(
        [
          day.toString(),
          new Date(year, month).toLocaleString('default', { month: 'long' }),
          year,
        ],
        ' ',
      );
    case TimeWindow.MONTH:
      return join(
        [
          new Date(year, month).toLocaleString('default', { month: 'long' }),
          year,
        ],
        ' ',
      );
    case TimeWindow.YEAR:
      return year.toString();
    default: {
      const _exhaustiveCheck: never = window;
      return _exhaustiveCheck;
    }
  }
};

export const getPrevDate = (
  timeWindow: TimeWindow,
  prev: {
    day: number;
    month: number;
    year: number;
  },
) => {
  switch (timeWindow) {
    case TimeWindow.DAY:
      if (prev.day === 1) {
        if (prev.month === 1) {
          return {
            day: 31,
            month: 12,
            year: prev.year - 1,
          };
        } else {
          return {
            day: new Date(prev.year, prev.month - 1, 0).getDate(),
            month: prev.month - 1,
            year: prev.year,
          };
        }
      } else {
        return {
          day: prev.day - 1,
          month: prev.month,
          year: prev.year,
        };
      }
    case TimeWindow.MONTH:
      return prev.month === 1
        ? {
            day: prev.day,
            month: 12,
            year: prev.year - 1,
          }
        : {
            day: prev.day,
            month: prev.month - 1,
            year: prev.year,
          };
    case TimeWindow.YEAR:
      return {
        day: prev.day,
        month: prev.month,
        year: prev.year - 1,
      };
    default: {
      const exhaust: never = timeWindow;
      return exhaust;
    }
  }
};

export const getNextDate = (
  timeWindow: TimeWindow,
  prev: {
    day: number;
    month: number;
    year: number;
  },
) => {
  switch (timeWindow) {
    case TimeWindow.DAY:
      if (prev.day === new Date(prev.year, prev.month, 0).getDate()) {
        if (prev.month === 12) {
          return {
            day: 1,
            month: 1,
            year: prev.year + 1,
          };
        } else {
          return {
            day: 1,
            month: prev.month + 1,
            year: prev.year,
          };
        }
      } else {
        return {
          day: prev.day + 1,
          month: prev.month,
          year: prev.year,
        };
      }
    case TimeWindow.MONTH:
      return prev.month === 12
        ? {
            day: prev.day,
            month: 1,
            year: prev.year + 1,
          }
        : {
            day: prev.day,
            month: prev.month + 1,
            year: prev.year,
          };
    case TimeWindow.YEAR:
      return {
        day: prev.day,
        month: prev.month,
        year: prev.year + 1,
      };
    default: {
      const exhaust: never = timeWindow;
      return exhaust;
    }
  }
};

export const getStartAndEndDate = (
  timeWindow: TimeWindow,
  dateData: {
    day: number;
    month: number;
    year: number;
  },
) => {
  const { day, month: monthIndex, year } = dateData;
  const month = monthIndex + 1;
  const date = appStore.getState().Expense.date;
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1;
  const currentDay = date.getDate();
  const dayInMonth = new Date(year, month + 1, 0).getDate();
  switch (timeWindow) {
    case TimeWindow.DAY:
      return {
        startDate: `${year}-${month.toString().padStart(2, '0')}-01`,
        endDate:
          currentDay === day
            ? `${year}-${month.toString().padStart(2, '0')}-${currentDay}`
            : `${year}-${month.toString().padStart(2, '0')}-${currentDay}`,
      };
    case TimeWindow.MONTH:
      return {
        startDate: `${year}-${month.toString().padStart(2, '0')}-01`,
        endDate:
          currentMonth === month
            ? `${year}-${month.toString().padStart(2, '0')}-${currentDay}`
            : `${year}-${month.toString().padStart(2, '0')}-${dayInMonth}`,
      };
    case TimeWindow.YEAR:
      return {
        startDate: `${year}-01-01`,
        endDate:
          currentYear === year
            ? `${year}-${month.toString().padStart(2, '0')}-${currentDay}`
            : `${year}-12-31`,
      };
    default: {
      const exhaust: never = timeWindow;
      return exhaust;
    }
  }
};
