import { ThemeConfig, extendTheme } from '@chakra-ui/react';
import colors from './colors';
import { fontSize, fontWeight, lineHeight, zIndices } from './fonts';
import '@fontsource/space-mono';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  disableTransitionOnChange: false,
};

const themeData = {
  config: { ...config },
  colors: { ...colors },
  fontSizes: { ...fontSize },
  fonts: {
    heading: `'Space Mono', monospace`,
  },
  fontWeights: { ...fontWeight },
  lineHeights: { ...lineHeight },
  zIndices: { ...zIndices },
};

const theme = extendTheme(themeData);

export default theme;
