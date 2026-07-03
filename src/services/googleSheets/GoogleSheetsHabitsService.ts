import { getValidAccessToken, triggerSilentRefresh } from '@services/auth';
import { HabitItem, HabitLogItem } from '@store';
import {
  DriveFile,
  DriveFileListResponse,
  SpreadsheetDetailsResponse,
  SheetValuesResponse,
  BatchUpdateResponse,
  GoogleCache,
} from './types';
import { loadCache, saveCache } from './util';

/** Name of the Habits folder inside the GrowBoard root folder */
const HABITS_FOLDER_NAME = 'Habits';

/** Name of the Habits spreadsheet */
const HABITS_SPREADSHEET_NAME = 'Habits';

/** Sheet tab for habit definitions */
const HABITS_SHEET_NAME = 'Habits';

/** Sheet tab for daily log records */
const LOGS_SHEET_NAME = 'Logs';

/**
 * GoogleSheetsHabitsService.
 * Manages all read/write operations for Habit Tracker data stored in Google Drive
 * under GrowBoard/Habits/Habits (Google Spreadsheet with two tabs: Habits + Logs).
 */
class GoogleSheetsHabitsService {
  private cache: GoogleCache = loadCache();

  /**
   * Performs an authenticated request to a Google API endpoint.
   * On a 401 or 403, attempts a silent token refresh and retries once.
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

    const res = await fetch(url, { ...init, headers });

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

      throw new Error(`Google API Error (${res.status}): ${errDetail}`);
    }

    if (res.status === 204) return null as unknown as T;
    return res.json() as Promise<T>;
  }

  // ── DRIVE FOLDER RESOLUTION ─────────────────────────────────────────────────

  /**
   * Resolves the "Growboard" root folder, creating it if absent.
   */
  private async getOrCreateGrowboardFolder(): Promise<string> {
    this.cache = loadCache();
    if (this.cache.growboardFolderId) {
      return this.cache.growboardFolderId;
    }

    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='Growboard' and mimeType='application/vnd.google-apps.folder' and 'root' in parents and trashed=false&fields=files(id)`;
    const result = await this.fetchAPI<DriveFileListResponse>(searchUrl);

    if (result.files && result.files.length > 0) {
      this.cache.growboardFolderId = result.files[0].id;
      saveCache(this.cache);
      return result.files[0].id;
    }

    const folder = await this.fetchAPI<DriveFile>(
      'https://www.googleapis.com/drive/v3/files',
      {
        method: 'POST',
        body: JSON.stringify({
          name: 'Growboard',
          mimeType: 'application/vnd.google-apps.folder',
        }),
      },
    );

    this.cache.growboardFolderId = folder.id;
    saveCache(this.cache);
    return folder.id;
  }

  /**
   * Resolves the "Habits" subfolder inside the Growboard folder, creating it if absent.
   *
   * @param growboardFolderId The parent Growboard folder ID.
   */
  private async getOrCreateHabitsFolder(
    growboardFolderId: string,
  ): Promise<string> {
    this.cache = loadCache();
    if (this.cache.habitsFolderId) {
      return this.cache.habitsFolderId;
    }

    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${HABITS_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and '${growboardFolderId}' in parents and trashed=false&fields=files(id)`;
    const result = await this.fetchAPI<DriveFileListResponse>(searchUrl);

    if (result.files && result.files.length > 0) {
      this.cache.habitsFolderId = result.files[0].id;
      saveCache(this.cache);
      return result.files[0].id;
    }

    const folder = await this.fetchAPI<DriveFile>(
      'https://www.googleapis.com/drive/v3/files',
      {
        method: 'POST',
        body: JSON.stringify({
          name: HABITS_FOLDER_NAME,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [growboardFolderId],
        }),
      },
    );

    this.cache.habitsFolderId = folder.id;
    saveCache(this.cache);
    return folder.id;
  }

