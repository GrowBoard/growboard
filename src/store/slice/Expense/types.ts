export enum TimeWindow {
  DAY = 'Day',
  // WEEK = 'week',
  MONTH = 'Month',
  YEAR = 'Year',
}

export type ExpenseDataState = {
  timeWindow: TimeWindow;
  date: Date;
};

export interface ExpenseStateActions {
  setTimeWindow: (timeWindow: TimeWindow) => void;
}

export type ExpenseStateSlice = ExpenseDataState & ExpenseStateActions;
