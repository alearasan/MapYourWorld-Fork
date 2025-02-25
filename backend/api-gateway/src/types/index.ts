/**
 * Re-exportación de todos los tipos del API Gateway
 */

// Definir tipos comunes localmente para evitar referencias fuera del rootDir
// Representa una fecha en formato ISO 8601
export type ISODateString = string;

// Representa un ID único
export type UUID = string;

// Coordenadas geográficas
export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

// Enumeración de roles de usuario
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

// Estado de una entidad
export enum EntityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
  PENDING = 'pending'
}

// Parámetros de paginación
export interface PaginationParams {
  page: number;
  limit: number;
}

// Respuesta paginada
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export * from './auth.types';
export * from './circuit-breaker.types';
export * from './cache.types';
export * from './metrics.types'; 