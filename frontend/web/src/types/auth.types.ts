/**
 * Tipos de autenticación para el frontend web
 */

/** Datos del usuario en el token JWT */
export interface UserData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'premium';
  isPremium: boolean;
}

/** Estructura del token JWT decodificado */
export interface DecodedToken {
  user: UserData;
  iat: number;
  exp: number;
}

/** Credenciales para inicio de sesión */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/** Datos para registro de usuario */
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

/** Respuesta de autenticación con token */
export interface AuthResponse {
  token: string;
  user: UserData;
}

/** Estado de autenticación para el contexto/store */
export interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
  loading: boolean;
  error: string | null;
} 