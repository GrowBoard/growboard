import { ChakraProvider } from '@chakra-ui/react';
import { theme, ColorModeProvider, Toaster } from '@components';
import { ThemeProviderProps } from './types';

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <ChakraProvider value={theme}>
      <ColorModeProvider>
        {children}
        <Toaster />
      </ColorModeProvider>
    </ChakraProvider>
  );
};

export default ThemeProvider;
