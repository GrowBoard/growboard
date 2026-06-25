import React, { createContext, useContext, useState, useEffect } from 'react';

type ColorMode = 'light' | 'dark';

interface ColorModeContextType {
  colorMode: ColorMode;
  toggleColorMode: () => void;
  setColorMode: (mode: ColorMode) => void;
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(
  undefined,
);

export const ColorModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [colorMode, setColorModeState] = useState<ColorMode>(() => {
    const saved = localStorage.getItem('chakra-color-mode');
    return saved === 'dark' || saved === 'light' ? saved : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (colorMode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('chakra-color-mode', colorMode);
  }, [colorMode]);

  const toggleColorMode = () => {
    setColorModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode);
  };

  return (
    <ColorModeContext.Provider
      value={{ colorMode, toggleColorMode, setColorMode }}
    >
      <div
        className={colorMode}
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        {children}
      </div>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error('useColorMode must be used within a ColorModeProvider');
  }
  return context;
};
