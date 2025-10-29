'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  toggleThemeWithTransition: (animationFn?: () => void) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('nestor-iriondo-theme') as Theme;
    if (savedTheme) {
      setTimeout(() => setTheme(savedTheme), 0);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTimeout(() => setTheme('dark'), 0);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('nestor-iriondo-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleThemeWithTransition = useCallback((animationFn?: () => void) => {
    if (animationFn) {
      animationFn();
    }

    if ('startViewTransition' in document) {
      (document as Document & { startViewTransition: (callback: () => void) => void }).startViewTransition(() => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
      });
    } else {
      setTheme(prev => prev === 'light' ? 'dark' : 'light');
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, toggleThemeWithTransition }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}