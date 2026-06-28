import { appStore, CredentialItem } from '@store';

interface GoogleCache {
  growboardFolderId?: string;
  expensesFolderId?: string;
  spreadsheetIds?: Record<string, string>;
  sheetIds?: Record<string, Record<string, number>>;
  profileFileId?: string;
  credsFolderId?: string;
  credsFileId?: string;
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
 * GoogleDriveCredsService Class.
 * Coordinates all direct read/write API actions targeting the credentials file in Google Drive.
 */
class GoogleDriveCredsService {
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
   * General-purpose generic helper to invoke Google Drive and Sheets REST API endpoints.
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

    // For media downloads of non-JSON files, return the raw text content
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
   * Searches for or creates the 'Creds' subfolder inside the Growboard folder.
   *
   * @param growboardFolderId The ID of the parent Growboard folder.
   * @returns The unique folder ID string.
   */
  private async getOrCreateCredsFolder(
    growboardFolderId: string,
  ): Promise<string> {
    this.cache = loadCache();
    if (this.cache.credsFolderId) {
      return this.cache.credsFolderId;
    }

    console.log('Searching for Creds folder in Growboard...');
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='Creds' and mimeType='application/vnd.google-apps.folder' and '${growboardFolderId}' in parents and trashed=false&fields=files(id)`;
    const result = await this.fetchAPI<{ files: Array<{ id: string }> }>(
      searchUrl,
    );

    if (result.files && result.files.length > 0) {
      this.cache.credsFolderId = result.files[0].id;
      saveCache(this.cache);
      return result.files[0].id;
    }

    console.log('Creating Creds folder in Growboard...');
    const createUrl = 'https://www.googleapis.com/drive/v3/files';
    const folder = await this.fetchAPI<{ id: string }>(createUrl, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Creds',
        mimeType: 'application/vnd.google-apps.folder',
        parents: [growboardFolderId],
      }),
    });

    this.cache.credsFolderId = folder.id;
    saveCache(this.cache);
    return folder.id;
  }

  /**
   * Searches for or initializes the 'cred' document inside the Creds folder.
   *
   * @param credsFolderId The ID of the parent Creds folder.
   * @returns The unique cred file ID string.
   */
  private async getOrCreateCredsFile(credsFolderId: string): Promise<string> {
    this.cache = loadCache();
    if (this.cache.credsFileId) {
      return this.cache.credsFileId;
    }

    console.log('Searching for cred file in Creds folder...');
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='cred' and '${credsFolderId}' in parents and trashed=false&fields=files(id)`;
    const result = await this.fetchAPI<{ files: Array<{ id: string }> }>(
      searchUrl,
    );

    if (result.files && result.files.length > 0) {
      this.cache.credsFileId = result.files[0].id;
      saveCache(this.cache);
      return result.files[0].id;
    }

    console.log('Creating cred file in Creds folder...');
    const initialContent = encodeBase64(JSON.stringify([]));

    const boundary = 'growboard_creds_upload_boundary';
    const metadata = {
      name: 'cred',
      mimeType: 'text/plain',
      parents: [credsFolderId],
    };

    const body = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(
      metadata,
    )}\r\n--${boundary}\r\nContent-Type: text/plain\r\n\r\n${initialContent}\r\n--${boundary}--`;

    const file = await this.fetchAPI<{ id: string }>(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body,
      },
    );

    this.cache.credsFileId = file.id;
    saveCache(this.cache);
    return file.id;
  }

  /**
   * Reads and decodes the user credentials from Google Drive.
   *
   * @returns A promise resolving to the list of credentials.
   */
  public async readCreds(): Promise<CredentialItem[]> {
    const parentId = await this.getOrCreateGrowboardFolder();
    const credsFolderId = await this.getOrCreateCredsFolder(parentId);
    const fileId = await this.getOrCreateCredsFile(credsFolderId);

    const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const base64Content = await this.fetchAPI<string>(downloadUrl);

    if (!base64Content || base64Content.trim() === '') {
      return [];
    }

    try {
      const jsonStr = decodeBase64(base64Content);
      const data = JSON.parse(jsonStr);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Failed to parse or decode credentials data:', e);
      return [];
    }
  }

  /**
   * Encodes and overwrites the user credentials in Google Drive.
   *
   * @param credsData The list of credentials to save.
   */
  public async saveCreds(credsData: CredentialItem[]): Promise<void> {
    const parentId = await this.getOrCreateGrowboardFolder();
    const credsFolderId = await this.getOrCreateCredsFolder(parentId);
    const fileId = await this.getOrCreateCredsFile(credsFolderId);

    const base64Content = encodeBase64(JSON.stringify(credsData));

    const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
    await this.fetchAPI<unknown>(uploadUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: base64Content,
    });
  }
}

export const googleDriveCredsService = new GoogleDriveCredsService();
export default googleDriveCredsService;
