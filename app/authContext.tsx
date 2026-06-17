import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { comentariosAPI, favoritosAPI, receitasAPI, usuariosAPI } from './(auth)/api';

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
  getComentarios: (receitaId: string) => Promise<any[]>;
  enviarComentario: (receitaId: number, nota: number, texto: string) => Promise<void>;
  toggleFavorito: (receitaId: string, codReceitas: number) => Promise<void>;
  login: (email: string, senha: string) => Promise<{ ok: boolean; error?: string }>;
  alterarStatus: (usuarioId:number) =>Promise<void>;
  reativar:(email: string, senha:string) =>Promise<{ ok: boolean }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true)
  const [favoritos, setFavoritos] = useState<any[]>([])
  const [recipes, setRecipes] = useState<any[]>([])

  useEffect(() => {
    async function carregarUsuario() {
      const id = await AsyncStorage.getItem('userId');
      if (id) {
        await loadFavoritos(id);
        await loadRecipes() 
        const res = await usuariosAPI.getById(id);
        if (res.data) setUser(res.data as AuthUser);
        console.log(recipes)
      }
      setLoading(false)
    }
    carregarUsuario();
  }, []);

  const login = async (email: string, senha: string) => {
  try {
    const res = await usuariosAPI.login(email, senha)
    if (res.data) {
      const userData = res.data as AuthUser
      if (userData.funcao !== 'Usuario') {
        return { ok: false, error: 'ACESSO_NEGADO' }
      }
      setUser(userData)
      await AsyncStorage.setItem('userId', String(userData.codUser))
      await loadFavoritos(String(userData.codUser))
      return { ok: true }
    }
    if (res.status === 403) return { ok: false, error: 'CONTA_INATIVA' }
    return { ok: false, error: 'EMAIL_OU_SENHA_INCORRETOS' }
  } catch {
    return { ok: false, error: 'ERRO_CONEXAO' }
  }
}

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

// depois — também troca a URL para usar a variável de ambiente
async function getComentarios(receitaId: string) {
  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080'}/comentario/receita/${receitaId}`, {
    headers: {
      'Content-Type': 'application/json',
      'bypass-tunnel-reminder': 'true',
    },
  })
  if (!res.ok) return []
  return await res.json()
}
async function enviarComentario(receitaId: number, nota: number, texto: string) {
  await comentariosAPI.create({ usuario: { codUser: Number(user?.codUser) }, receita: { codReceitas: receitaId }, texto, nota })
}

async function alterarStatus(usuarioId: number) {
  await usuariosAPI.inativar(String(usuarioId))
  logout()
}
async function reativar (email: string, senha:string) {
  const res = await usuariosAPI.reativar(email, senha);
  if (res.data) {
    setUser(res.data as AuthUser)
    await AsyncStorage.setItem('userId', String((res.data as AuthUser).codUser))
    return { ok: true }
  }
  return { ok: false }
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
      login,
      reativar,
      alterarStatus,
      logout,
      getComentarios,
      enviarComentario,
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
