/**
 * Re-exportación de tipos para el servicio de autenticación
 */

import { Request } from 'express';

// Importar desde la estructura centralizada de tipos usando alias
import { ISODateString, UUID, Auth } from '@types';

// Extendiendo tipos para uso específico del servicio

/** Solicitud autenticada con datos de usuario */
export interface AuthenticatedRequest extends Request {
  user?: Auth.UserData;
  token?: string;
}

/** Respuesta estándar del controlador de autenticación */
export interface AuthControllerResponse {
  success: boolean;
  message: string;
  data?: any;
  token?: string;
  statusCode: number;
}

/** Evento de registro de usuario */
export interface UserRegisteredEvent {
  eventType: 'USER_REGISTERED';
  timestamp: string;
  data: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

/** Evento de inicio de sesión */
export interface UserLoggedInEvent {
  eventType: 'USER_LOGGED_IN';
  timestamp: string;
  data: {
    userId: string;
    email: string;
    loginTime: string;
    deviceInfo?: string;
  };
}

/** Usuario con datos de autenticación */
export interface AuthUser {
  id: UUID;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerificationToken?: string;
  failedLoginAttempts?: number;
  lastFailedLogin?: Date;
  lockedUntil?: Date;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** Configuración del servicio de autenticación */
export interface AuthServiceConfig {
  port: number;
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptSaltRounds: number;
  passwordMinLength: number;
  maxLoginAttempts: number;
  lockTime: number; // en minutos
}

/** Resultado de verificación de token */
export interface TokenVerificationResult {
  valid: boolean;
  decoded?: Auth.DecodedToken;
  error?: string;
} 