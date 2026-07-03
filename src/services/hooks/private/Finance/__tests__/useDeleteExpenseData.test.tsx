import { renderHook } from '@testing-library/react';
import useDeleteExpenseData from '../useDeleteExpenseData';
import { googleSheetsExpenseService } from '@services/googleSheets';

// Mock common hooks
const mockMutationExec = jest.fn();
jest.mock('../../../common', () => ({
  useCallSBMutation: jest.fn((options) => {
    mockMutationExec(options);
    return { mutate: jest.fn(), mutateAsync: jest.fn() };
  }),
}));

const mockSuccessToast = jest.fn();
const mockErrorToast = jest.fn();
jest.mock('@components', () => ({
  useSuccessToast: () => mockSuccessToast,
  useErrorToast: () => mockErrorToast,
}));

const mockInvalidateQueries = jest.fn();
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

// Mock googleSheetsExpenseService
jest.mock('@services/googleSheets', () => ({
  googleSheetsExpenseService: {
    deleteExpense: jest.fn(),
  },
}));

describe('useDeleteExpenseData hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sets up mutation and triggers correct callbacks', async () => {
    renderHook(() => useDeleteExpenseData());

    const options = mockMutationExec.mock.calls[0][0];

    // 1. Test method function
    const methodData = { expenseId: 'e1', dateStr: '2026-07-02' };
    const res = await options.method(methodData);
    expect(googleSheetsExpenseService.deleteExpense).toHaveBeenCalledWith('e1', '2026-07-02');
    expect(res).toEqual({ success: true });

    // 2. Test onSuccess callback
    options.mutationOptions.onSuccess();
    expect(mockSuccessToast).toHaveBeenCalledWith('Deleted expense successfully.');
    expect(mockInvalidateQueries).toHaveBeenCalled();

    // 3. Test onError callback
    options.mutationOptions.onError(new Error('Quota limit'));
    expect(mockErrorToast).toHaveBeenCalledWith('Quota limit');

    // Test onError fallback message
    options.mutationOptions.onError({});
    expect(mockErrorToast).toHaveBeenCalledWith('Failed to delete expense');
  });
});
