import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import colors from './colors';
import { fontSize, fontWeight, lineHeight, zIndices } from './fonts';
import '@fontsource/space-mono';

function toTokens<T>(obj: T): any {
  const result: any = {};
  for (const [key, val] of Object.entries(obj || {})) {
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      result[key] = toTokens(val);
    } else {
      result[key] = { value: val };
    }
  }
  return result;
}

const themeData = defineConfig({
  theme: {
    tokens: {
      colors: toTokens(colors),
      fontSizes: toTokens(fontSize),
      fonts: {
        heading: { value: `'Space Mono', monospace` },
      },
      fontWeights: toTokens(fontWeight),
      lineHeights: toTokens(lineHeight),
      zIndex: toTokens(zIndices),
    },
  },
});

const theme = createSystem(defaultConfig, themeData);

export default theme;
