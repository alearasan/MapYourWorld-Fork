/**
 * Definiciones de tipos compartidas para modelos de usuario
 * Estas definiciones son utilizadas por múltiples servicios
 */

import { UUID, ISODateString, UserRole } from '@types';
import { UserProfile, UserPreferences, UserStats } from './user.types';

export namespace UserModel {
  // Datos básicos de usuario para autenticación y gestión
  export interface IUserBase {
    userId: UUID;
    email: string;
    firstName: string;
    lastName: string;
    plan: 'free' | 'premium';
    active: boolean;
    lastLogin: ISODateString; 
    createdAt: ISODateString;
    updatedAt: ISODateString;
    role: UserRole;
  }
  
  // Para uso en la creación de usuarios
  export interface IUserCreate {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    plan?: 'free' | 'premium';
    role?: UserRole;
    active?: boolean;
  }
  
  // Modelo completo que incluye datos básicos y perfil
  export interface IUserComplete extends IUserBase {
    profile?: Omit<UserProfile, 'userId' | 'createdAt' | 'updatedAt'>;
    preferences?: Omit<UserPreferences, 'userId' | 'updatedAt'>;
    stats?: Omit<UserStats, 'userId'>;
  }
  
  // Para respuestas de API
  export interface IUserResponse {
    userId: UUID;
    email: string;
    firstName: string;
    lastName: string;
    plan: 'free' | 'premium';
    active: boolean;
    role: UserRole;
    lastLogin?: ISODateString;
    createdAt?: ISODateString;
    updatedAt?: ISODateString;
    profile?: Omit<UserProfile, 'userId' | 'createdAt' | 'updatedAt'>;
  }
}