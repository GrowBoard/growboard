import { getValidAccessToken, triggerSilentRefresh } from '@services/auth';
import { ExpenseType } from '@screens/private/screens/expenses/expense_preview/types';
import { ExpenseDataPoint } from '@services/hooks/private/Finance/types';
import {
  DriveFile,
  DriveFileListResponse,
  SpreadsheetDetailsResponse,
  BatchUpdateResponse,
  SheetValuesResponse,
  GoogleCache,
} from './types';
import { MONTH_NAMES } from './const';
import { loadCache, saveCache } from './util';

/**
 * Service class that manages expense data in Google Drive and Sheets.
 * Each year's expenses are stored in a dedicated spreadsheet, with one
 * sheet tab per month.
 */
class GoogleSheetsExpenseService {
  private cache: GoogleCache = loadCache();

  /**
   * Performs an authenticated request to a Google API endpoint.
   * On a 401 or 403, attempts a silent token refresh and retries once
   * before throwing. Only forces re-login if the silent refresh also fails.
   * @param url - Full URL to request.
   * @param init - Optional fetch init options (method, body, headers, etc.).
   * @param isRetry - Internal flag to prevent infinite retry loops.
   * @returns Parsed JSON response body typed as T, or null for 204 responses.
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
      // On auth errors, attempt a silent token refresh and retry once
      if ((res.status === 401 || res.status === 403) && !isRetry) {
        try {
          await triggerSilentRefresh();
          // Retry the original request with the new token
          return this.fetchAPI<T>(url, init, true);
        } catch {
          // Silent refresh failed — clear cache and require re-login
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

  // ── DRIVE OPERATIONS ────────────────────────────────────────────────────────

  /**
   * Resolves the "Growboard" root folder in the user's Drive, creating it if absent.
   * @returns The Drive file ID of the Growboard folder.
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
   * Resolves the "Expenses" subfolder inside the Growboard folder, creating it if absent.
   * @param growboardFolderId - Drive file ID of the Growboard root folder.
   * @returns The Drive file ID of the Expenses folder.
   */
  private async getOrCreateExpensesFolder(
    growboardFolderId: string,
  ): Promise<string> {
    if (this.cache.expensesFolderId) {
      return this.cache.expensesFolderId;
    }

    console.log('Searching for Expenses folder in Growboard...');
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='Expenses' and mimeType='application/vnd.google-apps.folder' and '${growboardFolderId}' in parents and trashed=false&fields=files(id)`;
    const result = await this.fetchAPI<DriveFileListResponse>(searchUrl);

    if (result.files && result.files.length > 0) {
      this.cache.expensesFolderId = result.files[0].id;
      saveCache(this.cache);
      return result.files[0].id;
    }

    console.log('Creating Expenses folder in Growboard...');
    const createUrl = 'https://www.googleapis.com/drive/v3/files';
    const folder = await this.fetchAPI<DriveFile>(createUrl, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Expenses',
        mimeType: 'application/vnd.google-apps.folder',
        parents: [growboardFolderId],
      }),
    });

    this.cache.expensesFolderId = folder.id;
    saveCache(this.cache);
    return folder.id;
  }

  /**
   * Resolves the year spreadsheet inside the Expenses folder, creating it if absent.
   * @param expensesFolderId - Drive file ID of the Expenses folder.
   * @param year - The calendar year.
   * @returns The spreadsheet ID for that year.
   */
  private async getOrCreateYearSpreadsheet(
    expensesFolderId: string,
    year: number,
  ): Promise<string> {
    const yearStr = String(year);
    if (this.cache.spreadsheetIds[yearStr]) {
      return this.cache.spreadsheetIds[yearStr];
    }

    console.log(`Searching for spreadsheet for year ${year}...`);
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${yearStr}' and mimeType='application/vnd.google-apps.spreadsheet' and '${expensesFolderId}' in parents and trashed=false&fields=files(id)`;
    const result = await this.fetchAPI<DriveFileListResponse>(searchUrl);

    if (result.files && result.files.length > 0) {
      const spreadsheetId = result.files[0].id;
      this.cache.spreadsheetIds[yearStr] = spreadsheetId;
      saveCache(this.cache);
      return spreadsheetId;
    }

    console.log(`Creating spreadsheet for year ${year}...`);
    const createUrl = 'https://www.googleapis.com/drive/v3/files';
    const file = await this.fetchAPI<DriveFile>(createUrl, {
      method: 'POST',
      body: JSON.stringify({
        name: yearStr,
        mimeType: 'application/vnd.google-apps.spreadsheet',
        parents: [expensesFolderId],
      }),
    });

    this.cache.spreadsheetIds[yearStr] = file.id;
    saveCache(this.cache);
    return file.id;
  }

  // ── SHEETS OPERATIONS ───────────────────────────────────────────────────────

