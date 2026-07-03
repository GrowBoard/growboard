import { appStore, GoalItem } from '@store';

interface GoogleCache {
  growboardFolderId?: string;
  expensesFolderId?: string;
  spreadsheetIds?: Record<string, string>;
  sheetIds?: Record<string, Record<string, number>>;
  profileFileId?: string;
  credsFolderId?: string;
  credsFileId?: string;
  goalsFolderId?: string;
}

const CACHE_KEY = 'growboard_google_sheets_cache';

/**
 * Loads the Google cache configuration from local storage.
 *
 * @returns The cached configuration.
 */
const loadCache = (): GoogleCache => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load Google Sheets cache:', e);
  }
  return { spreadsheetIds: {}, sheetIds: {} };
};

/**
 * Saves the Google cache configuration to local storage.
 *
 * @param cache The GoogleCache object to persist.
 */
const saveCache = (cache: GoogleCache) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Failed to save Google Sheets cache:', e);
  }
};

/**
 * Encodes a string to base64 safely handling UTF-8 characters.
 *
 * @param str The string to encode.
 * @returns The base64 encoded string.
 */
export const encodeBase64 = (str: string): string => {
  return btoa(unescape(encodeURIComponent(str)));
};

/**
 * Decodes a base64 string safely handling UTF-8 characters.
 *
 * @param b64 The base64 string to decode.
 * @returns The decoded string.
 */
export const decodeBase64 = (b64: string): string => {
  return decodeURIComponent(escape(atob(b64.trim())));
};

/**
 * GoogleDriveGoalsService Class.
 * Coordinates all direct read/write API actions targeting the Goals files in Google Drive.
 */
class GoogleDriveGoalsService {
  private cache: GoogleCache = loadCache();

  /**
   * Retrieves the current Google authentication access token from the store.
   *
   * @returns The access token string.
   */
  private getAccessToken(): string {
    const state = appStore.getState();
    const token = state.Auth.token;
    if (!token) {
      throw new Error('No Google Access Token available. Please log in.');
    }
    return token;
  }

  /**
   * General-purpose generic helper to invoke Google Drive API endpoints.
   *
   * @param url The endpoint URL target.
   * @param init Optional RequestInit configuration overrides.
   * @returns A promise resolving to the typed API response payload.
   */
  private async fetchAPI<T>(url: string, init?: RequestInit): Promise<T> {
    const token = this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    };

    const res = await fetch(url, {
      ...init,
      headers,
    });

    if (!res.ok) {
      let errDetail = '';
      try {
        const errJson = await res.clone().json();
        errDetail = errJson?.error?.message || JSON.stringify(errJson);
      } catch {
        try {
          errDetail = await res.clone().text();
        } catch {
          errDetail = 'No error details available';
        }
      }

      if (res.status === 401 || res.status === 403) {
        // Clear cache on auth errors to force re-evaluation
        this.cache = { spreadsheetIds: {}, sheetIds: {} };
        saveCache(this.cache);
        throw new Error(
          `Google API Authentication Error (${res.status}): ${errDetail}. Please re-login.`,
        );
      }

      throw new Error(`Google API Error (${res.status}): ${errDetail}`);
    }

    if (res.status === 204) return null as unknown as T;

    if (url.includes('alt=media')) {
      const text = await res.text();
      return text as unknown as T;
    }

