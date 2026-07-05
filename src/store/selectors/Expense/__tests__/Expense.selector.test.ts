import { appStore } from '../../../store';
import {
  timeWindowSelector,
  setTimeWindowSelector,
  overviewInputSelector,
  dateSelector,
  addExpenseSelector,
  setAddExpenseSelector,
} from '../Expense.selector';
import { TimeWindow } from '../../../slice/Expense/types';

describe('Expense selectors', () => {
  const state = appStore.getState();

  it('timeWindowSelector returns the current time window', () => {
    const result = timeWindowSelector(state);
    expect(result).toBe(TimeWindow.MONTH);
  });

  it('setTimeWindowSelector returns the setTimeWindow action', () => {
    const result = setTimeWindowSelector(state);
    expect(typeof result).toBe('function');
  });

  it('overviewInputSelector returns dateState and setter callbacks', () => {
    const result = overviewInputSelector(state);
    expect(result).toHaveProperty('dateState');
    expect(typeof result.setOverviewInput).toBe('function');
    expect(typeof result.setOverviewInputWithDay).toBe('function');
  });

  it('dateSelector returns a Date object', () => {
    const result = dateSelector(state);
    expect(result).toBeInstanceOf(Date);
  });

  it('addExpenseSelector returns addExpense object', () => {
    const result = addExpenseSelector(state);
    expect(result).toHaveProperty('isOpen');
  });

  it('setAddExpenseSelector returns the setAddExpense action', () => {
    const result = setAddExpenseSelector(state);
    expect(typeof result).toBe('function');
  });
});
