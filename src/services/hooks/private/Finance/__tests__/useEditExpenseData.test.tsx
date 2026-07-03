import { renderHook } from '@testing-library/react';
import useEditExpenseData from '../useEditExpenseData';
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
    updateExpense: jest.fn(),
  },
}));

describe('useEditExpenseData hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sets up mutation and triggers correct callbacks', async () => {
    renderHook(() => useEditExpenseData());

    const options = mockMutationExec.mock.calls[0][0];

    // 1. Test method function
    const methodData = { id: 'e1', amount: 300 } as any;
    options.method(methodData);
    expect(googleSheetsExpenseService.updateExpense).toHaveBeenCalledWith(methodData);

    // 2. Test onSuccess callback
    options.mutationOptions.onSuccess();
    expect(mockSuccessToast).toHaveBeenCalledWith('Updated expense successfully.');
    expect(mockInvalidateQueries).toHaveBeenCalled();

    // 3. Test onError callback
    options.mutationOptions.onError(new Error('Update error'));
    expect(mockErrorToast).toHaveBeenCalledWith('Update error');

    // Test onError fallback message
    options.mutationOptions.onError({});
    expect(mockErrorToast).toHaveBeenCalledWith('Failed to update expense');
  });
});
