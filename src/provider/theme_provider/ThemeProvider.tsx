import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { theme } from '@components';
import { ThemeProviderProps } from './types';

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <ChakraProvider theme={theme} cssVarsRoot="body">
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      {children}
    </ChakraProvider>
  );
};

export default ThemeProvider;
