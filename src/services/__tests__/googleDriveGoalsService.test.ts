import {
  googleDriveGoalsService,
  encodeBase64,
  decodeBase64,
} from '../googleDriveGoalsService';
import { appStore } from '@store';

describe('GoogleDriveGoalsService', () => {
  let mockFetch: jest.Mock;
  let getOrCreateGrowboardFolderSpy: jest.SpyInstance;
  let getOrCreateGoalsFolderSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    // Set token in appStore directly
    appStore.setState({
      Auth: {
        ...appStore.getState().Auth,
        token: 'mock-token',
      },
    });

    getOrCreateGrowboardFolderSpy = jest
      .spyOn(googleDriveGoalsService as any, 'getOrCreateGrowboardFolder')
      .mockResolvedValue('growboard-folder-id');
    getOrCreateGoalsFolderSpy = jest
      .spyOn(googleDriveGoalsService as any, 'getOrCreateGoalsFolder')
      .mockResolvedValue('goals-folder-id');
  });

  afterEach(() => {
    getOrCreateGrowboardFolderSpy.mockRestore();
    getOrCreateGoalsFolderSpy.mockRestore();
  });

  describe('encodeBase64 & decodeBase64', () => {
    it('correctly encodes and decodes UTF-8 strings', () => {
      const original = 'Hello world! 🚀';
      const encoded = encodeBase64(original);
      const decoded = decodeBase64(encoded);
      expect(decoded).toBe(original);
    });
  });

  describe('readAllGoals', () => {
    it('returns goals list successfully', async () => {
      // 1st call: list files
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            files: [{ id: 'file-1', name: 'goal_1.json' }],
          }),
        })
        // 2nd call: fetch file content
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          text: async () =>
            JSON.stringify({
              title: 'Goal 1',
              status: 'pending',
            }),
        });

      const result = await googleDriveGoalsService.readAllGoals();
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Goal 1');
    });

    it('returns empty array on error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        clone: () => ({
          text: async () => 'Error',
        }),
      });

      const result = await googleDriveGoalsService.readAllGoals();
      expect(result).toEqual([]);
    });
  });

  describe('saveGoal', () => {
    it('updates file content if file already exists', async () => {
      // 1st call: search file
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            files: [{ id: 'file-1' }],
          }),
        })
        // 2nd call: upload PATCH media
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({}),
        });

      const goalInput = {
        title: 'Goal 1',
        subtitle: 'Sub',
        details: 'Details',
        status: 'started' as const,
        tags: [],
        timeline: [],
        updatedAt: '2026-07-02',
      };

      await expect(
        googleDriveGoalsService.saveGoal(goalInput),
      ).resolves.not.toThrow();
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch.mock.calls[1][1].method).toBe('PATCH');
    });

    it('creates new file if file does not exist', async () => {
      // 1st call: search file
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            files: [],
          }),
        })
        // 2nd call: upload POST multipart
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({}),
        });

      const goalInput = {
        title: 'Goal 1',
        subtitle: 'Sub',
        details: 'Details',
        status: 'started' as const,
        tags: [],
        timeline: [],
        updatedAt: '2026-07-02',
      };

      await expect(
        googleDriveGoalsService.saveGoal(goalInput),
      ).resolves.not.toThrow();
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch.mock.calls[1][1].method).toBe('POST');
    });
  });

  describe('deleteGoal', () => {
    it('deletes goal file if found', async () => {
      // 1st call: search file
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            files: [{ id: 'file-1' }],
          }),
        })
        // 2nd call: DELETE API
        .mockResolvedValueOnce({
          ok: true,
          status: 204,
        });

      await expect(
        googleDriveGoalsService.deleteGoal('Goal 1'),
      ).resolves.not.toThrow();
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch.mock.calls[1][1].method).toBe('DELETE');
    });

    it('does nothing if goal file not found', async () => {
      // 1st call: search file
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          files: [],
        }),
      });

      await expect(
        googleDriveGoalsService.deleteGoal('Goal 1'),
      ).resolves.not.toThrow();
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
