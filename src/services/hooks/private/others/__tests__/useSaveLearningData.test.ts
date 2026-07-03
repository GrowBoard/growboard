import { renderHook } from '@testing-library/react';
import useSaveLearningData from '../useSaveLearningData';
import { googleDriveLearningsService } from '../../../../googleDriveLearningsService';

// Mock react-query
const mockInvalidateQueries = jest.fn();
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(() => ({
    invalidateQueries: mockInvalidateQueries,
  })),
  useMutation: jest.fn((options) => {
    if (options && typeof options.mutationFn === 'function') {
      options.mutationFn({ learning: 'mock-learning', originalTitle: 'old-title' });
    }
    if (options && typeof options.onSuccess === 'function') {
      options.onSuccess();
    }
    return { mutate: jest.fn(), mutateAsync: jest.fn() };
  }),
}));

// Mock googleDriveLearningsService
jest.mock('../../../../googleDriveLearningsService', () => ({
  googleDriveLearningsService: {
    saveLearning: jest.fn(),
  },
}));

describe('useSaveLearningData hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls saveLearning and invalidates driveLearnings query on success', () => {
    renderHook(() => useSaveLearningData());

    expect(googleDriveLearningsService.saveLearning).toHaveBeenCalledWith('mock-learning', 'old-title');
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['driveLearnings'] });
  });
});
