/**
 * Archivo principal que exporta todos los tipos organizados por servicio
 */

// Exportar tipos comunes directamente para facilitar el acceso
export type {
  UUID,
  ISODateString,
  GeoCoordinates,
  UserRole,
  EntityStatus,
  PaginationParams,
  PaginatedResponse,
  ApiError
} from './common/common.types';

// Tipos específicos por servicio 
export type * as Auth from './auth/auth.types';
export type * as Map from './map/map.types';
export type * as User from './user/user.types';
export type * as Social from './social/social.types';
export type * as Notification from './notification/notification.types'; 