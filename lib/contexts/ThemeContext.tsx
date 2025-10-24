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
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleThemeWithTransition = useCallback((animationFn?: () => void) => {
    if (animationFn) {
      animationFn();
    }

    if ('startViewTransition' in document) {
      (document as any).startViewTransition(() => {
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