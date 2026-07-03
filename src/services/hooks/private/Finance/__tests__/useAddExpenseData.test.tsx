import { renderHook } from '@testing-library/react';
import useAddExpenseData from '../useAddExpenseData';
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
    addExpense: jest.fn(),
  },
}));

describe('useAddExpenseData hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sets up mutation and triggers correct callbacks', async () => {
    renderHook(() => useAddExpenseData());

    const options = mockMutationExec.mock.calls[0][0];

    // 1. Test method function
    const methodData = { amount: 500, category: 'Food' as any, date_time: '2026-07-02', comment: 'Dinner' };
    options.method(methodData);
    expect(googleSheetsExpenseService.addExpense).toHaveBeenCalledWith(methodData);

    // 2. Test onSuccess callback
    options.mutationOptions.onSuccess();
    expect(mockSuccessToast).toHaveBeenCalledWith('Added expense successfully.');
    expect(mockInvalidateQueries).toHaveBeenCalled();

    // 3. Test onError callback
    options.mutationOptions.onError(new Error('Drive Offline'));
    expect(mockErrorToast).toHaveBeenCalledWith('Drive Offline');

    // Test onError fallback message
    options.mutationOptions.onError({});
    expect(mockErrorToast).toHaveBeenCalledWith('Failed to add expense');
  });
});
