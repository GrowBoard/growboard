/**
 * Google API response shapes for the Google Sheets Expense Service.
 */

/** A Drive file item returned by the Drive v3 files list API. */
export interface DriveFile {
  id: string;
}

/** Response shape for Drive v3 file list queries. */
export interface DriveFileListResponse {
  files?: DriveFile[];
}

/** Properties of a single Google Sheet tab. */
export interface SheetProperties {
  sheetId: number;
  title: string;
}

/** A single sheet entry inside a Spreadsheet resource. */
export interface SheetEntry {
  properties: SheetProperties;
}

/** Response shape for the Sheets v4 spreadsheet details endpoint. */
export interface SpreadsheetDetailsResponse {
  sheets?: SheetEntry[];
}

/** Response shape for the Sheets v4 batchUpdate (addSheet) endpoint. */
export interface AddSheetReply {
  addSheet: { properties: SheetProperties };
}

/** Response shape for the Sheets v4 batchUpdate endpoint. */
export interface BatchUpdateResponse {
  replies: AddSheetReply[];
}

/** Response shape for the Sheets v4 values endpoint. */
export interface SheetValuesResponse {
  values?: string[][];
}

/** Local cache to store resolved Drive/Sheets IDs and minimise API calls. */
export interface GoogleCache {
  growboardFolderId?: string;
  expensesFolderId?: string;
  resourcesFolderId?: string;
  resourcesSpreadsheetId?: string;
  plansFolderId?: string;
  plansSpreadsheetId?: string;
  projectsFolderId?: string;
  projectsSpreadsheetId?: string;
  /** Maps year string → spreadsheetId */
  spreadsheetIds: Record<string, string>;
  /** Maps spreadsheetId → { monthName → sheetId } */
  sheetIds: Record<string, Record<string, number>>;
}