    return res.json() as Promise<T>;
  }

  /**
   * Searches for or creates the base 'Growboard' folder inside the user's Google Drive.
   *
   * @returns The unique folder ID string.
   */
  private async getOrCreateGrowboardFolder(): Promise<string> {
    this.cache = loadCache();
    if (this.cache.growboardFolderId) {
      return this.cache.growboardFolderId;
    }

    console.log('Searching for Growboard folder in Drive...');
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='Growboard' and mimeType='application/vnd.google-apps.folder' and 'root' in parents and trashed=false&fields=files(id)`;
    const result = await this.fetchAPI<{ files: Array<{ id: string }> }>(
      searchUrl,
    );

    if (result.files && result.files.length > 0) {
      this.cache.growboardFolderId = result.files[0].id;
      saveCache(this.cache);
      return result.files[0].id;
    }

    console.log('Creating Growboard folder in Drive...');
    const createUrl = 'https://www.googleapis.com/drive/v3/files';
    const folder = await this.fetchAPI<{ id: string }>(createUrl, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Growboard',
        mimeType: 'application/vnd.google-apps.folder',
      }),
    });

    this.cache.growboardFolderId = folder.id;
    saveCache(this.cache);
    return folder.id;
  }

  /**
   * Searches for or creates the 'Goals' subfolder inside the Growboard folder.
   *
   * @param growboardFolderId The ID of the parent Growboard folder.
   * @returns The unique folder ID string.
   */
  private async getOrCreateGoalsFolder(
    growboardFolderId: string,
  ): Promise<string> {
    this.cache = loadCache();
    if (this.cache.goalsFolderId) {
      return this.cache.goalsFolderId;
    }

    console.log('Searching for Goals folder in Growboard...');
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='Goals' and mimeType='application/vnd.google-apps.folder' and '${growboardFolderId}' in parents and trashed=false&fields=files(id)`;
    const result = await this.fetchAPI<{ files: Array<{ id: string }> }>(
      searchUrl,
    );

    if (result.files && result.files.length > 0) {
      this.cache.goalsFolderId = result.files[0].id;
      saveCache(this.cache);
      return result.files[0].id;
    }

    console.log('Creating Goals folder in Growboard...');
    const createUrl = 'https://www.googleapis.com/drive/v3/files';
    const folder = await this.fetchAPI<{ id: string }>(createUrl, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Goals',
        mimeType: 'application/vnd.google-apps.folder',
        parents: [growboardFolderId],
      }),
    });

    this.cache.goalsFolderId = folder.id;
    saveCache(this.cache);
    return folder.id;
  }

  /**
   * Helper to sanitize a goal title for use as a file name.
   *
   * @param title The goal title to sanitize.
   * @returns The sanitized title.
   */
  private sanitizeTitle(title: string): string {
    return title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  }

  /**
   * Reads all goals from the 'Goals' folder in Google Drive.
   *
   * @returns A list of parsed goals.
   */
  public async readAllGoals(): Promise<GoalItem[]> {
    try {
      const parentId = await this.getOrCreateGrowboardFolder();
      const goalsFolderId = await this.getOrCreateGoalsFolder(parentId);

      // List all files inside the Goals folder (avoid ends with syntax error in Google Drive v3 API q parameter)
      const listUrl = `https://www.googleapis.com/drive/v3/files?q='${goalsFolderId}' in parents and trashed=false&fields=files(id, name)&pageSize=100`;
      const result = await this.fetchAPI<{
        files: Array<{ id: string; name: string }>;
      }>(listUrl);

      if (!result.files || result.files.length === 0) {
        return [];
      }

      // Filter files ending with .json in JS/TS
      const jsonFiles = result.files.filter((file) =>
        file.name.toLowerCase().endsWith('.json'),
      );

      const goals: GoalItem[] = [];
      for (const file of jsonFiles) {
        try {
          const downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
          const rawContent = await this.fetchAPI<string>(downloadUrl);
          if (rawContent && rawContent.trim() !== '') {
            let goalData: GoalItem;
            try {
              // Try parsing raw JSON content directly
              goalData = JSON.parse(rawContent) as GoalItem;
            } catch {
              // Fallback: try decoding base64 content if saved in previous sessions
              const jsonStr = decodeBase64(rawContent);
              goalData = JSON.parse(jsonStr) as GoalItem;
            }
            goals.push(goalData);
          }
        } catch (err) {
          console.error(
            `Failed to read/parse goal file ${file.name} (ID: ${file.id}):`,
            err,
          );
        }
      }

      // Sort goals by ranking first (ascending, 1 first), then by updatedAt descending
      return goals.sort((a, b) => {
        const aRank = a.ranking ?? Infinity;
        const bRank = b.ranking ?? Infinity;
        if (aRank !== bRank) {
          return aRank - bRank;
        }
        return b.updatedAt.localeCompare(a.updatedAt);
      });
    } catch (error) {
      console.error('Failed to read goals from Google Drive:', error);
      return [];
    }
  }

  /**
   * Saves or updates a goal in Google Drive as a single JSON file.
   *
   * @param goal The goal item to save.
   */
  public async saveGoal(goal: GoalItem): Promise<void> {
    try {
      const parentId = await this.getOrCreateGrowboardFolder();
      const goalsFolderId = await this.getOrCreateGoalsFolder(parentId);
      const safeTitle = this.sanitizeTitle(goal.title);
      const fileName = `${safeTitle}.json`;

      // Check if file already exists
      const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and '${goalsFolderId}' in parents and trashed=false&fields=files(id)`;
      const searchResult = await this.fetchAPI<{
        files: Array<{ id: string }>;
      }>(searchUrl);

      const jsonContent = JSON.stringify(goal);

      if (searchResult.files && searchResult.files.length > 0) {
        // Update existing file
        const fileId = searchResult.files[0].id;
        const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
        await this.fetchAPI<unknown>(uploadUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonContent,
        });
      } else {
        // Create new file
        const boundary = 'growboard_goals_upload_boundary';
        const metadata = {
          name: fileName,
          mimeType: 'application/json',
          parents: [goalsFolderId],
        };

        const body = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(
          metadata,
        )}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${jsonContent}\r\n--${boundary}--`;

        await this.fetchAPI<unknown>(
          'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
          {
            method: 'POST',
            headers: {
              'Content-Type': `multipart/related; boundary=${boundary}`,
            },
            body,
          },
        );
      }
    } catch (error) {
      console.error('Failed to save goal to Google Drive:', error);
      throw error;
    }
  }

  /**
   * Deletes a goal file from Google Drive based on its title.
   *
   * @param title The title of the goal to delete.
   */
  public async deleteGoal(title: string): Promise<void> {
    try {
      const parentId = await this.getOrCreateGrowboardFolder();
      const goalsFolderId = await this.getOrCreateGoalsFolder(parentId);
      const safeTitle = this.sanitizeTitle(title);
      const fileName = `${safeTitle}.json`;

      // Find the file to delete
      const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and '${goalsFolderId}' in parents and trashed=false&fields=files(id)`;
      const searchResult = await this.fetchAPI<{
        files: Array<{ id: string }>;
      }>(searchUrl);

      if (searchResult.files && searchResult.files.length > 0) {
        const fileId = searchResult.files[0].id;
        const deleteUrl = `https://www.googleapis.com/drive/v3/files/${fileId}`;
        await this.fetchAPI<unknown>(deleteUrl, {
          method: 'DELETE',
        });
      }
    } catch (error) {
      console.error('Failed to delete goal from Google Drive:', error);
      throw error;
    }
  }
}

export const googleDriveGoalsService = new GoogleDriveGoalsService();
export default googleDriveGoalsService;
