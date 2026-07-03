import { appStore } from '../../../store';
import { act } from '@testing-library/react';
import { TimeWindow } from '../types';

describe('Expense slice', () => {
  it('should have initial state config', () => {
    const state = appStore.getState().Expense;
    expect(state.overview.timeWindow).toBe(TimeWindow.MONTH);
    expect(state.addExpense.isOpen).toBe(false);
  });

  it('should set time window successfully', () => {
    act(() => {
      appStore.getState().Expense.setTimeWindow(TimeWindow.DAY);
    });
    expect(appStore.getState().Expense.overview.timeWindow).toBe(
      TimeWindow.DAY,
    );
  });

  it('should set addExpense successfully', () => {
    act(() => {
      appStore
        .getState()
        .Expense.setAddExpense(true, 'Add', '2026-07-02', 'id-123');
    });
    const state = appStore.getState().Expense.addExpense;
    expect(state.isOpen).toBe(true);
    expect(state.type).toBe('Add');
    expect(state.date).toBe('2026-07-02');
    expect(state.expenseId).toBe('id-123');
  });

  it('should set overview input successfully', () => {
    act(() => {
      appStore.getState().Expense.setOverviewInput({ month: 5, year: 2027 });
    });
    const state = appStore.getState().Expense.overview;
    expect(state.month).toBe(5);
    expect(state.year).toBe(2027);
  });

  it('should set overview input with day successfully', () => {
    act(() => {
      appStore
        .getState()
        .Expense.setOverviewInputWithDay({ day: 15, month: 10, year: 2028 });
    });
    const state = appStore.getState().Expense.overview;
    expect(state.day).toBe(15);
    expect(state.month).toBe(10);
    expect(state.year).toBe(2028);
  });
});
