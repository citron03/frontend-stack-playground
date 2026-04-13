'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type LegacyMediaQueryList = MediaQueryList & {
  addListener: (listener: (event: MediaQueryListEvent) => void) => void;
  removeListener: (listener: (event: MediaQueryListEvent) => void) => void;
};

type ThemeContextType = {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // start with a stable default to avoid SSR/client hydration mismatch
  const [theme, setThemeState] = useState<Theme>('light');

  // on mount, read saved preference or system preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme') as Theme | null;
      if (saved === 'light' || saved === 'dark') {
        setThemeState(saved);
        return;
      }
    } catch (e) {
      // ignore
    }

    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const sys = mq.matches ? 'dark' : 'light';
      setThemeState(sys);
    }
  }, []);

  // apply theme to documentElement and persist to localStorage
  useEffect(() => {
    const el = document.documentElement;
    if (theme === 'dark') {
      el.classList.add('dark');
      el.setAttribute('data-theme', 'dark');
    } else {
      el.classList.remove('dark');
      el.setAttribute('data-theme', 'light');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  // listen to system theme changes, but only if user hasn't explicitly set a preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');

    const handler = (e: MediaQueryListEvent) => {
      try {
        const saved = localStorage.getItem('theme');
        if (!saved) {
          setThemeState(e.matches ? 'dark' : 'light');
        }
      } catch (err) {
        // ignore
      }
    };

    try {
      mq.addEventListener('change', handler);
    } catch {
      (mq as LegacyMediaQueryList).addListener(handler);
    }

    return () => {
      try {
        mq.removeEventListener('change', handler);
      } catch {
        (mq as LegacyMediaQueryList).removeListener(handler);
      }
    };
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  const toggle = () => setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>{children}</ThemeContext.Provider>
  );
}
