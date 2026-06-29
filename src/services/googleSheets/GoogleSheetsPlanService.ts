import { getValidAccessToken, triggerSilentRefresh } from '@services/auth';
import { PlanItem } from '@store';
import {
  DriveFile,
  DriveFileListResponse,
  SpreadsheetDetailsResponse,
  SheetValuesResponse,
  GoogleCache,
} from './types';
import { loadCache, saveCache } from './util';

/**
 * Service class that manages plans data in Google Drive and Sheets.
 * Stores all plans in a single spreadsheet under GrowBoard/Plans/ folder.
 */
class GoogleSheetsPlanService {
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
   * Resolves the "Plans" subfolder inside the Growboard folder, creating it if absent.
   */
  private async getOrCreatePlansFolder(
    growboardFolderId: string,
  ): Promise<string> {
    if (this.cache.plansFolderId) {
      return this.cache.plansFolderId;
    }

    console.log('Searching for Plans folder in Growboard...');
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='Plans' and mimeType='application/vnd.google-apps.folder' and '${growboardFolderId}' in parents and trashed=false&fields=files(id)`;
    const result = await this.fetchAPI<DriveFileListResponse>(searchUrl);

    if (result.files && result.files.length > 0) {
      this.cache.plansFolderId = result.files[0].id;
      saveCache(this.cache);
      return result.files[0].id;
    }

    console.log('Creating Plans folder in Growboard...');
    const createUrl = 'https://www.googleapis.com/drive/v3/files';
    const folder = await this.fetchAPI<DriveFile>(createUrl, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Plans',
        mimeType: 'application/vnd.google-apps.folder',
        parents: [growboardFolderId],
      }),
    });

    this.cache.plansFolderId = folder.id;
    saveCache(this.cache);
    return folder.id;
  }

  /**
   * Resolves the "Plans" spreadsheet inside the Plans folder, creating it if absent.
   */
  private async getOrCreatePlansSpreadsheet(
    plansFolderId: string,
  ): Promise<string> {
    if (this.cache.plansSpreadsheetId) {
      return this.cache.plansSpreadsheetId;
    }

    console.log('Searching for Plans spreadsheet...');
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='Plans' and mimeType='application/vnd.google-apps.spreadsheet' and '${plansFolderId}' in parents and trashed=false&fields=files(id)`;
    const result = await this.fetchAPI<DriveFileListResponse>(searchUrl);

    if (result.files && result.files.length > 0) {
      const spreadsheetId = result.files[0].id;
      this.cache.plansSpreadsheetId = spreadsheetId;
      saveCache(this.cache);
      return spreadsheetId;
    }

    console.log('Creating Plans spreadsheet...');
    const createUrl = 'https://www.googleapis.com/drive/v3/files';
    const file = await this.fetchAPI<DriveFile>(createUrl, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Plans',
        mimeType: 'application/vnd.google-apps.spreadsheet',
        parents: [plansFolderId],
      }),
    });

    const spreadsheetId = file.id;
    this.cache.plansSpreadsheetId = spreadsheetId;
    saveCache(this.cache);

    console.log('Writing default headers to Plans spreadsheet...');
    const detailsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`;
    const spreadsheet = await this.fetchAPI<SpreadsheetDetailsResponse>(detailsUrl);
    const sheetTitle = spreadsheet.sheets?.[0]?.properties.title || 'Sheet1';

    // Schema: Id, title, subtitle, date, time, tags, about_plan
    const writeHeadersUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}!A1:G1?valueInputOption=RAW`;
    await this.fetchAPI<unknown>(writeHeadersUrl, {
      method: 'PUT',
      body: JSON.stringify({
        values: [['Id', 'title', 'subtitle', 'date', 'time', 'tags', 'about_plan']],
      }),
    });

    return spreadsheetId;
  }

  /**
   * Resolves the spreadsheet and folder IDs.
   */
  private async getSpreadsheetDetails(): Promise<{ spreadsheetId: string; sheetTitle: string }> {
    try {
      const growboardFolderId = await this.getOrCreateGrowboardFolder();
      const plansFolderId = await this.getOrCreatePlansFolder(growboardFolderId);
      const spreadsheetId = await this.getOrCreatePlansSpreadsheet(plansFolderId);

      const detailsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`;
      const spreadsheet = await this.fetchAPI<SpreadsheetDetailsResponse>(detailsUrl);
      const sheetTitle = spreadsheet.sheets?.[0]?.properties.title || 'Sheet1';

      return { spreadsheetId, sheetTitle };
    } catch (error) {
      console.warn('Error resolving plans Google sheet, clearing cache and retrying:', error);
      delete this.cache.plansFolderId;
      delete this.cache.plansSpreadsheetId;
      saveCache(this.cache);

      const growboardFolderId = await this.getOrCreateGrowboardFolder();
      const plansFolderId = await this.getOrCreatePlansFolder(growboardFolderId);
      const spreadsheetId = await this.getOrCreatePlansSpreadsheet(plansFolderId);

      const detailsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`;
      const spreadsheet = await this.fetchAPI<SpreadsheetDetailsResponse>(detailsUrl);
      const sheetTitle = spreadsheet.sheets?.[0]?.properties.title || 'Sheet1';

      return { spreadsheetId, sheetTitle };
    }
  }

  // ── PUBLIC CRUD INTERFACE ──────────────────────────────────────────────────

  /**
   * Fetches all plans from Google Sheets.
   */
  public async getPlans(): Promise<{
    data: PlanItem[];
    status: string;
    successMessage: string;
  }> {
    try {
      const { spreadsheetId, sheetTitle } = await this.getSpreadsheetDetails();

      const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}!A2:G`;
      const result = await this.fetchAPI<SheetValuesResponse>(valuesUrl);

      const rows = result.values || [];
      const data: PlanItem[] = rows.map((row) => ({
        Id: String(row[0] || ''),
        title: String(row[1] || ''),
        subtitle: String(row[2] || ''),
        date: String(row[3] || ''),
        time: String(row[4] || ''),
        tags: row[5] ? String(row[5]).split(',').map((t) => t.trim()).filter(Boolean) : [],
        about_plan: String(row[6] || ''),
      }));

      return {
        data,
        status: 'SUCCESS',
        successMessage: `Retrieved ${data.length} plans successfully from Google Sheets.`,
      };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to fetch plans.';
      console.error('Failed to get plans from Google Sheets:', e);
      return {
        data: [],
        status: 'ERROR',
        successMessage: message,
      };
    }
  }

  /**
   * Appends a new plan row to the sheet.
   */
  public async addPlan(plan: Omit<PlanItem, 'Id'>): Promise<PlanItem> {
    const { spreadsheetId, sheetTitle } = await this.getSpreadsheetDetails();
    const generatedId = Math.random().toString(36).substring(2, 11);

    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}!A:G:append?valueInputOption=RAW`;
    await this.fetchAPI<unknown>(appendUrl, {
      method: 'POST',
      body: JSON.stringify({
        values: [
          [
            generatedId,
            plan.title,
            plan.subtitle || '',
            plan.date || '',
            plan.time || '',
            plan.tags.join(', '),
            plan.about_plan || '',
          ],
        ],
      }),
    });

    return {
      Id: generatedId,
      ...plan,
    };
  }

  /**
   * Updates an existing plan row.
   */
  public async updatePlan(id: string, plan: Omit<PlanItem, 'Id'>): Promise<PlanItem> {
    const { spreadsheetId, sheetTitle } = await this.getSpreadsheetDetails();

    // Fetch all values to find the matching row index
    const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}!A:G`;
    const result = await this.fetchAPI<SheetValuesResponse>(valuesUrl);
    const rows = result.values || [];

    const rowIndex = rows.findIndex((row) => row[0] === id);
    if (rowIndex === -1) {
      throw new Error(`Plan with ID ${id} not found.`);
    }

    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}!A${rowIndex + 1}:G${rowIndex + 1}?valueInputOption=RAW`;
    await this.fetchAPI<unknown>(updateUrl, {
      method: 'PUT',
      body: JSON.stringify({
        values: [
          [
            id,
            plan.title,
            plan.subtitle || '',
            plan.date || '',
            plan.time || '',
            plan.tags.join(', '),
            plan.about_plan || '',
          ],
        ],
      }),
    });

    return {
      Id: id,
      ...plan,
    };
  }

  /**
   * Deletes a plan row from the sheet by ID.
   */
  public async deletePlan(id: string): Promise<boolean> {
    const { spreadsheetId, sheetTitle } = await this.getSpreadsheetDetails();

    const detailsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`;
    const spreadsheet = await this.fetchAPI<SpreadsheetDetailsResponse>(detailsUrl);
    const sheetId = spreadsheet.sheets?.[0]?.properties.sheetId || 0;

    const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}!A:G`;
    const result = await this.fetchAPI<SheetValuesResponse>(valuesUrl);
    const rows = result.values || [];

    const rowIndex = rows.findIndex((row) => row[0] === id);
    if (rowIndex === -1) {
      throw new Error(`Plan with ID ${id} not found in sheet.`);
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

export const googleSheetsPlanService = new GoogleSheetsPlanService();
export default googleSheetsPlanService;
