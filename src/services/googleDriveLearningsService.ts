import { appStore, LearningItem } from '@store';

interface GoogleCache {
  growboardFolderId?: string;
  learningsFolderId?: string;
  spreadsheetIds?: Record<string, string>;
  sheetIds?: Record<string, Record<string, number>>;
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
 * Helper to serialize a LearningItem to markdown with frontmatter metadata.
 *
 * @param item The learning item to serialize.
 * @returns The formatted markdown string.
 */
export const serializeLearning = (item: LearningItem): string => {
  const frontmatter = [
    '---',
    `title: ${item.title.replace(/\n/g, ' ')}`,
    `subtitle: ${item.subtitle.replace(/\n/g, ' ')}`,
    `tags: ${item.tags.join(', ')}`,
    `createdAt: ${item.createdAt}`,
    `updatedAt: ${item.updatedAt}`,
    '---',
    '',
    item.content,
  ].join('\n');
  return frontmatter;
};

/**
 * Helper to deserialize file content string into a LearningItem.
 *
 * @param fileContent The raw markdown file content.
 * @returns The deserialized LearningItem.
 */
export const deserializeLearning = (fileContent: string): LearningItem => {
  const lines = fileContent.split('\n');
  let title = '';
  let subtitle = '';
  let tags: string[] = [];
  let createdAt = '';
  let updatedAt = '';
  let contentStartIndex = -1;

  if (lines[0]?.trim() === '---') {
    let i = 1;
    while (i < lines.length && lines[i]?.trim() !== '---') {
      const line = lines[i];
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const key = line.substring(0, colonIndex).trim().toLowerCase();
        const val = line.substring(colonIndex + 1).trim();
        if (key === 'title') {
          title = val;
        } else if (key === 'subtitle') {
          subtitle = val;
        } else if (key === 'tags') {
          tags = val ? val.split(',').map((t) => t.trim()).filter(Boolean) : [];
        } else if (key === 'createdat') {
          createdAt = val;
        } else if (key === 'updatedat') {
          updatedAt = val;
        }
      }
      i++;
    }
    if (i < lines.length && lines[i]?.trim() === '---') {
      contentStartIndex = i + 1;
    }
  }

  const content =
    contentStartIndex !== -1
      ? lines.slice(contentStartIndex).join('\n').trim()
      : fileContent.trim();

  const now = new Date().toISOString();
  return {
    title: title || 'Untitled Learning',
    subtitle: subtitle || '',
    tags,
    content,
    createdAt: createdAt || now,
    updatedAt: updatedAt || now,
  };
};

/**
 * GoogleDriveLearningsService Class.
 * Coordinates all direct read/write API actions targeting the Learning files (.md) in Google Drive.
 */
