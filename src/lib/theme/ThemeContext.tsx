'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ThemeMode = 'dark' | 'light';

type ThemeContextValue = {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (m: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('theme-mode') : null;
    if (stored === 'dark' || stored === 'light') setMode(stored as ThemeMode);
    else {
      const pref = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setMode(pref as ThemeMode);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('theme-dark', 'theme-light');
      document.documentElement.classList.add(mode === 'dark' ? 'theme-dark' : 'theme-light');
    }
    if (typeof window !== 'undefined') window.localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggle: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')),
      setMode,
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

