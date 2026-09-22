import React, { createContext, useContext, useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('betlegal_theme');
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('betlegal_theme', theme);
    } catch {
      // ignore storage limitations
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

interface ThemeToggleProps {
  variant?: 'compact' | 'expanded';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'expanded') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
          isDark
            ? 'bg-[#1E293B] text-[#F8FAFC] hover:bg-[#334155]'
            : 'bg-[#F0F4F9] text-[#263648] hover:bg-[#E2E8F0]'
        } ${className}`}
        aria-label={`Alternar para modo ${isDark ? 'claro' : 'escuro'}`}
        role="switch"
        aria-checked={isDark}
      >
        <span className="flex items-center gap-2">
          {isDark ? (
            <Moon className="w-4 h-4 text-[#38BDF8]" />
          ) : (
            <Sun className="w-4 h-4 text-[#F59E0B]" />
          )}
          <span>{isDark ? 'Modo Escuro Ativo' : 'Modo Claro Ativo'}</span>
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded font-mono font-semibold bg-black/10 dark:bg-white/10">
          {isDark ? 'Trocar para Claro' : 'Trocar para Escuro'}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative p-2 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-[#1769E0] ${
        isDark
          ? 'text-[#F1F5F9] bg-[#1E293B] hover:bg-[#334155] border border-[#334155]'
          : 'text-[#263648] bg-[#F6F8FB] hover:bg-[#E5E9F0] border border-[#D7DEE8]'
      } ${className}`}
      title={isDark ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
      aria-label={isDark ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
      role="switch"
      aria-checked={isDark}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#FBBF24] transition-transform rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-[#1769E0] transition-transform rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
};
