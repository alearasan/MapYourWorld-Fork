/**
 * Tipos relacionados con la autenticación
 */

// Importamos los tipos comunes usando el alias @types
import { ISODateString, UUID, UserRole } from '@types';

/** Información básica del usuario */
export interface UserBase {
  id: UUID;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** Datos del usuario en el token JWT */
export interface UserData {
  userId: UUID;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
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
}

/** Datos para registro de usuario */
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/** Respuesta de autenticación */
export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserData;
}

/** Datos para verificación de email */
export interface EmailVerificationData {
  token: string;
  userId: UUID;
}

/** Datos para reseteo de contraseña */
export interface PasswordResetData {
  token: string;
  password: string;
}

/** Configuración JWT */
export interface JWTConfig {
  secret: string;
  expiresIn: string;
}

/** Sesión de usuario */
export interface UserSession {
  id: UUID;
  userId: UUID;
  token: string;
  expiresAt: ISODateString;
  lastActivity: ISODateString;
  deviceInfo?: string;
}

/** Evento de sesión de usuario */
export interface UserSessionEvent {
  type: 'login' | 'logout' | 'refresh' | 'expired';
  userId: UUID;
  timestamp: ISODateString;
  sessionId?: UUID;
}

/** Token de refresco */
export interface RefreshToken {
  id: UUID;
  userId: UUID;
  token: string;
  expiresAt: ISODateString;
  isRevoked: boolean;
  createdAt: ISODateString;
}

/** Solicitud de token de refresco */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/** Token de reseteo de contraseña */
export interface PasswordResetToken {
  id: UUID;
  userId: UUID;
  token: string;
  expiresAt: ISODateString;
  isUsed: boolean;
  createdAt: ISODateString;
}

/** Solicitud de reseteo de contraseña */
export interface PasswordResetRequest {
  email: string;
}

/** Solicitud para establecer nueva contraseña */
export interface PasswordSetRequest {
  token: string;
  password: string;
} 