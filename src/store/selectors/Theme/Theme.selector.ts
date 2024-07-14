import { AppStoreState } from '@store';

export const themeSelector = (state: AppStoreState) => ({
  themeValue: state.Theme.themeValue,
  setTheme: state.Theme.setTheme,
});
