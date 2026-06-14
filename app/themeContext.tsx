import React, { createContext, useState, useContext, ReactNode } from 'react';

// Tema "Sabor Azul"
const LightMode = {
  background: {
    primary: '#ffffffff',
    secondary: '#ffffffff',
  },
  text: {
    primary: '#000000ff',
    secondary: '#696969ff',
  },
  primary: '#ffbb6e',
  secondary: '#637231ff',
  accent: 'rgb(233, 134, 53)',
  button: '#d41818ff',
  error: '#E74C3C',
};

const DarkMode = {
 background: {
    primary: '#000000',
    secondary: '#1A1A1A',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A0A0A0',
  },
  primary: '#FFFFFF',
  secondary: '#ffbb6e',
  accent: '#637231ff',
  button: '#d41818ff',
  error: '#FF4444',
};



// 2. Tipagem do Tema
type Theme = typeof LightMode; // Todos os temas devem ter a mesma estrutura

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
  const [currentThemeName, setCurrentThemeName] = useState<'blue'>('blue'); // Tema inicial
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // Modo inicial: claro

  const getTheme = (name:'blue', isDark: boolean): Theme => {
    switch (name) {
      case 'blue': return isDark ? DarkMode : LightMode;
      default: return isDark ? DarkMode : LightMode; // Fallback
    }
  };

  const theme = getTheme(currentThemeName, isDarkMode);

  const setTheme = (name:'blue') => setCurrentThemeName(name);
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
