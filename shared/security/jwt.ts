/**
 * Utilidades para JWT (JSON Web Tokens)
 * Módulo compartido para la gestión de tokens JWT que pueden utilizar todos los servicios
 */

// NOTA: Para que este módulo funcione, es necesario instalar:
// npm install jsonwebtoken
// npm install --save-dev @types/jsonwebtoken
import * as jwt from 'jsonwebtoken';

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
  
  throw new Error('Método no implementado');
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
  
  throw new Error('Método no implementado');
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
  
  throw new Error('Método no implementado');
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
  
  throw new Error('Método no implementado');
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
  
  throw new Error('Método no implementado');
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
  
  throw new Error('Método no implementado');
}; 