class GoogleDriveLearningsService {
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
   * Searches for or creates the 'Learnings' subfolder inside the Growboard folder.
   *
   * @param growboardFolderId The ID of the parent Growboard folder.
   * @returns The unique folder ID string.
   */
  private async getOrCreateLearningsFolder(
    growboardFolderId: string,
  ): Promise<string> {
    this.cache = loadCache();
    if (this.cache.learningsFolderId) {
      return this.cache.learningsFolderId;
    }

    console.log('Searching for Learnings folder in Growboard...');
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='Learnings' and mimeType='application/vnd.google-apps.folder' and '${growboardFolderId}' in parents and trashed=false&fields=files(id)`;
    const result = await this.fetchAPI<{ files: Array<{ id: string }> }>(
      searchUrl,
    );

    if (result.files && result.files.length > 0) {
      this.cache.learningsFolderId = result.files[0].id;
      saveCache(this.cache);
      return result.files[0].id;
    }

    console.log('Creating Learnings folder in Growboard...');
    const createUrl = 'https://www.googleapis.com/drive/v3/files';
    const folder = await this.fetchAPI<{ id: string }>(createUrl, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Learnings',
        mimeType: 'application/vnd.google-apps.folder',
        parents: [growboardFolderId],
      }),
    });

    this.cache.learningsFolderId = folder.id;
    saveCache(this.cache);
    return folder.id;
  }

  /**
   * Helper to sanitize a learning title for use as a file name.
   *
   * @param title The learning title to sanitize.
   * @returns The sanitized title.
   */
  private sanitizeTitle(title: string): string {
    return title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  }

  /**
   * Reads all learnings from the 'Learnings' folder in Google Drive.
   *
   * @returns A list of parsed learnings.
   */
  public async readAllLearnings(): Promise<LearningItem[]> {
    try {
      const parentId = await this.getOrCreateGrowboardFolder();
      const learningsFolderId = await this.getOrCreateLearningsFolder(parentId);

      const listUrl = `https://www.googleapis.com/drive/v3/files?q='${learningsFolderId}' in parents and trashed=false&fields=files(id, name)&pageSize=100`;
      const result = await this.fetchAPI<{
        files: Array<{ id: string; name: string }>;
      }>(listUrl);

      if (!result.files || result.files.length === 0) {
        return [];
      }

      const mdFiles = result.files.filter((file) =>
        file.name.toLowerCase().endsWith('.md'),
      );

      const learnings: LearningItem[] = [];
      for (const file of mdFiles) {
        try {
          const downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
          const rawContent = await this.fetchAPI<string>(downloadUrl);
          if (rawContent !== null && rawContent !== undefined) {
            const parsed = deserializeLearning(rawContent);
            learnings.push(parsed);
          }
        } catch (err) {
          console.error(
            `Failed to read/parse learning file ${file.name} (ID: ${file.id}):`,
            err,
          );
        }
      }

      // Sort learnings by updatedAt descending
      return learnings.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    } catch (error) {
      console.error('Failed to read learnings from Google Drive:', error);
      return [];
    }
  }

  /**
   * Saves or updates a learning in Google Drive as a single Markdown file.
   *
   * @param learning The learning item to save.
   * @param originalTitle If editing, the original title before name change (to rename/replace file).
   */
  public async saveLearning(
    learning: LearningItem,
    originalTitle?: string,
  ): Promise<void> {
    try {
      const parentId = await this.getOrCreateGrowboardFolder();
      const learningsFolderId = await this.getOrCreateLearningsFolder(parentId);
      const safeTitle = this.sanitizeTitle(learning.title);
      const fileName = `${safeTitle}.md`;

      const mdContent = serializeLearning(learning);

      // If originalTitle is provided and is different, we rename or delete the old file
      if (originalTitle && originalTitle !== learning.title) {
        await this.deleteLearning(originalTitle);
      }

      // Check if file already exists
      const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and '${learningsFolderId}' in parents and trashed=false&fields=files(id)`;
      const searchResult = await this.fetchAPI<{
        files: Array<{ id: string }>;
      }>(searchUrl);

      if (searchResult.files && searchResult.files.length > 0) {
        // Update existing file
        const fileId = searchResult.files[0].id;
        const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
        await this.fetchAPI<unknown>(uploadUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'text/markdown',
          },
          body: mdContent,
        });
      } else {
        // Create new file
        const boundary = 'growboard_learnings_upload_boundary';
        const metadata = {
          name: fileName,
          mimeType: 'text/markdown',
          parents: [learningsFolderId],
        };

        const body = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(
          metadata,
        )}\r\n--${boundary}\r\nContent-Type: text/markdown\r\n\r\n${mdContent}\r\n--${boundary}--`;

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
      console.error('Failed to save learning to Google Drive:', error);
      throw error;
    }
  }

  /**
   * Deletes a learning file from Google Drive based on its title.
   *
   * @param title The title of the learning to delete.
   */
  public async deleteLearning(title: string): Promise<void> {
    try {
      const parentId = await this.getOrCreateGrowboardFolder();
      const learningsFolderId = await this.getOrCreateLearningsFolder(parentId);
      const safeTitle = this.sanitizeTitle(title);
      const fileName = `${safeTitle}.md`;

      // Find the file to delete
      const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and '${learningsFolderId}' in parents and trashed=false&fields=files(id)`;
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
      console.error('Failed to delete learning from Google Drive:', error);
      throw error;
    }
  }
}

export const googleDriveLearningsService = new GoogleDriveLearningsService();
export default googleDriveLearningsService;
