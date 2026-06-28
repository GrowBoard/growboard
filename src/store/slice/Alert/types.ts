/**
 * AlertState type.
 * Represents the slice state holding toast alert configuration.
 */
export type AlertState = {
  /** The current toast alert metadata. */
  alertData: ToastAlertData;
};

/**
 * AlertStateActions interface.
 * Defines callback methods to display or close toast alerts.
 */
interface AlertStateActions {
  /** Display a new toast alert. */
  showToastAlert: (alert: ToastAlertData) => void;
  /** Clear/hide the current active toast alert. */
  hideToastAlert: () => void;
}

/**
 * Combined alert slice type containing both state and actions.
 */
export type AlertStateSlice = AlertState & AlertStateActions;

/**
 * ToastAlertData type.
 * Structured dataset for showing a toast alert with optional position overrides.
 */
export type ToastAlertData = {
  /** Core alert text and category details. */
  alertData: AlertComponentData;
  /** Horizontal alignment position on screen. */
  xPosition?: ToastXPosition;
  /** Vertical alignment position on screen. */
  yPosition?: ToastYPosition;
  /** Flag to toggle bounce animation effect. */
  bounce?: boolean;
};

/**
 * AlertComponentData type.
 * Defines the title message and level type of the toast component.
 */
export type AlertComponentData = {
  /** The main message text to display. */
  title: string;
  /** The alert classification level. */
  type: AlertType;
};

/**
 * AlertType enum.
 * Classifies alert levels mapping to different color themes.
 */
export enum AlertType {
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
}

/**
 * ToastXPosition enum.
 * Defines horizontal CSS class anchors.
 */
export enum ToastXPosition {
  START = 'toast-start',
  CENTER = 'toast-center',
  END = 'toast-end',
}

/**
 * ToastYPosition enum.
 * Defines vertical CSS class anchors.
 */
export enum ToastYPosition {
  TOP = 'toast-top',
  CENTER = 'toast-center',
  BOTTOM = 'toast-bottom',
}
export type { AlertStateActions };
