import { renderHook, act } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { ColorModeProvider, useColorMode } from '../colorMode';

describe('colorMode utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.style.colorScheme = '';
  });

  describe('ColorModeProvider', () => {
    it('defaults to dark mode when localStorage is empty', () => {
      const { result } = renderHook(() => useColorMode(), {
        wrapper: ({ children }) => (
          <ColorModeProvider>{children}</ColorModeProvider>
        ),
      });
      expect(result.current.colorMode).toBe('dark');
    });

    it('reads saved color mode from localStorage', () => {
      localStorage.setItem('chakra-color-mode', 'light');
      const { result } = renderHook(() => useColorMode(), {
        wrapper: ({ children }) => (
          <ColorModeProvider>{children}</ColorModeProvider>
        ),
      });
      expect(result.current.colorMode).toBe('light');
    });

    it('toggles from dark to light', () => {
      const { result } = renderHook(() => useColorMode(), {
        wrapper: ({ children }) => (
          <ColorModeProvider>{children}</ColorModeProvider>
        ),
      });
      expect(result.current.colorMode).toBe('dark');
      act(() => {
        result.current.toggleColorMode();
      });
      expect(result.current.colorMode).toBe('light');
    });

    it('toggles from light to dark', () => {
      localStorage.setItem('chakra-color-mode', 'light');
      const { result } = renderHook(() => useColorMode(), {
        wrapper: ({ children }) => (
          <ColorModeProvider>{children}</ColorModeProvider>
        ),
      });
      expect(result.current.colorMode).toBe('light');
      act(() => {
        result.current.toggleColorMode();
      });
      expect(result.current.colorMode).toBe('dark');
    });

    it('setColorMode sets to a specific mode', () => {
      const { result } = renderHook(() => useColorMode(), {
        wrapper: ({ children }) => (
          <ColorModeProvider>{children}</ColorModeProvider>
        ),
      });
      act(() => {
        result.current.setColorMode('light');
      });
      expect(result.current.colorMode).toBe('light');
    });

    it('applies dark class and color-scheme to documentElement', () => {
      renderHook(() => useColorMode(), {
        wrapper: ({ children }) => (
          <ColorModeProvider>{children}</ColorModeProvider>
        ),
      });
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.style.colorScheme).toBe('dark');
    });

    it('persists colorMode in localStorage when toggled', () => {
      const { result } = renderHook(() => useColorMode(), {
        wrapper: ({ children }) => (
          <ColorModeProvider>{children}</ColorModeProvider>
        ),
      });
      act(() => {
        result.current.toggleColorMode();
      });
      expect(localStorage.getItem('chakra-color-mode')).toBe('light');
    });

    it('renders children correctly', () => {
      render(
        <ColorModeProvider>
          <div data-testid="child">Child</div>
        </ColorModeProvider>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  describe('useColorMode', () => {
    it('throws when used outside ColorModeProvider', () => {
      const originalConsoleError = console.error;
      console.error = jest.fn();
      expect(() => {
        renderHook(() => useColorMode());
      }).toThrow('useColorMode must be used within a ColorModeProvider');
      console.error = originalConsoleError;
    });
  });
});
