/**
 * API Configuration
 * Centralized API endpoints and utilities for communicating with the Tasty Cuisine backend
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

// Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,

  // Receitas
  RECEITAS_ALL: `${API_BASE_URL}/receita/findAll`,
  RECEITAS: `${API_BASE_URL}/receita`,
  RECEITA_BY_ID: (id: string | number ) => `${API_BASE_URL}/receita/${id}`,
  
  // Usuários
  USUARIOS_ALL: `${API_BASE_URL}/usuario/findAll`,
  USUARIOS: `${API_BASE_URL}/usuario`,
  USUARIO_BY_ID: (id: string | number) => `${API_BASE_URL}/usuario/${id}`,
  
  // Chefes
  CHEFES_ALL: `${API_BASE_URL}/chefe/findAll`,
  CHEFES: `${API_BASE_URL}/chefe`,
  CHEFE_BY_ID: (id: string | number) => `${API_BASE_URL}/chefe/${id}`,
  
  // Favoritos
  FAVORITOS_ALL: `${API_BASE_URL}/favorito/findAll`,
  FAVORITOS: `${API_BASE_URL}/favorito`,
  FAVORITO_BY_ID: (id: string | number) => `${API_BASE_URL}/favorito/${id}`,
  
  // Avaliações
  AVALIACOES_ALL: `${API_BASE_URL}/avaliacao/findAll`,
  AVALIACOES: `${API_BASE_URL}/avaliacao`,
  AVALIACAO_BY_ID: (id: string | number) => `${API_BASE_URL}/avaliacao/${id}`,
  
  // Comentários
  COMENTARIOS_ALL: `${API_BASE_URL}/comentario/findAll`,
  COMENTARIOS: `${API_BASE_URL}/comentario`,
  COMENTARIO_BY_ID: (id: string | number) => `${API_BASE_URL}/comentario/${id}`,
  
  // Acesso (CRUD de acessos)
  ACESSOS_ALL: `${API_BASE_URL}/acesso/findAll`,
  ACESSOS: `${API_BASE_URL}/acesso`,
  ACESSO_BY_ID: (id: string | number) => `${API_BASE_URL}/acesso/${id}`,
  
  // Categorias
  CATEGORIAS_ALL: `${API_BASE_URL}/categoria/findAll`,
  CATEGORIAS: `${API_BASE_URL}/categoria`,
  CATEGORIA_BY_ID: (id: string | number) => `${API_BASE_URL}/categoria/${id}`,
}

// Utility function to make API calls with error handling
export async function apiCall<T>(
  url: string,
  options?: RequestInit
): Promise<{ data?: T; error?: string; status: number }> {
  try {
    const token = await AsyncStorage.getItem('userToken');
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorText;
      } catch (e) {
        // Not JSON
      }
      return { error: errorMessage, status: response.status }
    }

    const data = await response.json()
    return { data, status: response.status }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 0,
    }
  }
}

// Auth API
export const authAPI = {
  login: (credentials: any) => 
    apiCall(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  register: (userData: any) =>
    apiCall(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  logout: async () => {
    await AsyncStorage.multiRemove(['userToken', 'isLogged', 'userId', 'userName']);
  }
}

// Receitas API
export const receitasAPI = {
  getAll: () => apiCall(API_ENDPOINTS.RECEITAS_ALL),
  getById: (id: string | number) => apiCall(API_ENDPOINTS.RECEITA_BY_ID(id)),
  create: (data: any) =>
    apiCall(API_ENDPOINTS.RECEITAS, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string | number, data: any) =>
    apiCall(API_ENDPOINTS.RECEITA_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string | number) =>
    apiCall(API_ENDPOINTS.RECEITA_BY_ID(id), {
      method: 'DELETE',
    }),
}

// Usuários API
export const usuariosAPI = {
  getAll: () => apiCall(API_ENDPOINTS.USUARIOS_ALL),
  getById: (id: string | number) => apiCall(API_ENDPOINTS.USUARIO_BY_ID(id)),
  create: (data: any) =>
    apiCall(API_ENDPOINTS.USUARIOS, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string | number, data: any) =>
    apiCall(API_ENDPOINTS.USUARIO_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string | number) =>
    apiCall(API_ENDPOINTS.USUARIO_BY_ID(id), {
      method: 'DELETE',
    }),
}

// Favoritos API (simplificado para brevidade, mantendo a estrutura)
export const favoritosAPI = {
  getAll: () => apiCall(API_ENDPOINTS.FAVORITOS_ALL),
  create: (data: any) => apiCall(API_ENDPOINTS.FAVORITOS, { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string | number) => apiCall(API_ENDPOINTS.FAVORITO_BY_ID(id), { method: 'DELETE' }),
}
