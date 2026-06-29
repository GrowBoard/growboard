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
    semanticTokens: {
      colors: {
        bg: {
          app: { value: { _light: '#F1F2F3', _dark: '#121416' } },
          panel: { value: { _light: '#ffffff', _dark: '#17191C' } },
          card: { value: { _light: '#ffffff', _dark: '#1E2023' } },
          cardHeader: { value: { _light: '#f8fafc', _dark: '#1A1C1E' } },
          input: { value: { _light: '#f8fafc', _dark: '#1E2023' } },
          glass: {
            value: {
              _light: 'rgba(255, 255, 255, 0.85)',
              _dark: 'rgba(12, 14, 18, 0.5)',
            },
          },
          active: {
            value: { _light: '#E0F2FE', _dark: 'rgba(0, 216, 255, 0.15)' },
          },
          container: {
            value: {
              _light: '{colors.green.200}',
              _dark: '{colors.green.700}',
            },
          },
        },
        border: {
          subtle: {
            value: { _light: '#E2E8F0', _dark: 'rgba(255, 255, 255, 0.07)' },
          },
          input: {
            value: { _light: '#CBD5E0', _dark: 'rgba(255, 255, 255, 0.15)' },
          },
          focus: { value: { _light: '#00D8FF', _dark: '#00D8FF' } },
          avatar: {
            value: { _light: '{colors.gray.400}', _dark: '{colors.gray.500}' },
          },
        },
        text: {
          primary: { value: { _light: '#17191C', _dark: '#F1F2F3' } },
          secondary: { value: { _light: '#475569', _dark: '#A6ADB5' } },
          muted: { value: { _light: '#64748B', _dark: '#737E8C' } },
          heading: {
            value: {
              _light: '{colors.green.500}',
              _dark: '{colors.green.700}',
            },
          },
          hero: {
            value: {
              _light: 'linear-gradient(to bottom, {colors.green.500}, {colors.blue.500})',
              _dark: 'linear-gradient(to bottom, {colors.green.700}, {colors.blue.700})',
            },
          },
          /** Text color for content layered on top of gradient backgrounds. */
          onGradient: { value: { _light: '#ffffff', _dark: '#ffffff' } },
        },
        icon: {
          primaryColor: {
            value: {
              _light: '{colors.green.400}',
              _dark: '{colors.green.700}',
            },
          },
          primaryBg: { value: { _light: 'white', _dark: 'white' } },
          secondary: {
            value: {
              _light: '{colors.green.500}',
              _dark: '{colors.green.700}',
            },
          },
        },
        gradient: {
          topAppBar: {
            value: {
              _light: 'linear-gradient(to right, {colors.green.300}, {colors.blue.500})',
              _dark: 'linear-gradient(to right, {colors.green.800}, {colors.blue.900})',
            },
          },
          sideBarBG: {
            value: {
              _light: 'linear-gradient(to bottom right, {colors.green.300}, {colors.blue.500})',
              _dark: 'linear-gradient(to bottom right, {colors.green.800}, {colors.blue.900})',
            },
          },
          contentBG: {
            value: {
              _light: 'linear-gradient(to right, {colors.green.200}, {colors.blue.400})',
              _dark: 'linear-gradient(to right, {colors.green.800}, {colors.blue.900})',
            },
          },
        },
      },
    },
  },
});

const theme = createSystem(defaultConfig, themeData);

export default theme;
