import { renderHook, waitFor } from '@testing-library/react';
import { useMutation } from '@tanstack/react-query';
import { appStore } from '@store';

// Import hooks
import useGetCredsData from '../useGetCredsData';
import useGetGoalsData from '../useGetGoalsData';
import useGetLearningsData from '../useGetLearningsData';
import useGetPlansData from '../useGetPlansData';
import useGetProfileData from '../useGetProfileData';
import useGetProjectsData from '../useGetProjectsData';
import useGetResourcesData from '../useGetResourcesData';

import useDeleteGoalData from '../useDeleteGoalData';
import useDeleteLearningData from '../useDeleteLearningData';
import useDeletePlanData from '../useDeletePlanData';
import useDeleteProjectData from '../useDeleteProjectData';
import useDeleteResourceData from '../useDeleteResourceData';

import useSaveGoalData from '../useSaveGoalData';
import useSaveResourceData from '../useSaveResourceData';
import useSaveCredsData from '../useSaveCredsData';
import useSaveProfileData from '../useSaveProfileData';

// Import services to verify calls
import { googleDriveCredsService } from '../../../../googleDriveCredsService';
import { googleDriveGoalsService } from '../../../../googleDriveGoalsService';
import { googleDriveLearningsService } from '../../../../googleDriveLearningsService';
import { googleSheetsPlanService } from '../../../../googleSheets/GoogleSheetsPlanService';
import { googleDriveProfileService } from '../../../../googleDriveProfileService';
import { googleSheetsProjectService } from '../../../../googleSheets/GoogleSheetsProjectService';
import { googleSheetsResourceService } from '../../../../googleSheets/GoogleSheetsResourceService';

