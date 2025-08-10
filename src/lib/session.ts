// Gestión de sesiones en localStorage para PYME Credit AI
export interface UserSession {
  email: string;
  loggedIn: boolean;
  timestamp: string;
  nombre?: string;
}

const SESSION_KEY = 'pyme_credit_ai_session';

export const sessionManager = {
  // Crear sesión de usuario
  createSession: (email: string, nombre?: string): void => {
    const session: UserSession = {
      email,
      loggedIn: true,
      timestamp: new Date().toISOString(),
      nombre
    };
    
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      console.log('Sesión creada para:', email);
    } catch (error) {
      console.error('Error al crear sesión:', error);
    }
  },

  // Obtener sesión actual
  getSession: (): UserSession | null => {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (!sessionData) return null;
      
      const session: UserSession = JSON.parse(sessionData);
      
      // Verificar que la sesión no sea muy antigua (24 horas)
      const sessionTime = new Date(session.timestamp).getTime();
      const currentTime = new Date().getTime();
      const hoursDiff = (currentTime - sessionTime) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        sessionManager.clearSession();
        return null;
      }
      
      return session;
    } catch (error) {
      console.error('Error al obtener sesión:', error);
      return null;
    }
  },

  // Verificar si hay una sesión activa
  isLoggedIn: (): boolean => {
    const session = sessionManager.getSession();
    return session?.loggedIn === true;
  },

  // Obtener email del usuario logueado
  getUserEmail: (): string | null => {
    const session = sessionManager.getSession();
    return session?.email || null;
  },

  // Obtener nombre del usuario logueado
  getUserName: (): string | null => {
    const session = sessionManager.getSession();
    return session?.nombre || null;
  },

  // Limpiar sesión (logout)
  clearSession: (): void => {
    try {
      localStorage.removeItem(SESSION_KEY);
      console.log('Sesión eliminada');
    } catch (error) {
      console.error('Error al eliminar sesión:', error);
    }
  },

  // Actualizar datos de sesión
  updateSession: (updates: Partial<UserSession>): void => {
    const currentSession = sessionManager.getSession();
    if (!currentSession) return;
    
    const updatedSession = {
      ...currentSession,
      ...updates,
      timestamp: new Date().toISOString()
    };
    
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
      console.log('Sesión actualizada');
    } catch (error) {
      console.error('Error al actualizar sesión:', error);
    }
  }
};