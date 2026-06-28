import { loadCache, saveCache } from '../util';
import { CACHE_KEY } from '../const';

describe('googleSheets/util', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  // ── loadCache ──────────────────────────────────────────────────────────────

  describe('loadCache', () => {
    it('returns the default empty cache when localStorage is empty', () => {
      const cache = loadCache();
      expect(cache).toEqual({ spreadsheetIds: {}, sheetIds: {} });
    });

    it('returns the parsed cache when valid JSON is stored', () => {
      const stored = {
        growboardFolderId: 'folder-123',
        expensesFolderId: 'expenses-456',
        spreadsheetIds: { '2024': 'sheet-abc' },
        sheetIds: { 'sheet-abc': { January: 0 } },
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(stored));
      expect(loadCache()).toEqual(stored);
    });

    it('returns the default cache when stored JSON is malformed', () => {
      localStorage.setItem(CACHE_KEY, 'not-valid-json{{{');
      const cache = loadCache();
      expect(cache).toEqual({ spreadsheetIds: {}, sheetIds: {} });
    });

    it('returns the default cache when the key is missing', () => {
      expect(loadCache()).toEqual({ spreadsheetIds: {}, sheetIds: {} });
    });
  });

  // ── saveCache ──────────────────────────────────────────────────────────────

  describe('saveCache', () => {
    it('writes the cache to localStorage under the correct key', () => {
      const cache = {
        spreadsheetIds: { '2024': 'id-abc' },
        sheetIds: {},
      };
      saveCache(cache);
      const stored = localStorage.getItem(CACHE_KEY);
      expect(stored).toBe(JSON.stringify(cache));
    });

    it('overwrites an existing cache entry', () => {
      saveCache({ spreadsheetIds: { '2023': 'old' }, sheetIds: {} });
      saveCache({ spreadsheetIds: { '2024': 'new' }, sheetIds: {} });
      const stored = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      expect(stored.spreadsheetIds).toEqual({ '2024': 'new' });
    });

    it('does not throw when localStorage.setItem fails', () => {
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() =>
        saveCache({ spreadsheetIds: {}, sheetIds: {} }),
      ).not.toThrow();
    });
  });
});
