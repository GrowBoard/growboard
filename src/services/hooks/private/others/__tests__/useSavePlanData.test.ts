import { renderHook } from '@testing-library/react';
import useSavePlanData from '../useSavePlanData';
import { googleSheetsPlanService } from '../../../../googleSheets/GoogleSheetsPlanService';

// Mock react-query
const mockInvalidateQueries = jest.fn();
const mockMutationFnExec = jest.fn();
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(() => ({
    invalidateQueries: mockInvalidateQueries,
  })),
  useMutation: jest.fn((options) => {
    if (options && typeof options.mutationFn === 'function') {
      mockMutationFnExec(options.mutationFn);
    }
    if (options && typeof options.onSuccess === 'function') {
      options.onSuccess();
    }
    return { mutate: jest.fn(), mutateAsync: jest.fn() };
  }),
}));

// Mock GoogleSheetsPlanService
jest.mock('../../../../googleSheets/GoogleSheetsPlanService', () => ({
  googleSheetsPlanService: {
    updatePlan: jest.fn(),
    addPlan: jest.fn(),
  },
}));

describe('useSavePlanData hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls updatePlan when Id is present', () => {
    renderHook(() => useSavePlanData());

    const mutationFn = mockMutationFnExec.mock.calls[0][0];
    const planWithId = { Id: 'p-123', title: 'Plan A' };
    mutationFn(planWithId);

    expect(googleSheetsPlanService.updatePlan).toHaveBeenCalledWith('p-123', planWithId);
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['sheetPlans'] });
  });

  it('calls addPlan when Id is not present', () => {
    renderHook(() => useSavePlanData());

    const mutationFn = mockMutationFnExec.mock.calls[0][0];
    const planWithoutId = { title: 'Plan B' };
    mutationFn(planWithoutId);

    expect(googleSheetsPlanService.addPlan).toHaveBeenCalledWith(planWithoutId);
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['sheetPlans'] });
  });
});