  /**
   * Ensures a sheet tab for the given month exists in the spreadsheet,
   * creating or renaming a default sheet if needed.
   * @param spreadsheetId - The target spreadsheet ID.
   * @param monthName - The month name (e.g. "January").
   * @returns The numeric sheet ID of the month tab.
   */
  private async ensureMonthSheetExists(
    spreadsheetId: string,
    monthName: string,
  ): Promise<number> {
    if (!this.cache.sheetIds[spreadsheetId]) {
      this.cache.sheetIds[spreadsheetId] = {};
    }

    if (this.cache.sheetIds[spreadsheetId][monthName] !== undefined) {
      return this.cache.sheetIds[spreadsheetId][monthName];
    }

    console.log(`Fetching spreadsheet sheets details for ${monthName}...`);
    const detailsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`;
    const spreadsheet =
      await this.fetchAPI<SpreadsheetDetailsResponse>(detailsUrl);

    const existingSheet = spreadsheet.sheets?.find(
      (s) => s.properties.title === monthName,
    );

    if (existingSheet) {
      const id = existingSheet.properties.sheetId;
      this.cache.sheetIds[spreadsheetId][monthName] = id;
      saveCache(this.cache);
      return id;
    }

    // Check if the spreadsheet has a generic default sheet (e.g. "Sheet1")
    // and rename it to the current month instead of creating a new sheet
    const isGenericDefaultSheet =
      spreadsheet.sheets &&
      spreadsheet.sheets.length === 1 &&
      !MONTH_NAMES.includes(
        spreadsheet.sheets[0].properties.title as (typeof MONTH_NAMES)[number],
      );

    if (isGenericDefaultSheet) {
      const firstSheet = spreadsheet.sheets![0];
      const firstSheetId = firstSheet.properties.sheetId;
      console.log(
        `Renaming default sheet '${firstSheet.properties.title}' to '${monthName}'...`,
      );

      const renameUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
      await this.fetchAPI<BatchUpdateResponse>(renameUrl, {
        method: 'POST',
        body: JSON.stringify({
          requests: [
            {
              updateSheetProperties: {
                properties: {
                  sheetId: firstSheetId,
                  title: monthName,
                },
                fields: 'title',
              },
            },
          ],
        }),
      });

      this.cache.sheetIds[spreadsheetId][monthName] = firstSheetId;
      saveCache(this.cache);

      // Initialize headers in the renamed sheet: id, amount, date_time, comment, category
      console.log(`Writing headers to renamed sheet '${monthName}'...`);
      const writeHeadersUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${monthName}!A1:E1?valueInputOption=RAW`;
      await this.fetchAPI<unknown>(writeHeadersUrl, {
        method: 'PUT',
        body: JSON.stringify({
          values: [['id', 'amount', 'date_time', 'comment', 'category']],
        }),
      });

      return firstSheetId;
    }

    console.log(`Creating sheet tab '${monthName}' inside spreadsheet...`);
    const addSheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
    const addResult = await this.fetchAPI<BatchUpdateResponse>(addSheetUrl, {
      method: 'POST',
      body: JSON.stringify({
        requests: [
          {
            addSheet: {
              properties: {
                title: monthName,
              },
            },
          },
        ],
      }),
    });

    const newSheetId = addResult.replies[0].addSheet.properties.sheetId;
    this.cache.sheetIds[spreadsheetId][monthName] = newSheetId;
    saveCache(this.cache);

    // Initialize headers in the new sheet: id, amount, date_time, comment, category
    console.log(`Writing headers to sheet '${monthName}'...`);
    const writeHeadersUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${monthName}!A1:E1?valueInputOption=RAW`;
    await this.fetchAPI<unknown>(writeHeadersUrl, {
      method: 'PUT',
      body: JSON.stringify({
        values: [['id', 'amount', 'date_time', 'comment', 'category']],
      }),
    });

    return newSheetId;
  }

  /**
   * Resolves the spreadsheet ID and sheet tab for a given year/month,
   * retrying from scratch if the first attempt fails due to stale cache.
   * @param year - The calendar year.
   * @param month - The 0-indexed month (0 = January).
   * @returns Resolved spreadsheetId, sheetId, and monthName.
   */
  private async getSpreadsheetAndSheet(year: number, month: number) {
    const monthName = MONTH_NAMES[month];
    try {
      const growboardFolderId = await this.getOrCreateGrowboardFolder();
      const expensesFolderId =
        await this.getOrCreateExpensesFolder(growboardFolderId);
      const spreadsheetId = await this.getOrCreateYearSpreadsheet(
        expensesFolderId,
        year,
      );
      const sheetId = await this.ensureMonthSheetExists(
        spreadsheetId,
        monthName,
      );

      return { spreadsheetId, sheetId, monthName };
    } catch (error) {
      console.warn(
        'Error resolving Google Sheets, clearing cache and retrying:',
        error,
      );

      // Reset cache and save
      this.cache = { spreadsheetIds: {}, sheetIds: {} };
      saveCache(this.cache);

      // Re-run setup from scratch
      const growboardFolderId = await this.getOrCreateGrowboardFolder();
      const expensesFolderId =
        await this.getOrCreateExpensesFolder(growboardFolderId);
      const spreadsheetId = await this.getOrCreateYearSpreadsheet(
        expensesFolderId,
        year,
      );
      const sheetId = await this.ensureMonthSheetExists(
        spreadsheetId,
        monthName,
      );

      return { spreadsheetId, sheetId, monthName };
    }
  }

  // ── PUBLIC CRUD INTERFACE ──────────────────────────────────────────────────

  /**
   * Fetches all expenses for a given year and month from Google Sheets.
   * @param year - The calendar year.
   * @param month - The 0-indexed month (0 = January).
   * @returns Result object with expense data, status, and message.
   */
  public async getExpensesForMonth(
    year: number,
    month: number,
  ): Promise<{
    data: ExpenseDataPoint[];
    status: string;
    successMessage: string;
  }> {
    try {
      const { spreadsheetId, monthName } = await this.getSpreadsheetAndSheet(
        year,
        month,
      );

      const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${monthName}!A2:E`;
      const result = await this.fetchAPI<SheetValuesResponse>(valuesUrl);