  /**
   * Resolves the Habits spreadsheet, creating it (with both sheet tabs) if absent.
   *
   * @param habitsFolderId The Habits folder ID.
   */
  private async getOrCreateHabitsSpreadsheet(
    habitsFolderId: string,
  ): Promise<string> {
    this.cache = loadCache();
    if (this.cache.habitsSpreadsheetId) {
      return this.cache.habitsSpreadsheetId;
    }

    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${HABITS_SPREADSHEET_NAME}' and mimeType='application/vnd.google-apps.spreadsheet' and '${habitsFolderId}' in parents and trashed=false&fields=files(id)`;
    const result = await this.fetchAPI<DriveFileListResponse>(searchUrl);

    if (result.files && result.files.length > 0) {
      const spreadsheetId = result.files[0].id;
      this.cache.habitsSpreadsheetId = spreadsheetId;
      saveCache(this.cache);
      await this.ensureSheetTabs(spreadsheetId);
      return spreadsheetId;
    }

    // Create spreadsheet
    const file = await this.fetchAPI<DriveFile>(
      'https://www.googleapis.com/drive/v3/files',
      {
        method: 'POST',
        body: JSON.stringify({
          name: HABITS_SPREADSHEET_NAME,
          mimeType: 'application/vnd.google-apps.spreadsheet',
          parents: [habitsFolderId],
        }),
      },
    );

    const spreadsheetId = file.id;
    this.cache.habitsSpreadsheetId = spreadsheetId;
    saveCache(this.cache);

    // Initialise both sheet tabs with headers
    await this.ensureSheetTabs(spreadsheetId);

    return spreadsheetId;
  }

