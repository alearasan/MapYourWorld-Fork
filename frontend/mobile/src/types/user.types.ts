/**
 * Tipos de usuario para la aplicación móvil
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
  theme: 'light' | 'dark' | 'system' | 'auto';
  emailNotifications: boolean;
  pushNotifications: boolean;
  locationServices: boolean;
  privacySettings: PrivacySettings;
  mapSettings?: MapSettings;
  dataSaver?: boolean;
}

/** Configuración de privacidad del usuario */
export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showOnlineStatus: boolean;
  showActivityStatus: boolean;
  showLastLogin: boolean;
  shareLocation: boolean;
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
  mapType: 'standard' | 'satellite' | 'hybrid' | 'terrain';
  offline3DEnabled?: boolean;
  cacheMapData?: boolean;
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
  totalDistance?: number; // en km
  totalTime?: number; // en minutos
}

/** Enlaces a redes sociales del usuario */
export interface SocialMediaLinks {
  twitter?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  website?: string;
} 