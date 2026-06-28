import { appStore } from '@store';

interface GoogleCache {
  growboardFolderId?: string;
  expensesFolderId?: string;
  spreadsheetIds?: Record<string, string>;
  sheetIds?: Record<string, Record<string, number>>;
  profileFileId?: string;
}

const CACHE_KEY = 'growboard_google_sheets_cache';

/**
 * Loads the Google cache configuration from local storage.
 *
 * @returns The cached configuration or a default empty layout.
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
 * Structure of the profile data stored in Google Drive.
 */
export interface ProfileJSONData {
  /** The user biography text. */
  bio: string;
  /** List of phone numbers. */
  phone_number: string[];
  /** Embedded social media profile links. */
  socialLink: {
    facebook: string;
    instagram: string;
    github: string;
    x: string;
    website: string;
  };
  /** List of user hobbies. */
  hobbies: string[];
}

/**
 * GoogleDriveProfileService Class.
 * Coordinates all direct read/write API actions targeting the user profile.json file in Google Drive.
 */
class GoogleDriveProfileService {
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
    return res.json() as Promise<T>;
  }

  /**
   * Searches for or creates the base 'Growboard' folder inside the user's Google Drive.
   *
   * @returns The unique folder ID string.
   */
  private async getOrCreateGrowboardFolder(): Promise<string> {
    this.cache = loadCache(); // reload to get any updates from sheets service
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
   * Searches for or initializes the profile.json document inside the Growboard folder.
   *
   * @param growboardFolderId The ID of the parent Growboard folder.
   * @returns The unique profile file ID string.
   */
  private async getOrCreateProfileFile(
    growboardFolderId: string,
  ): Promise<string> {
    this.cache = loadCache();
    if (this.cache.profileFileId) {
      return this.cache.profileFileId;
    }

    console.log('Searching for profile.json in Growboard folder...');
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='profile.json' and '${growboardFolderId}' in parents and trashed=false&fields=files(id)`;
    const result = await this.fetchAPI<{ files: Array<{ id: string }> }>(
      searchUrl,
    );

    if (result.files && result.files.length > 0) {
      this.cache.profileFileId = result.files[0].id;
      saveCache(this.cache);
      return result.files[0].id;
    }

    console.log('Creating profile.json in Growboard folder...');
    const initialContent: ProfileJSONData = {
      bio: '',
      phone_number: [],
      socialLink: {
        facebook: '',
        instagram: '',
        github: '',
        x: '',
        website: '',
      },
      hobbies: [],
    };

    const boundary = 'growboard_profile_upload_boundary';
    const metadata = {
      name: 'profile.json',
      mimeType: 'application/json',
      parents: [growboardFolderId],
    };

    const body = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(
      metadata,
    )}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(
      initialContent,
    )}\r\n--${boundary}--`;

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

    this.cache.profileFileId = file.id;
    saveCache(this.cache);
    return file.id;
  }

  /**
   * Reads and parses the user profile configuration details from Google Drive.
   *
   * @returns A promise resolving to the user profile data.
   */
  public async readProfile(): Promise<ProfileJSONData> {
    const folderId = await this.getOrCreateGrowboardFolder();
    const fileId = await this.getOrCreateProfileFile(folderId);

    const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const content = await this.fetchAPI<ProfileJSONData>(downloadUrl);
    // Ensure all required fields exist
    return {
      bio: content.bio || '',
      phone_number: content.phone_number || [],
      socialLink: {
        facebook: content.socialLink?.facebook || '',
        instagram: content.socialLink?.instagram || '',
        github: content.socialLink?.github || '',
        x: content.socialLink?.x || '',
        website: content.socialLink?.website || '',
      },
      hobbies: content.hobbies || [],
    };
  }

  /**
   * Overwrites the user profile configuration details in Google Drive.
   *
   * @param profileData The updated profile JSON configuration.
   */
  public async saveProfile(profileData: ProfileJSONData): Promise<void> {
    const folderId = await this.getOrCreateGrowboardFolder();
    const fileId = await this.getOrCreateProfileFile(folderId);

    const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
    await this.fetchAPI<unknown>(uploadUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
  }
}

export const googleDriveProfileService = new GoogleDriveProfileService();
export default googleDriveProfileService;
