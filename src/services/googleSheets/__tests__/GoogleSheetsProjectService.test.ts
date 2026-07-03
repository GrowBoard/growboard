import { googleSheetsProjectService } from '../GoogleSheetsProjectService';
import { getValidAccessToken, triggerSilentRefresh } from '@services/auth';

jest.mock('@services/auth', () => ({
  getValidAccessToken: jest.fn(),
  triggerSilentRefresh: jest.fn(),
}));

jest.mock('../util', () => ({
  loadCache: jest.fn(() => ({})),
  saveCache: jest.fn(),
}));

describe('GoogleSheetsProjectService', () => {
  let mockFetch: jest.Mock;
  let getSpreadsheetDetailsSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    (getValidAccessToken as jest.Mock).mockReturnValue('mock-token');

    getSpreadsheetDetailsSpy = jest
      .spyOn(googleSheetsProjectService as any, 'getSpreadsheetDetails')
      .mockResolvedValue({
        spreadsheetId: 'projects-spreadsheet-id',
        sheetTitle: 'Sheet1',
      });
  });

  afterEach(() => {
    getSpreadsheetDetailsSpy.mockRestore();
  });

  describe('getProjects', () => {
    it('returns formatted projects on success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          values: [
            [
              'proj-1',
              'Title 1',
              'Subtitle 1',
              'http://link',
              'tag1, tag2',
              'About 1',
              'Remark 1',
              'Owner 1',
              'started',
            ],
          ],
        }),
      });

      const response = await googleSheetsProjectService.getProjects();
      expect(response.status).toBe('SUCCESS');
      expect(response.data).toHaveLength(1);
      expect(response.data[0]).toEqual({
        Id: 'proj-1',
        title: 'Title 1',
        subtitle: 'Subtitle 1',
        link: 'http://link',
        tags: ['tag1', 'tag2'],
        about_project: 'About 1',
        remark: 'Remark 1',
        owner: 'Owner 1',
        status: 'started',
      });
    });

    it('returns error response when API fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        clone: () => ({
          json: async () => ({ error: { message: 'Internal Server Error' } }),
        }),
      });

      const response = await googleSheetsProjectService.getProjects();
      expect(response.status).toBe('ERROR');
      expect(response.data).toEqual([]);
      expect(response.successMessage).toContain('Google API Error (500)');
    });
  });

  describe('addProject', () => {
    it('appends and returns new project', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      const projectInput = {
        title: 'New Proj',
        subtitle: 'Sub',
        link: 'http://link',
        tags: ['tag3'],
        about_project: 'About',
        remark: 'Remark',
        owner: 'Owner',
        status: 'pending' as const,
      };

      const result = await googleSheetsProjectService.addProject(projectInput);
      expect(result.title).toBe(projectInput.title);
      expect(result.Id).toBeDefined();
    });
  });

  describe('updateProject', () => {
    it('updates project when ID matches', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            values: [['proj-1', 'Title 1']],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({}),
        });

      const projectInput = {
        title: 'Updated Proj',
        subtitle: 'Updated Sub',
        link: 'http://link',
        tags: ['tag3'],
        about_project: 'Updated About',
        remark: 'Updated Remark',
        owner: 'Updated Owner',
        status: 'done' as const,
      };

      const result = await googleSheetsProjectService.updateProject(
        'proj-1',
        projectInput,
      );
      expect(result.Id).toBe('proj-1');
      expect(result.title).toBe(projectInput.title);
    });

    it('throws error when ID not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          values: [['proj-1', 'Title 1']],
        }),
      });

      await expect(
        googleSheetsProjectService.updateProject('proj-not-exist', {
          title: 'Title',
          subtitle: '',
          link: '',
          tags: [],
          about_project: '',
          remark: '',
          owner: '',
          status: 'pending',
        }),
      ).rejects.toThrow('Project with ID proj-not-exist not found.');
    });
  });

  describe('deleteProject', () => {
    it('deletes project when ID matches', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            sheets: [{ properties: { sheetId: 12345 } }],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            values: [['proj-1', 'Title 1']],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({}),
        });

      const result = await googleSheetsProjectService.deleteProject('proj-1');
      expect(result).toBe(true);
    });

    it('throws error when ID not found in sheet', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            sheets: [{ properties: { sheetId: 12345 } }],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            values: [['proj-1', 'Title 1']],
          }),
        });

      await expect(
        googleSheetsProjectService.deleteProject('proj-not-exist'),
      ).rejects.toThrow('Project with ID proj-not-exist not found in sheet.');
    });
  });

  describe('Authentication Retries', () => {
    it('retries once on 401 and succeeds', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          clone: () => ({
            text: async () => 'Unauthorized',
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            values: [['proj-1', 'Title 1']],
          }),
        });

      const response = await googleSheetsProjectService.getProjects();
      expect(response.status).toBe('SUCCESS');
      expect(triggerSilentRefresh).toHaveBeenCalledTimes(1);
    });

    it('throws when silent refresh fails on 401', async () => {
      (triggerSilentRefresh as jest.Mock).mockRejectedValueOnce(new Error('Refresh failed'));

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        clone: () => ({
          text: async () => 'Unauthorized',
        }),
      });

      const response = await googleSheetsProjectService.getProjects();
      expect(response.status).toBe('ERROR');
      expect(response.successMessage).toContain('Authentication');
    });

    it('throws on 403 retry', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 403,
          clone: () => ({
            json: async () => ({ error: { message: 'Forbidden' } }),
          }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 403,
          clone: () => ({
            json: async () => ({ error: { message: 'Still Forbidden' } }),
          }),
        });

      const response = await googleSheetsProjectService.getProjects();
      expect(response.status).toBe('ERROR');
      expect(response.successMessage).toContain('Authentication');
    });

    it('falls back to no-detail when both json and text fail', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        clone: () => ({
          json: async () => { throw new Error('not json'); },
          text: async () => { throw new Error('not text'); },
        }),
      });

      const response = await googleSheetsProjectService.getProjects();
      expect(response.status).toBe('ERROR');
    });
  });

  describe('getProjects - edge cases', () => {
    it('returns empty array when values is undefined', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      const response = await googleSheetsProjectService.getProjects();
      expect(response.status).toBe('SUCCESS');
      expect(response.data).toHaveLength(0);
    });

    it('returns empty array when values is empty', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ values: [] }),
      });

      const response = await googleSheetsProjectService.getProjects();
      expect(response.status).toBe('SUCCESS');
      expect(response.data).toHaveLength(0);
    });

    it('handles missing tags column gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          values: [['proj-2', 'Title 2', 'Sub 2', 'http://link2']],
        }),
      });

      const response = await googleSheetsProjectService.getProjects();
      expect(response.status).toBe('SUCCESS');
      expect(response.data[0].tags).toEqual([]);
    });
  });
});
