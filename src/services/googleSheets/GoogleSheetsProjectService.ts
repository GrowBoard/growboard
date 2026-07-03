import { getValidAccessToken, triggerSilentRefresh } from '@services/auth';
import { ProjectItem } from '@store';
import {
  DriveFile,
  DriveFileListResponse,
  SpreadsheetDetailsResponse,
  SheetValuesResponse,
  GoogleCache,
} from './types';
import { loadCache, saveCache } from './util';

/**
 * Service class that manages projects data in Google Drive and Sheets.
 * Stores all projects in a single spreadsheet under Growboard/Projects/ folder.
 */
class GoogleSheetsProjectService {
  private cache: GoogleCache = loadCache();

  /**
   * Performs an authenticated request to a Google API endpoint.
   * On a 401 or 403, attempts a silent token refresh and retries once
   * before throwing.
   */
  private async fetchAPI<T>(
    url: string,
    init?: RequestInit,
    isRetry = false,
  ): Promise<T> {
    const token = getValidAccessToken();
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
      if ((res.status === 401 || res.status === 403) && !isRetry) {
        try {
          await triggerSilentRefresh();
          return this.fetchAPI<T>(url, init, true);
        } catch {
          this.cache = { spreadsheetIds: {}, sheetIds: {} };
          saveCache(this.cache);
          throw new Error(
            `Google API Authentication Error (${res.status}): Session expired. Please re-login.`,
          );
        }
      }

      let errDetail = '';
      try {
        const errJson = await res.clone().json();
        errDetail =
          (errJson as { error?: { message?: string } })?.error?.message ||
          JSON.stringify(errJson);
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
    return res.json() as Promise<T>;
  }

  // ── DRIVE OPERATIONS ────────────────────────────────────────────────────────

  /**
   * Resolves the "Growboard" root folder in the user's Drive, creating it if absent.
   */
  private async getOrCreateGrowboardFolder(): Promise<string> {
    if (this.cache.growboardFolderId) {
      return this.cache.growboardFolderId;
    }

    console.log('Searching for Growboard folder in Drive...');
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='Growboard' and mimeType='application/vnd.google-apps.folder' and 'root' in parents and trashed=false&fields=files(id)`;
    const result = await this.fetchAPI<DriveFileListResponse>(searchUrl);

    if (result.files && result.files.length > 0) {
      this.cache.growboardFolderId = result.files[0].id;
      saveCache(this.cache);
      return result.files[0].id;
    }

    console.log('Creating Growboard folder in Drive...');
    const createUrl = 'https://www.googleapis.com/drive/v3/files';
    const folder = await this.fetchAPI<DriveFile>(createUrl, {
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
   * Resolves the "Projects" subfolder inside the Growboard folder, creating it if absent.
   */
  private async getOrCreateProjectsFolder(
    growboardFolderId: string,
  ): Promise<string> {
    if (this.cache.projectsFolderId) {
      return this.cache.projectsFolderId;
    }

    console.log('Searching for Projects folder in Growboard...');
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='Projects' and mimeType='application/vnd.google-apps.folder' and '${growboardFolderId}' in parents and trashed=false&fields=files(id)`;
    const result = await this.fetchAPI<DriveFileListResponse>(searchUrl);

    if (result.files && result.files.length > 0) {
      this.cache.projectsFolderId = result.files[0].id;
      saveCache(this.cache);
      return result.files[0].id;
    }

    console.log('Creating Projects folder in Growboard...');
    const createUrl = 'https://www.googleapis.com/drive/v3/files';
    const folder = await this.fetchAPI<DriveFile>(createUrl, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Projects',
        mimeType: 'application/vnd.google-apps.folder',
        parents: [growboardFolderId],
      }),
    });

    this.cache.projectsFolderId = folder.id;
    saveCache(this.cache);
    return folder.id;
  }

  /**
   * Resolves the "Projects" spreadsheet inside the Projects folder, creating it if absent.
   */
  private async getOrCreateProjectsSpreadsheet(
    projectsFolderId: string,
  ): Promise<string> {
    if (this.cache.projectsSpreadsheetId) {
      return this.cache.projectsSpreadsheetId;
    }

    console.log('Searching for Projects spreadsheet...');
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='Projects' and mimeType='application/vnd.google-apps.spreadsheet' and '${projectsFolderId}' in parents and trashed=false&fields=files(id)`;
    const result = await this.fetchAPI<DriveFileListResponse>(searchUrl);

    if (result.files && result.files.length > 0) {
      const spreadsheetId = result.files[0].id;
      this.cache.projectsSpreadsheetId = spreadsheetId;
      saveCache(this.cache);
      return spreadsheetId;
    }

    console.log('Creating Projects spreadsheet...');
    const createUrl = 'https://www.googleapis.com/drive/v3/files';
    const file = await this.fetchAPI<DriveFile>(createUrl, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Projects',
        mimeType: 'application/vnd.google-apps.spreadsheet',
        parents: [projectsFolderId],
      }),
    });

    const spreadsheetId = file.id;
    this.cache.projectsSpreadsheetId = spreadsheetId;
    saveCache(this.cache);

    console.log('Writing default headers to Projects spreadsheet...');
    const detailsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`;
    const spreadsheet =
      await this.fetchAPI<SpreadsheetDetailsResponse>(detailsUrl);
    const sheetTitle = spreadsheet.sheets?.[0]?.properties.title || 'Sheet1';

    // Schema: Id, title, subtitle, link, tags, about_project, remark, owner, status
    const writeHeadersUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}!A1:I1?valueInputOption=RAW`;
    await this.fetchAPI<unknown>(writeHeadersUrl, {
      method: 'PUT',
      body: JSON.stringify({
        values: [
          [
            'Id',
            'title',
            'subtitle',
            'link',
            'tags',
            'about_project',
            'remark',
            'owner',
            'status',
          ],
        ],
      }),
    });

    return spreadsheetId;
  }

  /**
   * Resolves the spreadsheet and folder IDs.
   */
  private async getSpreadsheetDetails(): Promise<{
    spreadsheetId: string;
    sheetTitle: string;
  }> {
    try {
      const growboardFolderId = await this.getOrCreateGrowboardFolder();
      const projectsFolderId =
        await this.getOrCreateProjectsFolder(growboardFolderId);
      const spreadsheetId =
        await this.getOrCreateProjectsSpreadsheet(projectsFolderId);

      const detailsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`;
      const spreadsheet =
        await this.fetchAPI<SpreadsheetDetailsResponse>(detailsUrl);
      const sheetTitle = spreadsheet.sheets?.[0]?.properties.title || 'Sheet1';

      return { spreadsheetId, sheetTitle };
    } catch (error) {
      console.warn(
        'Error resolving projects Google sheet, clearing cache and retrying:',
        error,
      );
      delete this.cache.projectsFolderId;
      delete this.cache.projectsSpreadsheetId;
      saveCache(this.cache);

      const growboardFolderId = await this.getOrCreateGrowboardFolder();
      const projectsFolderId =
        await this.getOrCreateProjectsFolder(growboardFolderId);
      const spreadsheetId =
        await this.getOrCreateProjectsSpreadsheet(projectsFolderId);

      const detailsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`;
      const spreadsheet =
        await this.fetchAPI<SpreadsheetDetailsResponse>(detailsUrl);
      const sheetTitle = spreadsheet.sheets?.[0]?.properties.title || 'Sheet1';

      return { spreadsheetId, sheetTitle };
    }
  }

  // ── PUBLIC CRUD INTERFACE ──────────────────────────────────────────────────

  /**
   * Fetches all projects from Google Sheets.
   */
  public async getProjects(): Promise<{
    data: ProjectItem[];
    status: string;
    successMessage: string;
  }> {
    try {
      const { spreadsheetId, sheetTitle } = await this.getSpreadsheetDetails();

      const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}!A2:I`;
      const result = await this.fetchAPI<SheetValuesResponse>(valuesUrl);

      const rows = result.values || [];
      const data: ProjectItem[] = rows.map((row) => ({
        Id: String(row[0] || ''),
        title: String(row[1] || ''),
        subtitle: String(row[2] || ''),
        link: String(row[3] || ''),
        tags: row[4]
          ? String(row[4])
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        about_project: String(row[5] || ''),
        remark: String(row[6] || ''),
        owner: String(row[7] || ''),
        status: (row[8] || 'pending') as 'started' | 'pending' | 'done',
      }));

      return {
        data,
        status: 'SUCCESS',
        successMessage: `Retrieved ${data.length} projects successfully from Google Sheets.`,
      };
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Failed to fetch projects.';
      console.error('Failed to get projects from Google Sheets:', e);
      return {
        data: [],
        status: 'ERROR',
        successMessage: message,
      };
    }
  }

  /**
   * Appends a new project row to the sheet.
   */
  public async addProject(
    project: Omit<ProjectItem, 'Id'>,
  ): Promise<ProjectItem> {
    const { spreadsheetId, sheetTitle } = await this.getSpreadsheetDetails();
    const generatedId = Math.random().toString(36).substring(2, 11);

    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}!A:I:append?valueInputOption=RAW`;
    await this.fetchAPI<unknown>(appendUrl, {
      method: 'POST',
      body: JSON.stringify({
        values: [
          [
            generatedId,
            project.title,
            project.subtitle || '',
            project.link || '',
            project.tags.join(', '),
            project.about_project || '',
            project.remark || '',
            project.owner || '',
            project.status,
          ],
        ],
      }),
    });

    return {
      Id: generatedId,
      ...project,
    };
  }

  /**
   * Updates an existing project row.
   */
  public async updateProject(
    id: string,
    project: Omit<ProjectItem, 'Id'>,
  ): Promise<ProjectItem> {
    const { spreadsheetId, sheetTitle } = await this.getSpreadsheetDetails();

    // Fetch all values to find the matching row index
    const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}!A:I`;
    const result = await this.fetchAPI<SheetValuesResponse>(valuesUrl);
    const rows = result.values || [];

    const rowIndex = rows.findIndex((row) => row[0] === id);
    if (rowIndex === -1) {
      throw new Error(`Project with ID ${id} not found.`);
    }

    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}!A${rowIndex + 1}:I${rowIndex + 1}?valueInputOption=RAW`;
    await this.fetchAPI<unknown>(updateUrl, {
      method: 'PUT',
      body: JSON.stringify({
        values: [
          [
            id,
            project.title,
            project.subtitle || '',
            project.link || '',
            project.tags.join(', '),
            project.about_project || '',
            project.remark || '',
            project.owner || '',
            project.status,
          ],
        ],
      }),
    });

    return {
      Id: id,
      ...project,
    };
  }

  /**
   * Deletes a project row from the sheet by ID.
   */
  public async deleteProject(id: string): Promise<boolean> {
    const { spreadsheetId, sheetTitle } = await this.getSpreadsheetDetails();

    const detailsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`;
    const spreadsheet =
      await this.fetchAPI<SpreadsheetDetailsResponse>(detailsUrl);
    const sheetId = spreadsheet.sheets?.[0]?.properties.sheetId || 0;

    const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}!A:I`;
    const result = await this.fetchAPI<SheetValuesResponse>(valuesUrl);
    const rows = result.values || [];

    const rowIndex = rows.findIndex((row) => row[0] === id);
    if (rowIndex === -1) {
      throw new Error(`Project with ID ${id} not found in sheet.`);
    }

    const batchUpdateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
    await this.fetchAPI<unknown>(batchUpdateUrl, {
      method: 'POST',
      body: JSON.stringify({
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: 'ROWS',
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      }),
    });

    return true;
  }
}

export const googleSheetsProjectService = new GoogleSheetsProjectService();
export default googleSheetsProjectService;
