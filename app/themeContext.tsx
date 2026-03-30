import React, { createContext, useState, useContext, ReactNode } from 'react';

// Tema "Sabor Azul"
const lightBlueTheme = {
  background: {
    primary: '#e7d2bfff',
    secondary: '#f7b77359',
  },
  text: {
    primary: '#6d4005',
    secondary: '#7F8C8D',
  },
  primary: '#ff7e00',
  accent: '#bc701a',
  button: '#d66f1b',
  error: '#E74C3C',
};

const darkBlueTheme = {
 background: {
    primary: '#131211ff',
    secondary: '#bd7c37ff',
  },
  text: {
    primary: '#e2e2e2ff',
    secondary: '#7F8C8D',
  },
  primary: '#c5884eff',
  accent: '#e8c094',
  button: '#eccfc8',
  error: '#dd1a05ff',
};



// 2. Tipagem do Tema
type Theme = typeof lightBlueTheme; // Todos os temas devem ter a mesma estrutura

// 3. Tipagem do Contexto
interface ThemeContextType {
  theme: Theme;
  currentThemeName: string; // Ex: 'purple', 'blue', 'modern'
  isDarkMode: boolean; // true para modo escuro, false para modo claro
  setTheme: (name:  'blue' ) => void;
  toggleDarkMode: () => void;
}

// 4. Criação do Contexto
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 5. Provedor do Tema
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [currentThemeName, setCurrentThemeName] = useState<'purple' | 'blue' | 'modern'>('purple'); // Tema inicial
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // Modo inicial: claro

  const getTheme = (name: 'purple' | 'blue' | 'modern', isDark: boolean): Theme => {
    switch (name) {
      case 'blue': return isDark ? darkBlueTheme : lightBlueTheme;
      default: return isDark ? darkBlueTheme : lightBlueTheme; // Fallback
    }
  };

  const theme = getTheme(currentThemeName, isDarkMode);

  const setTheme = (name: 'purple' | 'blue' | 'modern') => setCurrentThemeName(name);
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ theme, currentThemeName, isDarkMode, setTheme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 6. Hook Personalizado para Consumir o Tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};