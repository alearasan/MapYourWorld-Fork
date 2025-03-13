/**
 * Utilidades para JWT (JSON Web Tokens)
 * Módulo compartido para la gestión de tokens JWT que pueden utilizar todos los servicios
 */

// NOTA: Para que este módulo funcione, es necesario instalar:
// npm install jsonwebtoken
// npm install --save-dev @types/jsonwebtoken
import * as jwt from 'jsonwebtoken';
import { UserData } from '../config/jwt.config';
import { BlacklistedToken } from '../../backend/auth-service/src/models/blacklisted_token.model';
import { AppDataSource } from '../../backend/database/appDataSource';
import * as crypto from 'crypto';

// Implementación propia para no depender de lodash
// Reemplaza a import { isObject } from 'lodash';
function isObject(value: any): boolean {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Estructura del payload de un token JWT
 */
export interface JWTPayload {
  sub: string;            // Subject (generalmente el ID del usuario)
  iss?: string;           // Issuer (emisor)
  aud?: string | string[]; // Audience (audiencia)
  exp?: number;           // Expiration time (tiempo de expiración)
  iat?: number;           // Issued at (tiempo de emisión)
  nbf?: number;           // Not before (no válido antes de)
  jti?: string;           // JWT ID (identificador único)
  [key: string]: any;     // Datos adicionales
}

/**
 * Opciones para la generación de tokens
 */
export interface JWTOptions {
  expiresIn?: string | number;  // Tiempo de expiración
  issuer?: string;              // Emisor
  audience?: string | string[]; // Audiencia
  subject?: string;             // Asunto (generalmente ID de usuario)
  notBefore?: string | number;  // No válido antes de
  jwtid?: string;               // ID único del token
  algorithm?: string;           // Algoritmo de firma (por defecto HS256)
}

/**
 * Opciones para la verificación de tokens
 */
export interface JWTVerifyOptions {
  issuer?: string | string[];           // Emisor
  audience?: string | string[];         // Audiencia
  subject?: string;                     // Asunto
  algorithms?: string[];                // Algoritmos permitidos
  ignoreExpiration?: boolean;           // Ignorar expiración
  maxAge?: string | number;             // Edad máxima del token
  clockTimestamp?: number;              // Timestamp personalizado
  clockTolerance?: number;              // Tolerancia de reloj (segundos)
}

/**
 * Resultado de la verificación de un token
 */
export interface JWTVerifyResult<T = any> {
  valid: boolean;
  payload?: T & JWTPayload;
  error?: Error;
}

/**
 * Genera un token JWT
 * @param payload Datos a incluir en el token
 * @param secret Clave secreta para firmar el token
 * @param options Opciones de generación
 * @returns Token JWT generado
 */
export const generateToken = (
  payload: JWTPayload | object,
  secret: string,
  options: JWTOptions = {}
): string => {
  // TODO: Implementar generación de token
  // 1. Validar que el payload sea un objeto
  // 2. Asegurar que tiene los campos necesarios
  // 3. Usar jwt.sign para crear el token
  // 4. Devolver el token generado
  if (!isObject(payload)) {
    throw new Error('Payload debe ser un objeto');
  }
  
  // Crear payload base si no tiene el campo 'sub' requerido
  const tokenPayload = { ...payload };
  if (!('sub' in tokenPayload) && options.subject) {
    tokenPayload.sub = options.subject;
  }
  
  return jwt.sign(tokenPayload, secret, options as jwt.SignOptions);
};

/**
 * Verifica un token JWT
 * @param token Token JWT a verificar
 * @param secret Clave secreta para verificar la firma
 * @param options Opciones de verificación
 * @returns Resultado de la verificación con payload si es válido
 */
export const verifyToken = <T = any>(
  token: string,
  secret: string,
  options: JWTVerifyOptions = {}
): JWTVerifyResult<T> => {
  // TODO: Implementar verificación de token
  // 1. Comprobar que el token no esté vacío
  // 2. Intentar verificar con jwt.verify
  // 3. Devolver resultado con payload si es válido
  // 4. Capturar y devolver errores si los hay
  if (!token) {
    return {
      valid: false,
      error: new Error('Token vacío o no proporcionado')
    };
  }

  try {
    const payload = jwt.verify(token, secret, options as jwt.VerifyOptions) as unknown as T & JWTPayload;
    return {
      valid: true,
      payload
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error : new Error('Error desconocido al verificar token')
    };
  }  
};

/**
 * Decodifica un token JWT sin verificar la firma
 * @param token Token JWT a decodificar
 * @returns Payload decodificado o null si no es válido
 */
export const decodeToken = <T = any>(token: string): (T & JWTPayload) | null => {
  // TODO: Implementar decodificación de token
  // 1. Comprobar que el token no esté vacío
  // 2. Usar jwt.decode para obtener el payload
  // 3. Devolver el payload tipado o null
  if (!token) {
    return null;
  }
  
  const decoded = jwt.decode(token);
  return decoded && isObject(decoded) ? decoded as T & JWTPayload : null;
};

/**
 * Comprueba si un token está expirado
 * @param token Token JWT o payload decodificado
 * @param clockTolerance Tolerancia en segundos (por defecto 0)
 * @returns true si el token está expirado
 */
export const isTokenExpired = (
  token: string | JWTPayload,
  clockTolerance: number = 0
): boolean => {
  // TODO: Implementar comprobación de expiración
  // 1. Si es un string, decodificarlo primero
  // 2. Comprobar si tiene campo de expiración
  // 3. Comparar con la hora actual considerando la tolerancia
  const payload = typeof token === 'string' ? decodeToken(token) : token;
  
  if (!payload || typeof payload.exp !== 'number') {
    return true; // Si no hay payload o fecha de expiración, consideramos expirado
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp <= currentTime - clockTolerance;  
};

/**
 * Extrae el ID de usuario (subject) de un token
 * @param token Token JWT o payload decodificado
 * @returns ID de usuario o null si no existe
 */
export const extractUserId = (token: string | JWTPayload): string | null => {
  // TODO: Implementar extracción de ID
  // 1. Si es un string, decodificarlo primero
  // 2. Devolver el subject (sub) o null
  const payload = typeof token === 'string' ? decodeToken(token) : token;
  
  if (!payload || !payload.sub) {
    return null;
  }
  
  return payload.sub;
};

/**
 * Calcula el tiempo restante de validez de un token en segundos
 * @param token Token JWT o payload decodificado
 * @returns Segundos restantes o 0 si está expirado
 */
export const getRemainingTime = (token: string | JWTPayload): number => {
  // TODO: Implementar cálculo de tiempo restante
  // 1. Si es un string, decodificarlo primero
  // 2. Calcular diferencia entre expiración y hora actual
  // 3. Devolver máximo entre 0 y el tiempo calculado
  const payload = typeof token === 'string' ? decodeToken(token) : token;
  
  if (!payload || typeof payload.exp !== 'number') {
    return 0;
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - currentTime);
};

/**
 * Genera un token de actualización (refresh token)
 * @param userId ID del usuario
 * @param expiresIn Tiempo de expiración (por defecto 7 días)
 * @returns Token de actualización
 */
export const generateRefreshToken = (userId: string, secret: string, expiresIn: string = '7d'): string => {
  // TODO: Implementar la generación de refresh token
  // 1. Crear un payload mínimo con el ID del usuario
  // 2. Configurar una expiración más larga que el token principal
  // 3. Firmar con una clave secreta diferente o la misma
  // 4. Retornar el refresh token
  // Crear un payload mínimo con el ID del usuario
  const payload = {
    sub: userId,
    type: 'refresh' // Indicar que es un token de actualización
  };
  
  // Usar una expiración más larga que el token de acceso normal
  const options: JWTOptions = {
    expiresIn,
    jwtid: `refresh_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
  };
  
  // Generar el token de actualización usando la función generateToken existente
  return generateToken(payload, secret, options);  
};

export const renewToken = (refreshToken: string, userData: UserData): string | null => {
  // TODO: Implementar la renovación de token
  // 1. Verificar el refresh token
  // 2. Si es válido, generar un nuevo token JWT
  // 3. Si no es válido, retornar null
  // Use the secret from environment or a fallback for development
  const secret = process.env.JWT_SECRET || 'development-secret-key';
  
  try {
    // Verify the refresh token
    const result = verifyToken(refreshToken, secret);
    
    if (!result.valid || !result.payload) {
      return null;
    }
    
    // Check if it's actually a refresh token
    if (result.payload.type !== 'refresh') {
      return null;
    }
    
    // Generate a new access token with user data
    const payload = {
      sub: userData.userId,
      user: userData
    };
    
    // Use a shorter expiration for the access token
    return generateToken(payload, secret, { expiresIn: '1h' });
  } catch (error) {
    console.error('Error renewing token:', error);
    return null;
  }  
};

/**
 * Añade un token a la lista negra (para cierre de sesión)
 * @param token Token a invalidar
 * @returns true si se añadió correctamente
 */
export const blacklistToken = async (token: string): Promise<boolean> => {
  // TODO: Implementar blacklist de tokens
  // 1. Extraer la expiración del token
  // 2. Guardar el token en una base de datos o caché (Redis)
  // 3. Establecer TTL hasta la expiración para limpieza automática
  try {
    // Decode the token to get its expiration time
    const decoded = decodeToken(token);
    
    if (!decoded || !decoded.exp) {
      return false;
    }
    
    // Generate hash of the token for secure storage
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(decoded.exp * 1000); // Convert to milliseconds
    
    // Get repository for blacklisted tokens
    const blacklistRepo = AppDataSource.getRepository(BlacklistedToken);
    
    // Insert token hash into the blacklist
    await blacklistRepo.save({
      tokenHash,
      expiresAt
    });
    
    return true;
  } catch (error) {
    console.error('Error blacklisting token:', error);
    return false;
  }
};

/**
 * Verifica si un token está en la lista negra
 * @param token Token a verificar
 * @returns true si el token está en la lista negra
 */
export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  // TODO: Implementar verificación de blacklist
  // 1. Comprobar si el token existe en la base de datos o caché
  try {
    // Calculate token hash
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    // Get repository for blacklisted tokens
    const blacklistRepo = AppDataSource.getRepository(BlacklistedToken);
    
    // Check if token exists in the blacklist
    const blacklistedToken = await blacklistRepo.findOne({
      where: { tokenHash }
    });
    
    return blacklistedToken !== null;
  } catch (error) {
    console.error('Error checking blacklisted token:', error);
    return false;
  } 
}; 