import { googleSheetsResourceService } from '../GoogleSheetsResourceService';
import { getValidAccessToken, triggerSilentRefresh } from '@services/auth';

jest.mock('@services/auth', () => ({
  getValidAccessToken: jest.fn(),
  triggerSilentRefresh: jest.fn(),
}));

jest.mock('../util', () => ({
  loadCache: jest.fn(() => ({})),
  saveCache: jest.fn(),
}));

describe('GoogleSheetsResourceService', () => {
  let mockFetch: jest.Mock;
  let getSpreadsheetDetailsSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    (getValidAccessToken as jest.Mock).mockReturnValue('mock-token');

    getSpreadsheetDetailsSpy = jest
      .spyOn(googleSheetsResourceService as any, 'getSpreadsheetDetails')
      .mockResolvedValue({
        spreadsheetId: 'resources-spreadsheet-id',
        sheetTitle: 'Sheet1',
      });
  });

  afterEach(() => {
    getSpreadsheetDetailsSpy.mockRestore();
  });

  describe('getResources', () => {
    it('returns formatted resources on success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          values: [
            [
              'res-1',
              'Title 1',
              'Subtitle 1',
              'http://link',
              'tag1, tag2',
              'About 1',
            ],
          ],
        }),
      });

      const response = await googleSheetsResourceService.getResources();
      expect(response.status).toBe('SUCCESS');
      expect(response.data).toHaveLength(1);
      expect(response.data[0]).toEqual({
        Id: 'res-1',
        title: 'Title 1',
        subtitle: 'Subtitle 1',
        link: 'http://link',
        tags: ['tag1', 'tag2'],
        about_resource: 'About 1',
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

      const response = await googleSheetsResourceService.getResources();
      expect(response.status).toBe('ERROR');
      expect(response.data).toEqual([]);
      expect(response.successMessage).toContain('Google API Error (500)');
    });
  });

  describe('addResource', () => {
    it('appends and returns new resource', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      const resourceInput = {
        title: 'New Res',
        subtitle: 'Sub',
        link: 'http://link',
        tags: ['tag3'],
        about_resource: 'About',
      };

      const result =
        await googleSheetsResourceService.addResource(resourceInput);
      expect(result.title).toBe(resourceInput.title);
      expect(result.Id).toBeDefined();
    });
  });

  describe('deleteResource', () => {
    it('deletes resource when ID matches', async () => {
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
            values: [['res-1', 'Title 1']],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({}),
        });

      const result = await googleSheetsResourceService.deleteResource('res-1');
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
            values: [['res-1', 'Title 1']],
          }),
        });

      await expect(
        googleSheetsResourceService.deleteResource('res-not-exist'),
      ).rejects.toThrow('Resource with ID res-not-exist not found in sheet.');
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
            values: [['res-1', 'Title 1']],
          }),
        });

      const response = await googleSheetsResourceService.getResources();
      expect(response.status).toBe('SUCCESS');
      expect(triggerSilentRefresh).toHaveBeenCalledTimes(1);
    });

    it('throws when silent refresh fails on 401', async () => {
      (triggerSilentRefresh as jest.Mock).mockRejectedValueOnce(
        new Error('Refresh failed'),
      );

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        clone: () => ({
          text: async () => 'Unauthorized',
        }),
      });

      const response = await googleSheetsResourceService.getResources();
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

      const response = await googleSheetsResourceService.getResources();
      expect(response.status).toBe('ERROR');
      expect(response.successMessage).toContain('Authentication');
    });

    it('falls back to no-detail when both json and text fail', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        clone: () => ({
          json: async () => {
            throw new Error('not json');
          },
          text: async () => {
            throw new Error('not text');
          },
        }),
      });

      const response = await googleSheetsResourceService.getResources();
      expect(response.status).toBe('ERROR');
    });
  });

  describe('getResources - edge cases', () => {
    it('returns empty array when values is undefined', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      const response = await googleSheetsResourceService.getResources();
      expect(response.status).toBe('SUCCESS');
      expect(response.data).toHaveLength(0);
    });

    it('returns empty array when values is empty', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ values: [] }),
      });

      const response = await googleSheetsResourceService.getResources();
      expect(response.status).toBe('SUCCESS');
      expect(response.data).toHaveLength(0);
    });
  });
});
