/**
 * Servicio de autenticación para la aplicación móvil
 * Gestiona el inicio de sesión, registro y manejo de tokens
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  API_URL, 
  AUTH_STORAGE_KEY, 
  TOKEN_EXPIRY_BUFFER 
} from '@frontend/mobile/src/constants/config';

interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  isPremium: boolean;
  createdAt: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Token actual en memoria
 * Se modifica mediante funciones que asignan su contenido
 */
let currentTokens: AuthTokens | null = null;

/**
 * Usuario actual en memoria
 * Se modifica mediante funciones que asignan su contenido
 */
let currentUser: User | null = null;

/**
 * Registra un nuevo usuario
 * @param username Nombre de usuario
 * @param email Correo electrónico
 * @param password Contraseña
 */
export const register = async (
  username: string,
  email: string,
  password: string
): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en el registro');
    }

    const data = await response.json();
    
    // Guardar tokens
    currentTokens = {
      accessToken: data.token,
      refreshToken: data.refreshToken || data.token,
      expiresIn: data.expiresIn || 3600,
    };

    // Guardar en AsyncStorage
    await AsyncStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(currentTokens)
    );

    // Guardar usuario en memoria
    currentUser = data.user;
    
    return data.user;
  } catch (error) {
    throw error instanceof Error 
      ? error 
      : new Error('Error desconocido en el registro');
  }
};

/**
 * Inicia sesión con credenciales de usuario
 * @param email Correo electrónico o nombre de usuario
 * @param password Contraseña
 */
export const login = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en el inicio de sesión');
    }

    const data = await response.json();
    
    // Guardar tokens
    currentTokens = {
      accessToken: data.token,
      refreshToken: data.refreshToken || data.token,
      expiresIn: data.expiresIn || 3600,
    };

    // Guardar en AsyncStorage
    await AsyncStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(currentTokens)
    );

    // Guardar usuario en memoria
    currentUser = data.user;
    
    return data.user;
  } catch (error) {
    throw error instanceof Error 
      ? error 
      : new Error('Error desconocido en el inicio de sesión');
  }
};

/**
 * Cierra la sesión del usuario actual
 */
export const logout = async (): Promise<void> => {
  try {
    // Obtener una copia local de los tokens antes de limpiarlos
    const tokensToUse = currentTokens;
    
    // Eliminar tokens de AsyncStorage
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    
    // Limpiar variables en memoria
    currentTokens = null;
    currentUser = null;
    
    // Opcionalmente, notificar al servidor si hay un token válido
    if (tokensToUse?.accessToken) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokensToUse.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (serverError) {
        // Solo registramos el error, pero no lo propagamos
        console.error('Error al notificar cierre de sesión al servidor:', serverError);
      }
    }
  } catch (error) {
    throw error instanceof Error 
      ? error 
      : new Error('Error al cerrar sesión');
  }
};

/**
 * Verifica si hay una sesión activa al iniciar la app
 */
export const checkAuth = async (): Promise<User | null> => {
  try {
    // Obtener tokens de AsyncStorage
    const storedTokens = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    
    if (!storedTokens) {
      return null;
    }
    
    // Parsear tokens
    const tokens = JSON.parse(storedTokens) as AuthTokens;
    currentTokens = tokens;
    
    // Verificar si el token está expirado
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: tokens.accessToken,
      }),
    });
    
    if (!response.ok) {
      // Token inválido, intentar refrescar
      const refreshed = await refreshToken();
      
      if (!refreshed) {
        // No se pudo refrescar, cerrar sesión
        await logout();
        return null;
      }
    }
    
    const data = await response.json();
    currentUser = data.user;
    
    return currentUser;
  } catch (error) {
    console.error('Error al verificar autenticación:', error);
    return null;
  }
};

/**
 * Obtiene el token de acceso actual
 */
export const getAccessToken = async (): Promise<string | null> => {
  // Si hay token en memoria, verificar si está por expirar
  if (currentTokens) {
    // Implementar lógica para verificar expiración y refrescar si es necesario
    return currentTokens.accessToken;
  }
  
  // Intentar cargar de AsyncStorage
  try {
    const storedTokens = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    
    if (!storedTokens) {
      return null;
    }
    
    const parsedTokens = JSON.parse(storedTokens) as AuthTokens;
    currentTokens = parsedTokens;
    return currentTokens.accessToken;
  } catch (error) {
    console.error('Error al obtener token:', error);
    return null;
  }
};

/**
 * Refresca el token de acceso usando el token de refresco
 */
export const refreshToken = async (): Promise<AuthTokens | null> => {
  const tokens = currentTokens;
  if (!tokens?.refreshToken) {
    return null;
  }
  
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: tokens.refreshToken,
      }),
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    // Actualizar tokens
    currentTokens = {
      accessToken: data.token,
      refreshToken: data.refreshToken || data.token,
      expiresIn: data.expiresIn || 3600,
    };
    
    // Guardar en AsyncStorage
    await AsyncStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(currentTokens)
    );
    
    return currentTokens;
  } catch (error) {
    console.error('Error al refrescar token:', error);
    return null;
  }
};

/**
 * Solicita cambio de contraseña
 * @param email Correo electrónico del usuario
 */
export const requestPasswordReset = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/auth/password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error al solicitar cambio de contraseña:', error);
    return false;
  }
};

/**
 * Obtiene el usuario actual
 */
export const getCurrentUser = (): User | null => {
  return currentUser;
}; 