  /**
   * Ensures both 'Habits' and 'Logs' sheet tabs exist with correct headers.
   * Renames the default Sheet1 to 'Habits' if needed, then adds a 'Logs' tab.
   *
   * @param spreadsheetId Target spreadsheet ID.
   */
  private async ensureSheetTabs(spreadsheetId: string): Promise<void> {
    const detailsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`;
    const spreadsheet =
      await this.fetchAPI<SpreadsheetDetailsResponse>(detailsUrl);
    const existingSheets = spreadsheet.sheets || [];
    const existingTitles = existingSheets.map((s) => s.properties.title);

    const batchRequests: object[] = [];

    // Rename first sheet to 'Habits' if it isn't already named that
    if (!existingTitles.includes(HABITS_SHEET_NAME)) {
      const firstSheet = existingSheets[0];
      if (firstSheet) {
        batchRequests.push({
          updateSheetProperties: {
            properties: {
              sheetId: firstSheet.properties.sheetId,
              title: HABITS_SHEET_NAME,
            },
            fields: 'title',
          },
        });
      }
    }

    // Add 'Logs' sheet tab if missing
    if (!existingTitles.includes(LOGS_SHEET_NAME)) {
      batchRequests.push({
        addSheet: { properties: { title: LOGS_SHEET_NAME } },
      });
    }

    if (batchRequests.length > 0) {
      const batchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
      await this.fetchAPI<BatchUpdateResponse>(batchUrl, {
        method: 'POST',
        body: JSON.stringify({ requests: batchRequests }),
      });
    }

    // Write headers to the Habits sheet
    const habitsHeaderUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${HABITS_SHEET_NAME}!A1:F1?valueInputOption=RAW`;
    await this.fetchAPI<unknown>(habitsHeaderUrl, {
      method: 'PUT',
      body: JSON.stringify({
        values: [
          [
            'id',
            'name',
            'startDate',
            'endDate',
            'targetPercentage',
            'createdAt',
          ],
        ],
      }),
    });

    // Write headers to the Logs sheet
    const logsHeaderUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${LOGS_SHEET_NAME}!A1:F1?valueInputOption=RAW`;
    await this.fetchAPI<unknown>(logsHeaderUrl, {
      method: 'PUT',
      body: JSON.stringify({
        values: [['id', 'habitId', 'date', 'completed', 'note', 'loggedAt']],
      }),
    });
  }

  /**
   * Resolves the spreadsheet ID and verifies tabs exist.
   */
  private async getSpreadsheetId(): Promise<string> {
    try {
      const growboardFolderId = await this.getOrCreateGrowboardFolder();
      const habitsFolderId =
        await this.getOrCreateHabitsFolder(growboardFolderId);
      return await this.getOrCreateHabitsSpreadsheet(habitsFolderId);
    } catch (error) {
      // Clear cached IDs and retry once
      delete this.cache.habitsFolderId;
      delete this.cache.habitsSpreadsheetId;
      saveCache(this.cache);

      const growboardFolderId = await this.getOrCreateGrowboardFolder();
      const habitsFolderId =
        await this.getOrCreateHabitsFolder(growboardFolderId);
      return await this.getOrCreateHabitsSpreadsheet(habitsFolderId);
    }
  }

  // ── PUBLIC CRUD — HABITS ────────────────────────────────────────────────────

  /**
   * Fetches all habit definitions from the Habits sheet tab.
   *
   * @returns Array of HabitItem objects.
   */
  public async getHabits(): Promise<HabitItem[]> {
    try {
      const spreadsheetId = await this.getSpreadsheetId();
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${HABITS_SHEET_NAME}!A2:F`;
      const result = await this.fetchAPI<SheetValuesResponse>(url);

      const rows = result.values || [];
      return rows
        .filter((row) => row[0])
        .map((row) => ({
          id: String(row[0] || ''),
          name: String(row[1] || ''),
          startDate: String(row[2] || ''),
          endDate: String(row[3] || ''),
          targetPercentage: Number(row[4] || 0),
          createdAt: String(row[5] || ''),
        }));
    } catch (error) {
      console.error('Failed to fetch habits:', error);
      return [];
    }
  }

  /**
   * Appends a new habit definition row to the Habits sheet tab.
   *
   * @param habit The habit data excluding the auto-generated id.
   * @returns The newly created HabitItem with its generated id.
   */
  public async addHabit(habit: Omit<HabitItem, 'id'>): Promise<HabitItem> {
    const spreadsheetId = await this.getSpreadsheetId();
    const generatedId = Math.random().toString(36).substring(2, 11);

    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${HABITS_SHEET_NAME}!A:F:append?valueInputOption=RAW`;
    await this.fetchAPI<unknown>(appendUrl, {
      method: 'POST',
      body: JSON.stringify({
        values: [
          [
            generatedId,
            habit.name,
            habit.startDate,
            habit.endDate || '',
            habit.targetPercentage,
            habit.createdAt,
          ],
        ],
      }),
    });

    return { id: generatedId, ...habit };
  }

  /**
   * Updates an existing habit row in the Habits sheet by id.
   *
   * @param id The id of the habit to update.
   * @param habit Updated habit data.
   * @returns The updated HabitItem.
   */
  public async updateHabit(
    id: string,
    habit: Omit<HabitItem, 'id'>,
  ): Promise<HabitItem> {
    const spreadsheetId = await this.getSpreadsheetId();
    const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${HABITS_SHEET_NAME}!A:F`;
    const result = await this.fetchAPI<SheetValuesResponse>(valuesUrl);
    const rows = result.values || [];

    const rowIndex = rows.findIndex((row) => row[0] === id);
    if (rowIndex === -1) {
      throw new Error(`Habit with ID ${id} not found.`);
    }

    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${HABITS_SHEET_NAME}!A${rowIndex + 1}:F${rowIndex + 1}?valueInputOption=RAW`;
    await this.fetchAPI<unknown>(updateUrl, {
      method: 'PUT',
      body: JSON.stringify({
        values: [
          [
            id,
            habit.name,
            habit.startDate,
            habit.endDate || '',
            habit.targetPercentage,
            habit.createdAt,
          ],
        ],
      }),
    });

    return { id, ...habit };
  }

  /**
   * Deletes a habit row from the Habits sheet by id.
   * Also deletes all associated log rows from the Logs sheet.
   *
   * @param id The id of the habit to delete.
   */
  public async deleteHabit(id: string): Promise<void> {
    const spreadsheetId = await this.getSpreadsheetId();

    const detailsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`;
    const spreadsheet =
      await this.fetchAPI<SpreadsheetDetailsResponse>(detailsUrl);
    const sheets = spreadsheet.sheets || [];

    const habitsSheet = sheets.find(
      (s) => s.properties.title === HABITS_SHEET_NAME,
    );
    const logsSheet = sheets.find(
      (s) => s.properties.title === LOGS_SHEET_NAME,
    );

    if (!habitsSheet) throw new Error('Habits sheet tab not found.');

    // Find row index in Habits sheet
    const habitsValuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${HABITS_SHEET_NAME}!A:A`;
    const habitsResult =
      await this.fetchAPI<SheetValuesResponse>(habitsValuesUrl);
    const habitsRows = habitsResult.values || [];
    const habitRowIndex = habitsRows.findIndex((row) => row[0] === id);

    const batchRequests: object[] = [];

    if (habitRowIndex !== -1) {
      batchRequests.push({
        deleteDimension: {
          range: {
            sheetId: habitsSheet.properties.sheetId,
            dimension: 'ROWS',
            startIndex: habitRowIndex,
            endIndex: habitRowIndex + 1,
          },
        },
      });
    }

    // Find and delete all log rows belonging to this habit (reverse order)
    if (logsSheet) {
      const logsValuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${LOGS_SHEET_NAME}!A:B`;
      const logsResult =
        await this.fetchAPI<SheetValuesResponse>(logsValuesUrl);
      const logsRows = logsResult.values || [];

      // Collect row indices in reverse order to preserve indices during deletion
      const logRowIndices = logsRows
        .map((row, idx) => ({ habitId: row[1], idx }))
        .filter(({ habitId }) => habitId === id)
        .map(({ idx }) => idx)
        .reverse();

      for (const logIdx of logRowIndices) {
        batchRequests.push({
          deleteDimension: {
            range: {
              sheetId: logsSheet.properties.sheetId,
              dimension: 'ROWS',
              startIndex: logIdx,
              endIndex: logIdx + 1,
            },
          },
        });
      }
    }

    if (batchRequests.length > 0) {
      const batchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
      await this.fetchAPI<unknown>(batchUrl, {
        method: 'POST',
        body: JSON.stringify({ requests: batchRequests }),
      });
    }
  }

  // ── PUBLIC CRUD — LOGS ──────────────────────────────────────────────────────

  /**
   * Fetches all habit log entries from the Logs sheet tab.
   *
   * @returns Array of HabitLogItem objects.
   */
  public async getLogs(): Promise<HabitLogItem[]> {
    try {
      const spreadsheetId = await this.getSpreadsheetId();
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${LOGS_SHEET_NAME}!A2:F`;
      const result = await this.fetchAPI<SheetValuesResponse>(url);

      const rows = result.values || [];
      return rows
        .filter((row) => row[0])
        .map((row) => ({
          id: String(row[0] || ''),
          habitId: String(row[1] || ''),
          date: String(row[2] || ''),
          completed: String(row[3] || '').toUpperCase() === 'TRUE',
          note: String(row[4] || ''),
          loggedAt: String(row[5] || ''),
        }));
    } catch (error) {
      console.error('Failed to fetch habit logs:', error);
      return [];
    }
  }

  /**
   * Upserts a daily log for a specific habitId+date pair.
   * If a log already exists for that habit+date, updates it; otherwise appends.
   *
   * @param log The log data excluding the auto-generated id.
   * @returns The saved HabitLogItem.
   */
  public async upsertLog(log: Omit<HabitLogItem, 'id'>): Promise<HabitLogItem> {
    const spreadsheetId = await this.getSpreadsheetId();
    const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${LOGS_SHEET_NAME}!A:C`;
    const result = await this.fetchAPI<SheetValuesResponse>(valuesUrl);
    const rows = result.values || [];

    // Find existing row for this habitId + date combination
    const existingRowIndex = rows.findIndex(
      (row) => row[1] === log.habitId && row[2] === log.date,
    );

    if (existingRowIndex !== -1) {
      // Update existing row
      const existingId = rows[existingRowIndex][0];
      const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${LOGS_SHEET_NAME}!A${existingRowIndex + 1}:F${existingRowIndex + 1}?valueInputOption=RAW`;
      await this.fetchAPI<unknown>(updateUrl, {
        method: 'PUT',
        body: JSON.stringify({
          values: [
            [
              existingId,
              log.habitId,
              log.date,
              log.completed ? 'TRUE' : 'FALSE',
              log.note || '',
              log.loggedAt,
            ],
          ],
        }),
      });
      return { id: existingId, ...log };
    }

    // Append new row
    const generatedId = Math.random().toString(36).substring(2, 11);
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${LOGS_SHEET_NAME}!A:F:append?valueInputOption=RAW`;
    await this.fetchAPI<unknown>(appendUrl, {
      method: 'POST',
      body: JSON.stringify({
        values: [
          [
            generatedId,
            log.habitId,
            log.date,
            log.completed ? 'TRUE' : 'FALSE',
            log.note || '',
            log.loggedAt,
          ],
        ],
      }),
    });

    return { id: generatedId, ...log };
  }
}

export const googleSheetsHabitsService = new GoogleSheetsHabitsService();
export default googleSheetsHabitsService;
