/**
 * PlanItem interface.
 * Represents a single plan record stored in Google Sheets.
 */
export interface PlanItem {
  /** The unique identifier of the plan */
  Id: string;
  /** The primary title of the plan */
  title: string;
  /** A short description or subtitle */
  subtitle: string;
  /** Date associated with the plan (e.g. YYYY-MM-DD) */
  date: string;
  /** Time associated with the plan (e.g. HH:MM) */
  time: string;
  /** Associated tags for categorization */
  tags: string[];
  /** Detailed content of the plan */
  about_plan: string;
}

/**
 * PlansState interface.
 * Stores the list of plans loaded from Google Sheets.
 */
export interface PlansState {
  /** Loaded list of plans */
  plansData: PlanItem[];
  /** Timestamp when plans were last fetched from Google Sheets */
  lastFetched?: number;
}

/**
 * PlansStateActions interface.
 * Actions to update the plans state slice.
 */
export interface PlansStateActions {
  /** Update the entire list of plans */
  updatePlans: (plans: PlanItem[]) => void;
  /** Clear or reset the plans data to default empty list */
  removePlans: () => void;
}

/**
 * Combined plans state slice.
 */
export type PlansStateSlice = PlansState & PlansStateActions;
