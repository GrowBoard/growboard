export const isValidAmount = (amount: string): boolean => {
  return !!amount && Number(amount) > 0;
};
