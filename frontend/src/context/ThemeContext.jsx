import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'jpb-theme';
const ThemeContext = createContext(null);

/**
 * Reads the theme the inline <head> script already committed to the document.
 * Initialising from the DOM rather than from localStorage guarantees React's
 * first render agrees with what the browser has painted, so mounting never
 * causes a flash or a class flip.
 */
function readAppliedTheme() {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readAppliedTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    // Tells the UA to paint form controls and scrollbars in the same mode.
    root.style.colorScheme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage unavailable: theme stays for this session only */
    }
  }, [theme]);

  // Follow the OS only while the visitor has not made an explicit choice.
  useEffect(() => {
    let stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    if (stored) return undefined;

    const query = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (event) => setTheme(event.matches ? 'light' : 'dark');
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme, isDark: theme === 'dark' }),
    [theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside a ThemeProvider');
  return context;
}
