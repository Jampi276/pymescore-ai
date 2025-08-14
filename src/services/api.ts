// Servicios API para conectar con el backend Flask de PYME Credit AI
const API_BASE_URL = 'http://localhost:5000/api';

// Configuración para fetch con timeout
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout: number = 20000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Tipos de respuesta de la API
export interface ApiResponse<T = any> {
  resultado?: string;
  exists?: boolean;
  message?: string;
  error?: string;
  success?: boolean;
  data?: T;
  [key: string]: any;
}

export interface ScoringResponse {
  secciones: {
    financiera: string[];
    digital: string[];
    referencias: string[];
  };
  riesgos: Array<{
    tipo: string;
    nivel: string;
    descripcion: string;
  }>;
  scoring: {
    nivel: string;
    umbral: number;
    puntuacion?: number;
    factores_positivos?: string[];
    factores_negativos?: string[];
    recomendaciones?: string[];
  };
}

export interface ChatResponse {
  salida: string;
  sessionId: string;
}

export interface SocialData {
  url: string;
  titulo: string;
  descripcion: string;
  texto_principal: string;
  indicadores_comerciales: string[];
  sentimiento: {
    clasificacion: string;
    puntos_positivos: number;
    puntos_negativos: number;
    confianza: number;
  };
  reviews_count: number;
  tipo_sitio: string;
}

// Servicios de API
export const apiService = {
  // Registro de usuario
  registrarUsuario: async (nombre: string, email: string, password: string): Promise<ApiResponse> => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/register`, {
        method: 'POST',
        body: JSON.stringify({ nombre, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error en el registro');
      }
      
      return data;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  },

  // Inicio de sesión
  iniciarSesionUsuario: async (email: string, password: string): Promise<ApiResponse> => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error en el inicio de sesión');
      }
      
      return data;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  },

  // Validar RUC
  validarRuc: async (ruc: string): Promise<ApiResponse> => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/validate-ruc`, {
        method: 'POST',
        body: JSON.stringify({ ruc }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al validar RUC');
      }
      
      return data;
    } catch (error) {
      console.error('Error al validar RUC:', error);
      throw error;
    }
  },

  // Scraping de red social
  scrapeSocial: async (social_url: string): Promise<ApiResponse<SocialData>> => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/scrape-social`, {
        method: 'POST',
        body: JSON.stringify({ social_url }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error en el scraping social');
      }
      
      return data;
    } catch (error) {
      console.error('Error en scraping social:', error);
      throw error;
    }
  },

  // Análisis de documentos
  analizarDocumentos: async (pdfFile: File, datos_sociales?: any): Promise<ScoringResponse> => {
    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);
      
      if (datos_sociales) {
        formData.append('datos_sociales', JSON.stringify(datos_sociales));
      }
      
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error en el análisis');
      }
      
      return data;
    } catch (error) {
      console.error('Error al analizar documentos:', error);
      throw error;
    }
  },

  // Chat con documentos
  chatDemo: async (chatInput: string, sessionId?: string): Promise<ChatResponse> => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/chat`, {
        method: 'POST',
        body: JSON.stringify({ chatInput, sessionId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error en el chat');
      }
      
      return data;
    } catch (error) {
      console.error('Error en el chat:', error);
      throw error;
    }
  },

  // Simulación de escenarios
  simularScenario: async (escenario_datos: any): Promise<ApiResponse> => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/simulate`, {
        method: 'POST',
        body: JSON.stringify({ escenario_datos }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error en la simulación');
      }
      
      return data;
    } catch (error) {
      console.error('Error al simular escenario:', error);
      throw error;
    }
  },

  // Verificar conexión con el backend
  verificarConexion: async (): Promise<boolean> => {
    try {
      const response = await fetchWithTimeout('http://localhost:5000/', {
        method: 'GET',
      }, 5000);
      
      return response.ok;
    } catch (error) {
      console.error('Backend Flask no está disponible:', error);
      return false;
    }
  }
};