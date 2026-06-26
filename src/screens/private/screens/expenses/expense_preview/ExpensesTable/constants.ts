import { EXPENSE_TYPE_COLOR } from '../const';

export { EXPENSE_TYPE_COLOR };

export const MONTHS = Array.from({ length: 12 }, (_, i) =>
  new Date(2025, i).toLocaleString('default', { month: 'long' }),
);
