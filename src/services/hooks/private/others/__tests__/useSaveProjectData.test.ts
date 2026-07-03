import { renderHook } from '@testing-library/react';
import useSaveProjectData from '../useSaveProjectData';
import { googleSheetsProjectService } from '../../../../googleSheets/GoogleSheetsProjectService';

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

// Mock googleSheetsProjectService
jest.mock('../../../../googleSheets/GoogleSheetsProjectService', () => ({
  googleSheetsProjectService: {
    updateProject: jest.fn(),
    addProject: jest.fn(),
  },
}));

describe('useSaveProjectData hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls updateProject when Id is present', () => {
    renderHook(() => useSaveProjectData());

    const mutationFn = mockMutationFnExec.mock.calls[0][0];
    const projectWithId = { Id: 'proj-123', title: 'Project A' };
    mutationFn(projectWithId);

    expect(googleSheetsProjectService.updateProject).toHaveBeenCalledWith('proj-123', projectWithId);
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['sheetProjects'] });
  });

  it('calls addProject when Id is not present', () => {
    renderHook(() => useSaveProjectData());

    const mutationFn = mockMutationFnExec.mock.calls[0][0];
    const projectWithoutId = { title: 'Project B' };
    mutationFn(projectWithoutId);

    expect(googleSheetsProjectService.addProject).toHaveBeenCalledWith(projectWithoutId);
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['sheetProjects'] });
  });
});
