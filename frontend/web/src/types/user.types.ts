/**
 * Tipos de usuario para el frontend web
 */

// Tipo para fechas ISO
export type ISODateString = string;

/** Roles de usuario en el sistema */
export enum UserRole {
  USER = 'user',
  PREMIUM = 'premium',
  ADMIN = 'admin'
}

/** Estado de la cuenta de usuario */
export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BANNED = 'banned'
}

/** Información pública del perfil de usuario */
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  isPremium: boolean;
  profilePictureUrl?: string;
  bio?: string;
  stats?: UserStats;
  achievements?: string[];
  unlockedDistricts?: number;
  createdAt: ISODateString;
  socialMediaLinks?: SocialMediaLinks;
}

/** Configuración del usuario */
export interface UserSettings {
  language: string;
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
  privacySettings: PrivacySettings;
  mapSettings?: MapSettings;
}

/** Configuración de privacidad del usuario */
export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showOnlineStatus: boolean;
  showActivityStatus: boolean;
  showLastLogin: boolean;
}

/** Configuración del mapa para el usuario */
export interface MapSettings {
  defaultZoom: number;
  defaultCenter: {
    latitude: number;
    longitude: number;
  };
  showPOIs: boolean;
  showPhotos: boolean;
  mapType: 'standard' | 'satellite' | 'hybrid';
}

/** Estadísticas del usuario */
export interface UserStats {
  unlockedDistricts: number;
  totalPhotos: number;
  totalComments: number;
  totalLikes: number;
  achievements: number;
  accountAge: number; // en días
  rank?: number;
}

/** Enlaces a redes sociales del usuario */
export interface SocialMediaLinks {
  twitter?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  website?: string;
}

/** Datos para actualización de perfil */
export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  profilePictureUrl?: string;
  socialMediaLinks?: SocialMediaLinks;
}

/** Datos para actualización de configuración */
export interface SettingsUpdateData {
  language?: string;
  theme?: 'light' | 'dark' | 'system';
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  privacySettings?: Partial<PrivacySettings>;
  mapSettings?: Partial<MapSettings>;
} 