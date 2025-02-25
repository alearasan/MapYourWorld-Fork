/**
 * Tipos específicos para el servicio de autenticación
 */

import { ISODateString, UUID, UserData, LoginCredentials, AuthResponse } from '@backend/types';

// Configuración del servicio de autenticación
export interface AuthServiceConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshTokenExpiresIn: string;
  passwordResetExpiresIn: string;
  passwordMinLength: number;
}

// Resultado de la verificación de token
export interface TokenVerificationResult {
  isValid: boolean;
  user?: UserData;
  error?: string;
}

// Almacenamiento de token en blacklist
export interface TokenBlacklist {
  token: string;
  expiresAt: ISODateString;
}

// Resultado de una operación de autenticación
export interface AuthResult {
  success: boolean;
  data?: AuthResponse;
  error?: string;
}

// Parámetros para la creación de tokens
export interface TokenPayload {
  user: UserData;
}

// Datos para validar contraseña
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
} 