// Mock Services
jest.mock('../../../../googleDriveCredsService', () => ({
  googleDriveCredsService: {
    readCreds: jest.fn(() => Promise.resolve(['creds'])),
    saveCreds: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('../../../../googleDriveGoalsService', () => ({
  googleDriveGoalsService: {
    readAllGoals: jest.fn(() => Promise.resolve(['goal'])),
    saveGoal: jest.fn(() => Promise.resolve()),
    deleteGoal: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('../../../../googleDriveLearningsService', () => ({
  googleDriveLearningsService: {
    readAllLearnings: jest.fn(() => Promise.resolve(['learning'])),
    deleteLearning: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('../../../../googleSheets/GoogleSheetsPlanService', () => ({
  googleSheetsPlanService: {
    getPlans: jest.fn(() => Promise.resolve({ data: ['plan'] })),
    deletePlan: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('../../../../googleDriveProfileService', () => ({
  googleDriveProfileService: {
    readProfile: jest.fn(() => Promise.resolve({ name: 'User' })),
    saveProfile: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('../../../../googleSheets/GoogleSheetsProjectService', () => ({
  googleSheetsProjectService: {
    getProjects: jest.fn(() => Promise.resolve({ data: ['project'] })),
    deleteProject: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('../../../../googleSheets/GoogleSheetsResourceService', () => ({
  googleSheetsResourceService: {
    getResources: jest.fn(() => Promise.resolve({ data: ['resource'] })),
    addResource: jest.fn(() => Promise.resolve()),
    updateResource: jest.fn(() => Promise.resolve()),
    deleteResource: jest.fn(() => Promise.resolve()),
  },
}));

// Mock react-query
const mockInvalidateQueries = jest.fn();
const mockSetQueryData = jest.fn();
const mockMutationFnExec = jest.fn();
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(() => ({
    invalidateQueries: mockInvalidateQueries,
    setQueryData: mockSetQueryData,
  })),
  useQuery: jest.fn((options) => {
    // Run queryFn to cover
    if (options && typeof options.queryFn === 'function') {
      options.queryFn();
    }
    const key = options?.queryKey?.[0];
    if (
      key === 'sheetPlans' ||
      key === 'sheetProjects' ||
      key === 'sheetResources'
    ) {
      return { data: { data: 'mock-query-data' } };
    }
    return { data: 'mock-query-data' };
  }),
  useMutation: jest.fn((options) => {
    if (options && typeof options.mutationFn === 'function') {
      mockMutationFnExec(options.mutationFn);
    }
    if (options && typeof options.onSuccess === 'function') {
      options.onSuccess('mock-res', 'mock-vars', 'mock-ctx');
    }
    return { mutate: jest.fn(), mutateAsync: jest.fn() };
  }),
}));

describe('Consolidated Simple Get/Save/Delete Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Get Hooks', () => {
    it('useGetCredsData reads creds and syncs', async () => {
      const updateCredsMock = jest.fn();
      appStore.setState({
        Creds: {
          ...appStore.getState().Creds,
          credsData: [],
          updateCreds: updateCredsMock,
        },
      });

      renderHook(() => useGetCredsData());
      expect(googleDriveCredsService.readCreds).toHaveBeenCalled();
      await waitFor(() => {
        expect(updateCredsMock).toHaveBeenCalledWith('mock-query-data');
      });
    });

    it('useGetGoalsData reads goals and syncs', async () => {
      const updateGoalsMock = jest.fn();
      appStore.setState({
        Goals: {
          ...appStore.getState().Goals,
          goalsData: [],
          updateGoals: updateGoalsMock,
        },
      });

      renderHook(() => useGetGoalsData());
      expect(googleDriveGoalsService.readAllGoals).toHaveBeenCalled();
      await waitFor(() => {
        expect(updateGoalsMock).toHaveBeenCalledWith(['goal']);
      });
    });

    it('useGetLearningsData reads learnings and syncs', async () => {
      const updateLearningsMock = jest.fn();
      appStore.setState({
        Learnings: {
          ...appStore.getState().Learnings,
          learningsData: [],
          updateLearnings: updateLearningsMock,
        },
      });

      renderHook(() => useGetLearningsData());
      expect(googleDriveLearningsService.readAllLearnings).toHaveBeenCalled();
      await waitFor(() => {
        expect(updateLearningsMock).toHaveBeenCalledWith(['learning']);
      });
    });

    it('useGetPlansData reads plans and syncs', async () => {
      const updatePlansMock = jest.fn();
      appStore.setState({
        Plans: {
          ...appStore.getState().Plans,
          plansData: [],
          updatePlans: updatePlansMock,
        },
      });

      renderHook(() => useGetPlansData());
      expect(googleSheetsPlanService.getPlans).toHaveBeenCalled();
      await waitFor(() => {
        expect(updatePlansMock).toHaveBeenCalledWith(['plan']);
      });
    });

    it('useGetProfileData reads profile and syncs', async () => {
      const updateProfileMock = jest.fn();
      appStore.setState({
        Profile: {
          ...appStore.getState().Profile,
          profileData: null as any,
          updateProfile: updateProfileMock,
        },
      });

      renderHook(() => useGetProfileData());
      expect(googleDriveProfileService.readProfile).toHaveBeenCalled();
      await waitFor(() => {
        expect(updateProfileMock).toHaveBeenCalledWith('mock-query-data');
      });
    });

    it('useGetProjectsData reads projects and syncs', async () => {
      const addProjectsMock = jest.fn();
      appStore.setState({
        Projects: {
          ...appStore.getState().Projects,
          projectData: [],
          addProjects: addProjectsMock,
        },
      });

      renderHook(() => useGetProjectsData());
      expect(googleSheetsProjectService.getProjects).toHaveBeenCalled();
      await waitFor(() => {
        expect(addProjectsMock).toHaveBeenCalledWith(['project']);
      });
    });

    it('useGetResourcesData reads resources and syncs', async () => {
      const updateResourcesMock = jest.fn();
      appStore.setState({
        Resources: {
          ...appStore.getState().Resources,
          resourcesData: [],
          updateResources: updateResourcesMock,
        },
      });

      renderHook(() => useGetResourcesData());
      expect(googleSheetsResourceService.getResources).toHaveBeenCalled();
      await waitFor(() => {
        expect(updateResourcesMock).toHaveBeenCalledWith(['resource']);
      });
    });
  });

  describe('Delete Hooks', () => {
    it('useDeleteGoalData calls deleteGoal and invalidates', () => {
      renderHook(() => useDeleteGoalData());
      const mutationFn =
        mockMutationFnExec.mock.calls[
          mockMutationFnExec.mock.calls.length - 1
        ][0];
      mutationFn('Goal A');
      expect(googleDriveGoalsService.deleteGoal).toHaveBeenCalledWith('Goal A');
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['driveGoals'],
      });
    });

    it('useDeleteLearningData calls deleteLearning and invalidates', () => {
      renderHook(() => useDeleteLearningData());
      const mutationFn =
        mockMutationFnExec.mock.calls[
          mockMutationFnExec.mock.calls.length - 1
        ][0];
      mutationFn('Learning A');
      expect(googleDriveLearningsService.deleteLearning).toHaveBeenCalledWith(
        'Learning A',
      );
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['driveLearnings'],
      });
    });

    it('useDeletePlanData calls deletePlan and invalidates', () => {
      renderHook(() => useDeletePlanData());
      const mutationFn =
        mockMutationFnExec.mock.calls[
          mockMutationFnExec.mock.calls.length - 1
        ][0];
      mutationFn('Plan A');
      expect(googleSheetsPlanService.deletePlan).toHaveBeenCalledWith('Plan A');
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['sheetPlans'],
      });
    });

    it('useDeleteProjectData calls deleteProject and invalidates', () => {
      renderHook(() => useDeleteProjectData());
      const mutationFn =
        mockMutationFnExec.mock.calls[
          mockMutationFnExec.mock.calls.length - 1
        ][0];
      mutationFn('Proj A');
      expect(googleSheetsProjectService.deleteProject).toHaveBeenCalledWith(
        'Proj A',
      );
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['sheetProjects'],
      });
    });

    it('useDeleteResourceData calls deleteResource and invalidates', () => {
      renderHook(() => useDeleteResourceData());
      const mutationFn =
        mockMutationFnExec.mock.calls[
          mockMutationFnExec.mock.calls.length - 1
        ][0];
      mutationFn('Res A');
      expect(googleSheetsResourceService.deleteResource).toHaveBeenCalledWith(
        'Res A',
      );
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['sheetResources'],
      });
    });
  });

  describe('Save Hooks', () => {
    it('useSaveGoalData calls saveGoal and invalidates', () => {
      renderHook(() => useSaveGoalData());
      const mutationFn =
        mockMutationFnExec.mock.calls[
          mockMutationFnExec.mock.calls.length - 1
        ][0];
      mutationFn('goal-item');
      expect(googleDriveGoalsService.saveGoal).toHaveBeenCalledWith(
        'goal-item',
      );
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['driveGoals'],
      });
    });

    it('useSaveResourceData calls addResource and invalidates', () => {
      renderHook(() => useSaveResourceData());
      const mutationFn =
        mockMutationFnExec.mock.calls[
          mockMutationFnExec.mock.calls.length - 1
        ][0];
      mutationFn({ title: 'Res B' });
      expect(googleSheetsResourceService.addResource).toHaveBeenCalledWith({
        title: 'Res B',
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['sheetResources'],
      });
    });

    it('useSaveCredsData calls saveCreds and invalidates', () => {
      const updateCredsMock = jest.fn();
      appStore.setState({
        Creds: {
          ...appStore.getState().Creds,
          updateCreds: updateCredsMock,
        },
      });

      renderHook(() => useSaveCredsData());
      const mutationFn =
        mockMutationFnExec.mock.calls[
          mockMutationFnExec.mock.calls.length - 1
        ][0];
      mutationFn(['creds']);
      expect(googleDriveCredsService.saveCreds).toHaveBeenCalledWith(['creds']);

      // trigger onSuccess callback simulation
      const onSuccess = (useMutation as jest.Mock).mock.calls[
        (useMutation as jest.Mock).mock.calls.length - 1
      ][0].onSuccess;
      onSuccess(null, ['new-creds']);

      expect(updateCredsMock).toHaveBeenCalledWith(['new-creds']);
      expect(mockSetQueryData).toHaveBeenCalledWith(
        ['driveCreds'],
        ['new-creds'],
      );
    });

    it('useSaveProfileData calls saveProfile and invalidates', () => {
      const updateProfileMock = jest.fn();
      appStore.setState({
        Profile: {
          ...appStore.getState().Profile,
          updateProfile: updateProfileMock,
        },
      });

      renderHook(() => useSaveProfileData());
      const mutationFn =
        mockMutationFnExec.mock.calls[
          mockMutationFnExec.mock.calls.length - 1
        ][0];
      const profile = { name: 'New Name' } as any;
      mutationFn(profile);
      expect(googleDriveProfileService.saveProfile).toHaveBeenCalledWith(
        profile,
      );

      // trigger onSuccess callback simulation
      const onSuccess = (useMutation as jest.Mock).mock.calls[
        (useMutation as jest.Mock).mock.calls.length - 1
      ][0].onSuccess;
      onSuccess(null, profile);

      expect(updateProfileMock).toHaveBeenCalledWith(profile);
      expect(mockSetQueryData).toHaveBeenCalledWith(['driveProfile'], profile);
    });
  });
});
