import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { comentariosAPI, favoritosAPI, livrosAPI, receitasAPI, usuariosAPI } from './(auth)/api';

interface AuthUser {
  [x: string]: any;
  codUser: number;
  nome_completo: string;
  nome_de_usuario: string;
  gmail: string;
  idade: number;
  restricoesAlimentares?: string;
  Status_Usuario?: string;
  bloqueado:number;
}

export interface Livro {
  codLivro: number;
  nomeLivro: string;
  receitas: ReceitaLivro[];
  fotoLivro: string | null;
  usuario: AuthUser;
}
interface ReceitaLivro {
  codReceitas: number;
  nomeReceita: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLogged: boolean;
  userName: string | null;
  userId: string | null;
  loading: boolean;
  favoritos: any[];      
  recipes: any[];
  updateUser: (novoUsuario: AuthUser) => void;
  addRecipeToBook: (codLivro:number,codReceita:number)=> Promise<{ok:boolean; error?:string}>;
  removeRecipeFromBook:(codLivro:number,codReceita:number)=> Promise<{ok:boolean; error?:string}>;
  createBook: (data: any) => Promise<{ ok: boolean; error?: string }>;
  deleteBook:(id: number) => Promise<{ok:boolean; error?:string}>;
  getBookbyId: (id: number)  => Promise<{ok:boolean; error?:string; book?:Livro}>;
  getBookbyUserId: (id:number) => Promise<{ok:boolean; error?:string; livros?:Livro[]}>;
  updateBook:(data: Livro, id: number) => Promise<{ok:boolean; error?:string}>
  register: (nomeCompleto: string, nomeDeUsuario: string, idade: number, gmail: string, senha: string) => Promise<{ ok: boolean; error?: string }>;

  updateUserData: (user: AuthUser) => void;
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
      
      // 💡 CORRIGIDO: Agora retorna a string de identificação correta!
      if (userData.bloqueado) {
        console.error("Bloqueado pelo Admin")
        return { ok: false, error: 'CONTA_BLOQUEADA' } 
      }
      
      setUser(userData)
      await AsyncStorage.setItem('userId', String(userData.codUser))
      await loadFavoritos(String(userData.codUser))
      await loadRecipes()
      return { ok: true }
    }
    
    if (res.status === 403) return { ok: false, error: 'CONTA_INATIVA' }
    return { ok: false, error: 'EMAIL_OU_SENHA_INCORRETOS' }
  } catch {
    return { ok: false, error: 'ERRO_CONEXAO' }
  }
}
const updateUserData = (updatedUser: AuthUser) => {
  setUser(updatedUser);
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
  try {
    const receitas = await receitasAPI.getAll(); 
    
    if (receitas.status === 200 && Array.isArray(receitas.data)){
      const listaCompleta = receitas.data as any[];
      
      // 1. Filtra a lista para manter APENAS as que estão 'ATIVO'
      const receitasAtivas = listaCompleta.filter((receita: any) => {
        if (receita.status_receita === 'ATIVO') {
          return true; // Mantém na lista
        } else {
          console.log(`A receita ${receita.nomeReceita} está inativa.`);
          return false; // Remove da lista
        }
      });

      // 2. Salva no estado apenas as receitas filtradas (ativas)
      setRecipes(receitasAtivas);
    };
  } catch (error) {
    console.error("Erro ao buscar receitas:", error);
  }
}

async function getComentarios(receitaId: string) {
  try {
    // 1. Chama a API padronizada
    const resposta = await comentariosAPI.getByReceitaId(receitaId);
    
    // 2. Verifica se a resposta deu certo (status 200) e se os dados existem
    if (resposta.status === 200 && resposta.data){
      const comentarios = resposta.data as any[];
      const comentariosAtivos = comentarios.filter((comentario: any) => {
        if (comentario.status_comentarios === 'ATIVO') {
          return true; // Mantém na lista
        } else {
          console.log(`O comentario está inativa.`);
          return false; // Remove da lista
        }
      });
      return comentariosAtivos as any[]; 
    }
    
    return [];
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    return []; 
  }
}

async function enviarComentario(receitaId: number, nota: number, texto: string) {
  await comentariosAPI.create({ usuario: { codUser: Number(user?.codUser) }, receita: { codReceitas: receitaId }, texto, nota,status_comentarios: 'ATIVO' })
}

async function alterarStatus(usuarioId: number) {
  await usuariosAPI.inativar(String(usuarioId))
  logout()
}

const updateUser = (novoUsuario: AuthUser) => {
  setUser(novoUsuario);
};
async function reativar (email: string, senha:string) {
  const res = await usuariosAPI.reativar(email, senha);
  if (res.data) {
    setUser(res.data as AuthUser)
    await AsyncStorage.setItem('userId', String((res.data as AuthUser).codUser))
    return { ok: true }
  }
  return { ok: false }
}
async function register(nome_completo: string, nome_de_usuario: string, idade: number, gmail: string, senha: string) {
  const res = await usuariosAPI.create({
    nome_completo,
    nome_de_usuario,
    idade,
    gmail,
    senha,
    funcao: 'Usuario',
    status_Usuario: 'ATIVO'
  })
  if (res.data) {
    setUser(res.data as AuthUser)
    await AsyncStorage.setItem('userId', String((res.data as AuthUser).codUser))
    return { ok: true }
  }
  return { ok: false, error: res.error }
}

async function createBook(nome: string) {
  const result = await livrosAPI.create({
    nomeLivro: nome,
    usuario:{codUser: Number(user?.codUser)}})
  if(result.data){
    return {ok:true}
  }
  return {ok: false, error:result.error}
}

async function deleteBook(id: number){
  const result = await livrosAPI.delete(id);
  if(result.data){
    return {ok:true}
  }
  return {ok:false,error:result.error}
}

const getBookbyId = async (id: number) => {
  try {
    const response = await livrosAPI.getByiD(id);

    return {
      ok: true,
      book: response.data as Livro,
    };
  } catch (error: any) {
    return {
      ok: false,
      error: error.message,
    };
  }
};

async function getBookbyUserId(id:number){
  const result = await livrosAPI.getByUserId(id);
  if(result.data){
    return {livros: result.data as Livro[], ok: true}
  }
  return {ok:false,error:result.error}
}

async function updateBook(data: Livro, id: number){
  const result = await livrosAPI.save(data,id);
  if(result.data){
    return {ok:true}
  }
  return {ok:false,error:result.error}
}

async function addRecipeToBook(
  codLivro:number,
  codReceita:number
){
  const result = await livrosAPI.addRecipeToBook(
    codLivro,
    codReceita
  );

  if(result.data){
    return { ok:true };
  }

  return {
    ok:false,
    error: result.error
  };
}

async function removeRecipeFromBook(
  codLivro:number,
  codReceita:number
){
  const result =
    await livrosAPI.removeRecipeFromBook(
      codLivro,
      codReceita
    );

  if(result.data){
    return { ok:true };
  }

  return {
    ok:false,
    error: result.error
  };
}

  return (
    <AuthContext.Provider value={{
      user,
      isLogged: !!user,
      userName: user?.nome_completo ?? null,
      userId: user ? String(user.codUser) : null,
      loading,
      favoritos,           
      toggleFavorito,
      recipes,
      login,
      reativar,
      alterarStatus,
      logout,
      removeRecipeFromBook,
      addRecipeToBook,
      updateBook,
      createBook,
      deleteBook,
      getBookbyId,
      getBookbyUserId,
      register,
      getComentarios,
      enviarComentario,
      updateUserData,
      updateUser,
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
