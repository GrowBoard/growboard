import { googleSheetsHabitsService } from '../GoogleSheetsHabitsService';
import { getValidAccessToken } from '@services/auth';

jest.mock('@services/auth', () => ({
  getValidAccessToken: jest.fn(),
  triggerSilentRefresh: jest.fn(),
}));

jest.mock('../util', () => ({
  loadCache: jest.fn(() => ({})),
  saveCache: jest.fn(),
}));

describe('GoogleSheetsHabitsService', () => {
  let mockFetch: jest.Mock;
  let getSpreadsheetIdSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    (getValidAccessToken as jest.Mock).mockReturnValue('mock-token');

    // Mock getSpreadsheetId to avoid mocking setup/creation of folder structure
    getSpreadsheetIdSpy = jest
      .spyOn(googleSheetsHabitsService as any, 'getSpreadsheetId')
      .mockResolvedValue('mock-habits-spreadsheet-id');
  });

  afterEach(() => {
    getSpreadsheetIdSpy.mockRestore();
  });

  describe('getHabits', () => {
    it('returns habit definitions on success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          values: [
            [
              'h-1',
              'Morning Meditation',
              '2026-07-01',
              '',
              '100',
              '2026-07-01T00:00:00Z',
              '1,3,5',
            ],
          ],
        }),
      });

      const response = await googleSheetsHabitsService.getHabits();
      expect(response).toHaveLength(1);
      expect(response[0]).toEqual({
        id: 'h-1',
        name: 'Morning Meditation',
        startDate: '2026-07-01',
        endDate: '',
        targetPercentage: 100,
        createdAt: '2026-07-01T00:00:00Z',
        days: [1, 3, 5],
      });
    });

    it('returns empty array when API fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        clone: () => ({
          json: async () => ({ error: { message: 'Failed' } }),
        }),
      });

      const response = await googleSheetsHabitsService.getHabits();
      expect(response).toEqual([]);
    });
  });

  describe('addHabit', () => {
    it('appends and returns new habit item', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      const habitInput = {
        name: 'Yoga',
        startDate: '2026-07-01',
        endDate: '',
        targetPercentage: 80,
        createdAt: '2026-07-01T00:00:00Z',
      };

      const result = await googleSheetsHabitsService.addHabit(habitInput);
      expect(result.name).toBe('Yoga');
      expect(result.targetPercentage).toBe(80);
      expect(result.id).toBeDefined();
    });
  });

  describe('getLogs', () => {
    it('returns habit logs on success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          values: [
            [
              'log-1',
              'h-1',
              '2026-07-05',
              'TRUE',
              'felt great',
              '2026-07-05T08:00:00Z',
            ],
          ],
        }),
      });

      const result = await googleSheetsHabitsService.getLogs();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'log-1',
        habitId: 'h-1',
        date: '2026-07-05',
        completed: true,
        note: 'felt great',
        loggedAt: '2026-07-05T08:00:00Z',
      });
    });
  });

  describe('upsertLog', () => {
    it('appends new log if habit+date combination does not exist', async () => {
      // First fetch: check if row exists (A:C)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          values: [['id', 'habitId', 'date']], // Header row only
        }),
      });

      // Second fetch: append new row
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      const logInput = {
        habitId: 'h-1',
        date: '2026-07-05',
        completed: true,
        note: 'feeling fresh',
        loggedAt: '2026-07-05T08:00:00Z',
      };

      const result = await googleSheetsHabitsService.upsertLog(logInput);
      expect(result.id).toBeDefined();
      expect(result.habitId).toBe('h-1');
      expect(result.completed).toBe(true);
    });

    it('updates existing log row if habit+date combination exists', async () => {
      // First fetch: check if row exists (A:C)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          values: [
            ['id', 'habitId', 'date'],
            ['existing-log-id', 'h-1', '2026-07-05'],
          ],
        }),
      });

      // Second fetch: update row
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      const logInput = {
        habitId: 'h-1',
        date: '2026-07-05',
        completed: false, // Update to false
        note: 'updated note',
        loggedAt: '2026-07-05T09:00:00Z',
      };

      const result = await googleSheetsHabitsService.upsertLog(logInput);
      expect(result.id).toBe('existing-log-id');
      expect(result.completed).toBe(false);
      expect(result.note).toBe('updated note');
    });
  });
});
