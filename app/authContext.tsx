import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { usuariosAPI } from './(auth)/api';

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
  loading: boolean;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  async function carregarUsuario() {
    const id = await AsyncStorage.getItem('userId');
    if (id) {
      const res = await usuariosAPI.getById(id);
      if (res.data) setUser(res.data as AuthUser);
    }
    setLoading(false) 
  }
  carregarUsuario();
}, []);

  const login = async (userData: any) => {
    setUser(userData);
   await AsyncStorage.setItem('userId', String(userData.codUser));
   console.log('id de usuario salvo como: ', await AsyncStorage.getItem('usedId'))
  };

  const logout = async () => {
    setUser(null);
   await AsyncStorage.removeItem('userId');
   console.log('removido!')
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLogged: !!user,
      userName: user?.nomeCompleto ?? null,
      userId: user ? String(user.codUser) : null,
      loading,
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
