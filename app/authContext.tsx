import React, { createContext, useContext, useState } from 'react';

interface AuthUser {
  codUser: number;
  nomeCompleto: string;
  nomeDeUsuario: string;
  gmail: string;
  idade: number;
  restricoesAlimentares?: string;
  Status_Usuario?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLogged: boolean;
  userName: string | null;
  userId: string | null;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (userData: any) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLogged: !!user,
      userName: user?.nomeCompleto ?? null,
      userId: user ? String(user.codUser) : null,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
