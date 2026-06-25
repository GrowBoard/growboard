import { appStore } from '@store';
import { ExpenseType } from '@screens/private/screens/expenses/expense_preview/types';
import { ExpenseDataPoint } from '@services/hooks/private/Finance/types';

// Cache structure stored in localStorage to minimize API calls
interface GoogleCache {
  growboardFolderId?: string;
  expensesFolderId?: string;
  spreadsheetIds: Record<string, string>; // year -> spreadsheetId
  sheetIds: Record<string, Record<string, number>>; // spreadsheetId -> { monthName -> sheetId }
}

const CACHE_KEY = 'growboard_google_sheets_cache';

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

const saveCache = (cache: GoogleCache) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Failed to save Google Sheets cache:', e);
  }
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

class GoogleSheetsExpenseService {
  private cache: GoogleCache = loadCache();

  private getAccessToken(): string {
    const state = appStore.getState();
    const token = state.Auth.token;
    if (!token) {
      throw new Error('No Google Access Token available. Please log in.');
    }
    return token;
  }

  private async fetchAPI(url: string, init?: RequestInit): Promise<any> {
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

    if (res.status === 204) return null;
    return res.json();
  }

  // ── DRIVE OPERATIONS ────────────────────────────────────────────────────────

  private async getOrCreateGrowboardFolder(): Promise<string> {
    if (this.cache.growboardFolderId) {
      return this.cache.growboardFolderId;
    }

    console.log('Searching for Growboard folder in Drive...');
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='Growboard' and mimeType='application/vnd.google-apps.folder' and 'root' in parents and trashed=false&fields=files(id)`;
    const result = await this.fetchAPI(searchUrl);

    if (result.files && result.files.length > 0) {
      this.cache.growboardFolderId = result.files[0].id;
      saveCache(this.cache);
      return result.files[0].id;
    }

    console.log('Creating Growboard folder in Drive...');
    const createUrl = 'https://www.googleapis.com/drive/v3/files';
    const folder = await this.fetchAPI(createUrl, {
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

  private async getOrCreateExpensesFolder(
    growboardFolderId: string,
  ): Promise<string> {
    if (this.cache.expensesFolderId) {
      return this.cache.expensesFolderId;
    }

    console.log('Searching for Expenses folder in Growboard...');
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='Expenses' and mimeType='application/vnd.google-apps.folder' and '${growboardFolderId}' in parents and trashed=false&fields=files(id)`;
    const result = await this.fetchAPI(searchUrl);

    if (result.files && result.files.length > 0) {
      this.cache.expensesFolderId = result.files[0].id;
      saveCache(this.cache);
      return result.files[0].id;
    }

    console.log('Creating Expenses folder in Growboard...');
    const createUrl = 'https://www.googleapis.com/drive/v3/files';
    const folder = await this.fetchAPI(createUrl, {
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
    const result = await this.fetchAPI(searchUrl);

    if (result.files && result.files.length > 0) {
      const spreadsheetId = result.files[0].id;
      this.cache.spreadsheetIds[yearStr] = spreadsheetId;
      saveCache(this.cache);
      return spreadsheetId;
    }

    console.log(`Creating spreadsheet for year ${year}...`);
    const createUrl = 'https://www.googleapis.com/drive/v3/files';
    const file = await this.fetchAPI(createUrl, {
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
    const spreadsheet = await this.fetchAPI(detailsUrl);

    const existingSheet = spreadsheet.sheets?.find(
      (s: any) => s.properties.title === monthName,
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
      !MONTH_NAMES.includes(spreadsheet.sheets[0].properties.title);

    if (isGenericDefaultSheet) {
      const firstSheet = spreadsheet.sheets[0];
      const firstSheetId = firstSheet.properties.sheetId;
      console.log(
        `Renaming default sheet '${firstSheet.properties.title}' to '${monthName}'...`,
      );

      const renameUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
      await this.fetchAPI(renameUrl, {
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

      // Initialize headers in the renamed sheet: ID, Date, Category, Amount, Comment
      console.log(`Writing headers to renamed sheet '${monthName}'...`);
      const writeHeadersUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${monthName}!A1:E1?valueInputOption=RAW`;
      await this.fetchAPI(writeHeadersUrl, {
        method: 'PUT',
        body: JSON.stringify({
          values: [['id', 'amount', 'date_time', 'comment', 'category']],
        }),
      });

      return firstSheetId;
    }

    console.log(`Creating sheet tab '${monthName}' inside spreadsheet...`);
    const addSheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
    const addResult = await this.fetchAPI(addSheetUrl, {
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

    // Initialize headers in the new sheet: ID, Date, Category, Amount, Comment
    console.log(`Writing headers to sheet '${monthName}'...`);
    const writeHeadersUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${monthName}!A1:E1?valueInputOption=RAW`;
    await this.fetchAPI(writeHeadersUrl, {
      method: 'PUT',
      body: JSON.stringify({
        values: [['id', 'amount', 'date_time', 'comment', 'category']],
      }),
    });

    return newSheetId;
  }

  // Helper to get everything set up for a specific year and month
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
      const result = await this.fetchAPI(valuesUrl);

      const rows = result.values || [];
      const data: ExpenseDataPoint[] = rows.map((row: any) => ({
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
    } catch (e: any) {
      console.error('Failed to get expenses from Google Sheets:', e);
      return {
        data: [],
        status: 'ERROR',
        successMessage: e.message || 'Failed to fetch data.',
      };
    }
  }

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
    await this.fetchAPI(appendUrl, {
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
    const result = await this.fetchAPI(valuesUrl);
    const rows = result.values || [];

    // Find row by ID (0-indexed array, so row in spreadsheet is index + 1)
    const rowIndex = rows.findIndex((row: any) => row[0] === updatedExpense.id);
    if (rowIndex === -1) {
      throw new Error(
        `Expense with ID ${updatedExpense.id} not found in sheet ${monthName}.`,
      );
    }

    const rowNum = rowIndex + 1; // 1-indexed row number
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${monthName}!A${rowNum}:E${rowNum}?valueInputOption=RAW`;

    await this.fetchAPI(updateUrl, {
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
    const result = await this.fetchAPI(valuesUrl);
    const rows = result.values || [];

    const rowIndex = rows.findIndex((row: any) => row[0] === expenseId);
    if (rowIndex === -1) {
      throw new Error(
        `Expense with ID ${expenseId} not found in sheet ${monthName}.`,
      );
    }

    // rowIndex is 0-based index.
    // Google Sheets deleteDimension takes 0-based index where:
    // startIndex is inclusive, endIndex is exclusive.
    const batchUpdateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
    await this.fetchAPI(batchUpdateUrl, {
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
