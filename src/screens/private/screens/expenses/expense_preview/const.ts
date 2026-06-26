import { ExpenseType } from './types';

export const EXPENSE_TYPE_COLOR: Record<ExpenseType, string> = {
  [ExpenseType.Food]: '#1AF0CF',
  [ExpenseType.Rent]: '#66CCFF',
  [ExpenseType.Travel]: '#FFCC66',
  [ExpenseType.Shopping]: '#CCC6FF',
  [ExpenseType.Studies]: '#FFA699',
  [ExpenseType.Snack]: '#66FF0F',
  [ExpenseType.Extras]: '#FFFF66',
  [ExpenseType.Family]: '#66FFCC',
  [ExpenseType.Misc]: '#FFB6CC',
};
