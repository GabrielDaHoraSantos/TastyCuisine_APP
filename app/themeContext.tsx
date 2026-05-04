import React, { createContext, useState, useContext, ReactNode } from 'react';

// Tema "Sabor Azul"
const lightBlueTheme = {
  background: {
    primary: '#f2ecde',
    secondary: '#f7b77359',
  },
  text: {
    primary: '#2b2b2b',
    secondary: '#979797',
  },
  primary: '#f2921d',
  accent: '#46334f',
  button: '#f2921d',
  error: '#E74C3C',
};
// #f2c230 #f2921d #f24f13 #8082a6 #46334f #f2ecde

const darkBlueTheme = {
 background: {
    primary: '#131211ff',
    secondary: 'rgb(199, 168, 135)',
  },
  text: {
    primary: '#8082a6',
    secondary: '#7F8C8D',
  },
  primary: '#f2921d',
  accent: '#e8c094',
  button: '#f2921d',
  error: '#dd1a05ff',
};
// #f2c230 #f2921d #f24f13 #8082a6 #46334f


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