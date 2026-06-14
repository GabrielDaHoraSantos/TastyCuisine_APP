import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { avaliacoesAPI, comentariosAPI, favoritosAPI, receitasAPI, usuariosAPI } from './(auth)/api';

interface AuthUser {
  [x: string]: any;
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
  favoritos: any[];      
  recipes: any[];
  rating: string,
  getComentarios: (receitaId: string) => Promise<any[]>;
  enviarAvaliacao: (receitaId: number, nota: number, texto: string) => Promise<void>;
  toggleFavorito: (receitaId: string, codReceitas: number) => Promise<void>;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true)
  const [favoritos, setFavoritos] = useState<any[]>([])
  const [recipes, setRecipes] = useState<any[]>([])
  const [rating, setRating] = useState<string>("")

  useEffect(() => {
    async function carregarUsuario() {
      const id = await AsyncStorage.getItem('userId');
      if (id) {
        const res = await usuariosAPI.getById(id);
        if (res.data) setUser(res.data as AuthUser);
        await loadFavoritos(id);
        await loadRecipes() 
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

  async function loadFavoritos(userId: string) {
    const res = await favoritosAPI.getAll()
    if (res.data) {
      setFavoritos((res.data as any[]).filter(f => String(f.usuario?.codUser) === String(userId)))
    }
  }

  async function toggleFavorito(receitaId: string, codReceitas: number) {
  if (!user) return
  const jaExiste = favoritos.find(f => String(f.receita?.codReceitas) === String(receitaId))
  if (jaExiste) {
    await favoritosAPI.delete(String(jaExiste.codFavoritos))
    setFavoritos(prev => prev.filter(f => f.codFavoritos !== jaExiste.codFavoritos))
  } else {
    await favoritosAPI.create({ usuario: { codUser: Number(user.codUser) }, receita: { codReceitas } })
    await loadFavoritos(String(user.codUser)) // recarrega tudo do banco!
  }
}

  async function loadRecipes() {
  const res = await receitasAPI.getAll()
  if (res.data) setRecipes(res.data as any[])
}

async function getComentarios(receitaId: string) {
  const res = await fetch(`http://localhost:8080/comentario/receita/${receitaId}`)
  if (!res.ok) return []
  return await res.json()
}
async function enviarAvaliacao(receitaId: number, nota: number, texto: string) {
  await avaliacoesAPI.create({ usuario: { codUser: Number(user?.codUser) }, receita: { codReceitas: receitaId }, nota })
  await comentariosAPI.create({ usuario: { codUser: Number(user?.codUser) }, receita: { codReceitas: receitaId }, texto })
}

  return (
    <AuthContext.Provider value={{
      user,
      isLogged: !!user,
      userName: user?.nomeCompleto ?? null,
      userId: user ? String(user.codUser) : null,
      loading,
      favoritos,           
      toggleFavorito,
      recipes,
      rating,
      login,
      logout,
      getComentarios,
      enviarAvaliacao,
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
