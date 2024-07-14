export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export type ThemeState = {
  themeValue: Theme;
};

export interface ThemeStateActions {
  setTheme: (theme: Theme) => void;
}

export type ThemeStateSlice = ThemeState & ThemeStateActions;
