import { TimeWindow } from '@store';
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
            month: 11,
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
      return prev.month === 0
        ? {
            day: prev.day,
            month: 11,
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
      return prev.month === 11
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

export const getDateFromState = (
  timeWindow: TimeWindow,
  dateData: {
    day: number;
    month: number;
    year: number;
  },
) => {
  const { month: monthIndex, year, day } = dateData;
  const month = monthIndex + 1;
  switch (timeWindow) {
    case TimeWindow.DAY:
      return {
        startDate: `${year}-${month.toString().padStart(2, '0')}-${day}`,
      };
    case TimeWindow.MONTH:
      return {
        startDate: `${year}-${month.toString().padStart(2, '0')}-01`,
      };
    case TimeWindow.YEAR:
      return {
        startDate: `${year}-01-01`,
      };
    default: {
      const exhaust: never = timeWindow;
      return exhaust;
    }
  }
};
