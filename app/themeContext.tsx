// ThemeContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { lightPurpleTheme, darkPurpleTheme, lightBlueTheme, darkBlueTheme, lightModernTheme, darkModernTheme } from './themes';

type Theme = typeof lightPurpleTheme; // Ou um tipo mais genérico

interface ThemeContextType {
  theme: Theme;
  currentThemeName: string;
  toggleTheme: (newThemeName: string) => void;
  toggleMode: () => void; // Para alternar entre claro/escuro
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [currentThemeName, setCurrentThemeName] = useState('lightPurple'); // Tema inicial
  const [isDarkMode, setIsDarkMode] = useState(false);

  const getTheme = (name: string, isDark: boolean) => {
    switch (name) {
      case 'purple': return isDark ? darkPurpleTheme : lightPurpleTheme;
      case 'blue': return isDark ? darkBlueTheme : lightBlueTheme;
      case 'modern': return isDark ? darkModernTheme : lightModernTheme;
      default: return isDark ? darkPurpleTheme : lightPurpleTheme;
    }
  };

  const theme = getTheme(currentThemeName.replace(/(light|dark)/, ''), isDarkMode);

  const toggleTheme = (newThemeName: string) => {
    setCurrentThemeName(newThemeName);
  };

  const toggleMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, currentThemeName, toggleTheme, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};