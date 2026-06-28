import { GoogleCache } from './types';
import { CACHE_KEY } from './const';

/**
 * Loads the Google Sheets cache from localStorage.
 * @returns Parsed cache object, or an empty default if none exists.
 */
export const loadCache = (): GoogleCache => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      return JSON.parse(raw) as GoogleCache;
    }
  } catch (e) {
    console.error('Failed to load Google Sheets cache:', e);
  }
  return { spreadsheetIds: {}, sheetIds: {} };
};

/**
 * Persists the Google Sheets cache to localStorage.
 * @param cache - The cache object to save.
 */
export const saveCache = (cache: GoogleCache): void => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Failed to save Google Sheets cache:', e);
  }
};