      const rows = result.values || [];
      const data: ExpenseDataPoint[] = rows.map((row) => ({
        id: String(row[0] || ''),
        amount: Number(row[1] || 0),
        date_time: String(row[2] || ''),
        comment: String(row[3] || ''),
        category: (row[4] || ExpenseType.Food) as ExpenseType,
      }));

      return {
        data,
        status: 'SUCCESS',
        successMessage: `Retrieved ${data.length} expenses successfully from Google Sheets.`,
      };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to fetch data.';
      console.error('Failed to get expenses from Google Sheets:', e);
      return {
        data: [],
        status: 'ERROR',
        successMessage: message,
      };
    }
  }

  /**
   * Appends a new expense row to the relevant month sheet.
   * @param expense - Expense data without an ID (ID is generated automatically).
   * @returns The saved expense including the generated ID.
   */
  public async addExpense(
    expense: Omit<ExpenseDataPoint, 'id'>,
  ): Promise<ExpenseDataPoint> {
    const dateObj = new Date(expense.date_time);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();

    const { spreadsheetId, monthName } = await this.getSpreadsheetAndSheet(
      year,
      month,
    );
    const generatedId = Math.random().toString(36).substring(2, 11);

    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${monthName}!A:E:append?valueInputOption=RAW`;
    await this.fetchAPI<unknown>(appendUrl, {
      method: 'POST',
      body: JSON.stringify({
        values: [
          [
            generatedId,
            expense.amount,
            expense.date_time,
            expense.comment || '',
            expense.category,
          ],
        ],
      }),
    });

    return {
      id: generatedId,
      ...expense,
    };
  }

  /**
   * Updates an existing expense row in the relevant month sheet.
   * @param updatedExpense - The full updated expense, including its ID.
   * @returns The updated expense as saved.
   */
  public async updateExpense(
    updatedExpense: ExpenseDataPoint,
  ): Promise<ExpenseDataPoint> {
    const dateObj = new Date(updatedExpense.date_time);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();

    const { spreadsheetId, monthName } = await this.getSpreadsheetAndSheet(
      year,
      month,
    );

    // Fetch all values to find the matching row index
    const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${monthName}!A:E`;
    const result = await this.fetchAPI<SheetValuesResponse>(valuesUrl);
    const rows = result.values || [];

    // Find row by ID (0-indexed array, so row in spreadsheet is index + 1)
    const rowIndex = rows.findIndex((row) => row[0] === updatedExpense.id);
    if (rowIndex === -1) {
      throw new Error(
        `Expense with ID ${updatedExpense.id} not found in sheet ${monthName}.`,
      );
    }

    const rowNum = rowIndex + 1; // 1-indexed row number
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${monthName}!A${rowNum}:E${rowNum}?valueInputOption=RAW`;

    await this.fetchAPI<unknown>(updateUrl, {
      method: 'PUT',
      body: JSON.stringify({
        values: [
          [
            updatedExpense.id,
            updatedExpense.amount,
            updatedExpense.date_time,
            updatedExpense.comment || '',
            updatedExpense.category,
          ],
        ],
      }),
    });

    return updatedExpense;
  }

  /**
   * Deletes an expense row from the relevant month sheet by ID.
   * @param expenseId - The ID of the expense to delete.
   * @param dateStr - The date string used to resolve the correct year/month sheet.
   * @returns True on success.
   */
  public async deleteExpense(
    expenseId: string,
    dateStr: string,
  ): Promise<boolean> {
    const dateObj = new Date(dateStr);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();

    const { spreadsheetId, sheetId, monthName } =
      await this.getSpreadsheetAndSheet(year, month);

    // Fetch all values to find the matching row index
    const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${monthName}!A:E`;
    const result = await this.fetchAPI<SheetValuesResponse>(valuesUrl);
    const rows = result.values || [];

    const rowIndex = rows.findIndex((row) => row[0] === expenseId);
    if (rowIndex === -1) {
      throw new Error(
        `Expense with ID ${expenseId} not found in sheet ${monthName}.`,
      );
    }

    // rowIndex is 0-based index.
    // Google Sheets deleteDimension takes 0-based index where:
    // startIndex is inclusive, endIndex is exclusive.
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

export const googleSheetsExpenseService = new GoogleSheetsExpenseService();
export default googleSheetsExpenseService;
