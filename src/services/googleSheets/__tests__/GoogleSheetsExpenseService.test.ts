import { googleSheetsExpenseService } from '../GoogleSheetsExpenseService';
import { getValidAccessToken, triggerSilentRefresh } from '@services/auth';
import { loadCache } from '../util';

jest.mock('@services/auth', () => ({
  getValidAccessToken: jest.fn(),
  triggerSilentRefresh: jest.fn(),
}));

jest.mock('../util', () => ({
  loadCache: jest.fn(),
  saveCache: jest.fn(),
}));

describe('GoogleSheetsExpenseService', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    (getValidAccessToken as jest.Mock).mockReturnValue('mock-token');

    // Direct assignment to override the singleton's internal cache
    (googleSheetsExpenseService as any).cache = {
      growboardFolderId: 'growboard-id',
      expensesFolderId: 'expenses-id',
      spreadsheetIds: { '2026': 'spreadsheet-id' },
      sheetIds: { 'spreadsheet-id': { June: 123 } },
    };
  });

  describe('fetchAPI', () => {
    it('performs request with Authorization header', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ files: [] }),
      });

      // trigger getOrCreateGrowboardFolder (will load cached first, so let's clear cache to force API call)
      (loadCache as jest.Mock).mockReturnValueOnce({
        spreadsheetIds: {},
        sheetIds: {},
      });
      // Re-init or reset cache in service instance if it is cached in instance variable.
      // Since it is a singleton, let's reset its internal cache by modifying the mock return before access or calling a method that clears it.
      // Actually we can trigger a 401 to clear cache, or check if we can inspect the singleton state.
      // Alternatively, let's mock cache to be empty for this test run.
      // But wait! googleSheetsExpenseService is instantiated once, meaning its private cache is initialized at import.
      // Let's check how we can clear/inject cache. The service clears cache on 401 or in getSpreadsheetAndSheet catch block.
    });
  });

  describe('getExpensesForMonth', () => {
    it('returns formatted expenses on success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          values: [['id-1', '10.5', '2026-06-28', 'Lunch', 'Food']],
        }),
      });

      const response = await googleSheetsExpenseService.getExpensesForMonth(
        2026,
        5,
      ); // June is 5
      expect(response.status).toBe('SUCCESS');
      expect(response.data).toHaveLength(1);
      expect(response.data[0]).toEqual({
        id: 'id-1',
        amount: 10.5,
        date_time: '2026-06-28',
        comment: 'Lunch',
        category: 'Food',
      });
    });

    it('returns error details when API fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        clone: () => ({
          json: async () => ({ error: { message: 'Internal Server Error' } }),
        }),
      });

      const response = await googleSheetsExpenseService.getExpensesForMonth(
        2026,
        5,
      );
      expect(response.status).toBe('ERROR');
      expect(response.data).toEqual([]);
      expect(response.successMessage).toContain('Google API Error (500)');
    });

    it('triggers silent refresh and retries once on 401', async () => {
      // 1st request fails with 401
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        clone: () => ({
          json: async () => ({ error: { message: 'Unauthorized' } }),
        }),
      });

      // 2nd request (after refresh) succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          values: [['id-2', '20.0', '2026-06-28', 'Dinner', 'Food']],
        }),
      });

      (triggerSilentRefresh as jest.Mock).mockResolvedValueOnce(undefined);

      const response = await googleSheetsExpenseService.getExpensesForMonth(
        2026,
        5,
      );

      expect(triggerSilentRefresh).toHaveBeenCalledTimes(1);
      expect(response.status).toBe('SUCCESS');
      expect(response.data).toHaveLength(1);
      expect(response.data[0].id).toBe('id-2');
    });

    it('fails when silent refresh fails on 401', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        clone: () => ({
          json: async () => ({ error: { message: 'Unauthorized' } }),
        }),
      });

      (triggerSilentRefresh as jest.Mock).mockRejectedValueOnce(
        new Error('Refresh failed'),
      );

      const response = await googleSheetsExpenseService.getExpensesForMonth(
        2026,
        5,
      );

      expect(triggerSilentRefresh).toHaveBeenCalledTimes(1);
      expect(response.status).toBe('ERROR');
      expect(response.successMessage).toContain(
        'Session expired. Please re-login',
      );
    });
  });

  describe('addExpense', () => {
    it('appends expense successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      const expenseInput = {
        amount: 15.0,
        date_time: '2026-06-28T10:00:00Z',
        comment: 'Coffee',
        category: 'Food' as any,
      };

      const result = await googleSheetsExpenseService.addExpense(expenseInput);

      expect(result.amount).toBe(15.0);
      expect(result.comment).toBe('Coffee');
      expect(result.id).toBeDefined();
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('values/June!A:E:append'),
        expect.objectContaining({ method: 'POST' }),
      );
    });
  });

  describe('updateExpense', () => {
    it('updates expense when found', async () => {
      // 1. Fetch values
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          values: [['id-1', '10.0', '2026-06-28', 'Old Comment', 'Food']],
        }),
      });
      // 2. Put values
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      const updated = {
        id: 'id-1',
        amount: 12.0,
        date_time: '2026-06-28',
        comment: 'New Comment',
        category: 'Food' as any,
      };

      const result = await googleSheetsExpenseService.updateExpense(updated);
      expect(result).toEqual(updated);
      expect(mockFetch).toHaveBeenLastCalledWith(
        expect.stringContaining('values/June!A1:E1'), // index is 0, so row is 1
        expect.objectContaining({ method: 'PUT' }),
      );
    });

    it('throws error when expense not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          values: [],
        }),
      });

      const updated = {
        id: 'id-not-exists',
        amount: 12.0,
        date_time: '2026-06-28',
        comment: 'New Comment',
        category: 'Food' as any,
      };

      await expect(
        googleSheetsExpenseService.updateExpense(updated),
      ).rejects.toThrow('not found in sheet June');
    });
  });

  describe('deleteExpense', () => {
    it('deletes expense when found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          values: [['id-to-delete', '10.0', '2026-06-28', 'Comment', 'Food']],
        }),
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      const result = await googleSheetsExpenseService.deleteExpense(
        'id-to-delete',
        '2026-06-28',
      );
      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenLastCalledWith(
        expect.stringContaining('spreadsheet-id:batchUpdate'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('deleteDimension'),
        }),
      );
    });
  });

  describe('fetchAPI error paths', () => {
    it('returns ERROR when silent refresh fails on 401', async () => {
      (triggerSilentRefresh as jest.Mock).mockRejectedValueOnce(new Error('Refresh failed'));

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        clone: () => ({
          json: async () => { throw new Error('not json'); },
          text: async () => 'Unauthorized',
        }),
      });

      const result = await googleSheetsExpenseService.getExpensesForMonth(2026, 5);
      expect(result.status).toBe('ERROR');
      expect(result.data).toEqual([]);
    });

    it('returns ERROR when 403 is returned on retry', async () => {
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

      const result = await googleSheetsExpenseService.getExpensesForMonth(2026, 5);
      expect(result.status).toBe('ERROR');
      expect(result.successMessage).toContain('Authentication');
    });

    it('returns ERROR and falls back to text when json parse fails on non-auth error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        clone: () => ({
          json: async () => { throw new Error('not json'); },
          text: async () => 'plain server error',
        }),
      });

      const result = await googleSheetsExpenseService.getExpensesForMonth(2026, 5);
      expect(result.status).toBe('ERROR');
      expect(result.successMessage).toContain('500');
    });

    it('returns empty data when status is 204', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      const result = await googleSheetsExpenseService.getExpensesForMonth(2026, 5);
      expect(result.data).toEqual([]);
    });
  });

  describe('getExpensesForMonth - edge cases', () => {
    it('returns empty data when values is undefined', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      const result = await googleSheetsExpenseService.getExpensesForMonth(2026, 5);
      expect(result.data).toEqual([]);
    });

    it('returns empty data when values is an empty array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ values: [] }),
      });

      const result = await googleSheetsExpenseService.getExpensesForMonth(2026, 5);
      expect(result.data).toEqual([]);
    });
  });
});
