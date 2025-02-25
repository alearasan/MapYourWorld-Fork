/**
 * Configuración de JWT para el servicio de autenticación
 */

import { Auth } from '@types';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración por defecto para JWT
export const jwtConfig: Auth.JWTConfig = {
  secret: process.env.JWT_SECRET || 'development-secret-key',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h'
};

/**
 * Extrae el token JWT del header de autorización
 * @param authHeader - Header de autorización
 * @returns El token JWT o null si no existe
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }
  
  return null;
}; 