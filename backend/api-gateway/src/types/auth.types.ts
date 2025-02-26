/**
 * Tipos de autenticación para el API Gateway
 */

import { Request } from 'express';
import { ISODateString, UUID } from '@backend/types/common/common.types';

/** Datos del usuario en el token JWT */
export interface UserData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isPremium: boolean;
}

/** Estructura del token JWT decodificado */
export interface DecodedToken {
  user: UserData;
  iat: number;
  exp: number;
}

/** Interfaz extendida de Request para incluir usuario autenticado */
export interface AuthenticatedRequest extends Request {
  user?: UserData;
  token?: string;
} 