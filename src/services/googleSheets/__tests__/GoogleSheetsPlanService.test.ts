import { googleSheetsPlanService } from '../GoogleSheetsPlanService';
import { getValidAccessToken, triggerSilentRefresh } from '@services/auth';

jest.mock('@services/auth', () => ({
  getValidAccessToken: jest.fn(),
  triggerSilentRefresh: jest.fn(),
}));

jest.mock('../util', () => ({
  loadCache: jest.fn(() => ({})),
  saveCache: jest.fn(),
}));

describe('GoogleSheetsPlanService', () => {
  let mockFetch: jest.Mock;
  let getSpreadsheetDetailsSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    (getValidAccessToken as jest.Mock).mockReturnValue('mock-token');

    // Spy and mock getSpreadsheetDetails to avoid mocking multiple setup/create folder API calls
    getSpreadsheetDetailsSpy = jest
      .spyOn(googleSheetsPlanService as any, 'getSpreadsheetDetails')
      .mockResolvedValue({
        spreadsheetId: 'plans-spreadsheet-id',
        sheetTitle: 'Sheet1',
      });
  });

  afterEach(() => {
    getSpreadsheetDetailsSpy.mockRestore();
  });

  describe('getPlans', () => {
    it('returns formatted plans on success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          values: [
            [
              'plan-1',
              'Title 1',
              'Subtitle 1',
              '2026-07-02',
              '12:00',
              'tag1, tag2',
              'About 1',
            ],
          ],
        }),
      });

      const response = await googleSheetsPlanService.getPlans();
      expect(response.status).toBe('SUCCESS');
      expect(response.data).toHaveLength(1);
      expect(response.data[0]).toEqual({
        Id: 'plan-1',
        title: 'Title 1',
        subtitle: 'Subtitle 1',
        date: '2026-07-02',
        time: '12:00',
        tags: ['tag1', 'tag2'],
        about_plan: 'About 1',
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

      const response = await googleSheetsPlanService.getPlans();
      expect(response.status).toBe('ERROR');
      expect(response.data).toEqual([]);
      expect(response.successMessage).toContain('Google API Error (500)');
    });
  });

  describe('addPlan', () => {
    it('appends and returns new plan', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      const planInput = {
        title: 'New Plan',
        subtitle: 'Sub',
        date: '2026-07-03',
        time: '14:00',
        tags: ['tag3'],
        about_plan: 'About',
      };

      const result = await googleSheetsPlanService.addPlan(planInput);
      expect(result.title).toBe(planInput.title);
      expect(result.subtitle).toBe(planInput.subtitle);
      expect(result.Id).toBeDefined();
    });
  });

  describe('updatePlan', () => {
    it('updates plan when ID matches', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            values: [['plan-1', 'Title 1', 'Subtitle 1']],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({}),
        });

      const planInput = {
        title: 'Updated Plan',
        subtitle: 'Updated Sub',
        date: '2026-07-03',
        time: '14:00',
        tags: ['tag3'],
        about_plan: 'Updated About',
      };

      const result = await googleSheetsPlanService.updatePlan(
        'plan-1',
        planInput,
      );
      expect(result.Id).toBe('plan-1');
      expect(result.title).toBe(planInput.title);
    });

    it('throws error when ID not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          values: [['plan-1', 'Title 1']],
        }),
      });

      await expect(
        googleSheetsPlanService.updatePlan('plan-not-exist', {
          title: 'Title',
          subtitle: '',
          date: '',
          time: '',
          tags: [],
          about_plan: '',
        }),
      ).rejects.toThrow('Plan with ID plan-not-exist not found.');
    });
  });

  describe('deletePlan', () => {
    it('deletes plan when ID matches', async () => {
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
            values: [['plan-1', 'Title 1']],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({}),
        });

      const result = await googleSheetsPlanService.deletePlan('plan-1');
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
            values: [['plan-1', 'Title 1']],
          }),
        });

      await expect(
        googleSheetsPlanService.deletePlan('plan-not-exist'),
      ).rejects.toThrow('Plan with ID plan-not-exist not found in sheet.');
    });
  });

  describe('Authentication Retries - failure path', () => {
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

      const response = await googleSheetsPlanService.getPlans();
      expect(response.status).toBe('ERROR');
      expect(response.successMessage).toContain('Authentication');
    });

    it('throws when 403 is returned on retry', async () => {
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
            json: async () => ({ error: { message: 'Forbidden again' } }),
          }),
        });

      const response = await googleSheetsPlanService.getPlans();
      expect(response.status).toBe('ERROR');
      expect(response.successMessage).toContain('Authentication');
    });

    it('falls back to text when JSON parse fails on error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        clone: () => ({
          json: async () => {
            throw new Error('not json');
          },
        }),
        text: async () => 'plain error text',
      });

      // Need a second clone for the text fallback
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        clone: () => ({
          json: async () => {
            throw new Error('not json');
          },
          text: async () => 'plain error text',
        }),
      });

      const response = await googleSheetsPlanService.getPlans();
      expect(response.status).toBe('ERROR');
    });
  });

  describe('getPlans - edge cases', () => {
    it('returns empty plans array when values is undefined', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      const response = await googleSheetsPlanService.getPlans();
      expect(response.status).toBe('SUCCESS');
      expect(response.data).toHaveLength(0);
    });

    it('returns empty plans array when values is empty', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ values: [] }),
      });

      const response = await googleSheetsPlanService.getPlans();
      expect(response.status).toBe('SUCCESS');
      expect(response.data).toHaveLength(0);
    });

    it('handles tags being undefined (no tags column)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          values: [['plan-2', 'Title 2', 'Sub 2', '2026-07-04', '10:00']],
        }),
      });

      const response = await googleSheetsPlanService.getPlans();
      expect(response.status).toBe('SUCCESS');
      expect(response.data[0].tags).toEqual([]);
    });
  });
});
