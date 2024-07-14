import { Theme } from '@store';
import { themeKey } from '../token_constants/StorageConstant';

/**
 * Theme check for dark mode.
 */
const themeCheck = getThemeData() === 'dark' ? true : false;

/**
 * Function to get theme data from local storage.
 * @returns theme data from local storage.
 */
function getThemeData() {
  return localStorage.getItem(themeKey);
}

/**
 * Function to set theme data in local storage.
 * @param theme theme data to set in local storage.
 */
function setThemeData(theme: Theme) {
  localStorage.setItem(themeKey, theme);
}

// Export the functions
export { themeCheck, getThemeData, setThemeData };
