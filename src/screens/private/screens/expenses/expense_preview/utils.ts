import { TimeWindow } from './types';

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
