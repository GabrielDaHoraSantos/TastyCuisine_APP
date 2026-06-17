/**
 * API Configuration
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

// Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/usuario/login`,
  REGISTER: `${API_BASE_URL}/usuario`,
  USUARIO_LOGIN: `${API_BASE_URL}/usuario/login`,

  // Receitas
  RECEITAS_ALL: `${API_BASE_URL}/receita/findAll`,
  RECEITAS: `${API_BASE_URL}/receita`,
  RECEITA_BY_ID: (id: string | number ) => `${API_BASE_URL}/receita/${id}`,
  
  // Usuários
  USUARIOS_ALL: `${API_BASE_URL}/usuario/findAll`,
  USUARIOS: `${API_BASE_URL}/usuario`,
  USUARIO_BY_ID: (id: string | number) => `${API_BASE_URL}/usuario/${id}`,
  
  // Livros
  LIVROS_ALL: `${API_BASE_URL}/livro/findAll`,
  LIVROS: `${API_BASE_URL}/livro`,
  LIVRO_BY_ID: (id: string | number) => `${API_BASE_URL}/livro/${id}`,
  LIVRO_BY_USER_ID: (id: string | number) => `${API_BASE_URL}/livro/usuario/${id}`,
  
  // Favoritos
  FAVORITOS_ALL: `${API_BASE_URL}/favorito/findAll`,
  FAVORITOS: `${API_BASE_URL}/favorito`,
  FAVORITO_BY_ID: (id: string | number) => `${API_BASE_URL}/favorito/${id}`,
  
  // Comentários
  COMENTARIOS_ALL: `${API_BASE_URL}/comentario/findAll`,
  COMENTARIOS: `${API_BASE_URL}/comentario`,
  COMENTARIO_BY_ID: (id: string | number) => `${API_BASE_URL}/comentario/${id}`,
  
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
    const response = await fetch(url, {
  ...options,
  headers: {
    'Content-Type': 'application/json',
    'bypass-tunnel-reminder': 'true',
    ...options?.headers,
  },
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

    const data = await response.json().catch(() => ({}));
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
  logout: async () => {}
}

export const reativarAPI = {
  reativar: (email: string, senha: string) =>
    apiCall(`${API_BASE_URL}/usuario/reativar`, {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    }),
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
  inativar: (id: string | number) =>
    apiCall(`${API_BASE_URL}/usuario/delete/${id}`, {
      method: 'PUT',
    }),
  ativar: (id: string | number) =>
    apiCall(`${API_BASE_URL}/usuario/${id}/ativar/`, {
      method: 'PUT',
    }),
    login: (email: string, senha: string) =>
    apiCall(API_ENDPOINTS.USUARIO_LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    }),
  reativar: (email: string, senha:string) =>
    apiCall(`${API_BASE_URL}/usuario/reativar`, {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    }),
}
// Favoritos API
export const favoritosAPI = {
  getAll: () => apiCall(API_ENDPOINTS.FAVORITOS_ALL),
  create: (data: any) => apiCall(API_ENDPOINTS.FAVORITOS, { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string | number) => apiCall(API_ENDPOINTS.FAVORITO_BY_ID(id), { method: 'DELETE' }),
}


export const categoriasAPI = {
  getAll: () => apiCall(API_ENDPOINTS.CATEGORIAS_ALL),
  create: (data: any) => apiCall(API_ENDPOINTS.CATEGORIAS, { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string | number) => apiCall(API_ENDPOINTS.CATEGORIA_BY_ID(id), { method: 'DELETE' }),
}

// Avaliações API
export const livrosAPI = {
  getAll: () => apiCall(API_ENDPOINTS.LIVROS_ALL),
  create: (data: any) => apiCall(API_ENDPOINTS.LIVROS, { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string | number) => apiCall(API_ENDPOINTS.LIVRO_BY_ID(id), { method: 'DELETE' }),
  getByiD:(id: number | string) => apiCall(API_ENDPOINTS.LIVRO_BY_ID(id), { method: 'GET' }),
  getByUserId:(id:number)=>apiCall(API_ENDPOINTS.LIVRO_BY_USER_ID(id), { method: 'GET' }),
  save:(data:any, id:number) => apiCall(API_ENDPOINTS.LIVRO_BY_ID(id), {method: 'PUT',body: JSON.stringify(data),}),
  addRecipeToBook: (codLivro:number, codReceita:number) =>apiCall(`${API_ENDPOINTS.LIVROS}/${codLivro}/receita/${codReceita}`,{ method: 'POST' }),
  removeRecipeFromBook: (codLivro:number, codReceita:number) =>apiCall(`${API_ENDPOINTS.LIVROS}/${codLivro}/receita/${codReceita}`,{ method: 'DELETE' }),
}

// Comentários API
export const comentariosAPI = {
  getAll: () => apiCall(API_ENDPOINTS.COMENTARIOS_ALL),
  create: (data: any) => apiCall(API_ENDPOINTS.COMENTARIOS, { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string | number) => apiCall(API_ENDPOINTS.COMENTARIO_BY_ID(id), { method: 'DELETE' }),
}
