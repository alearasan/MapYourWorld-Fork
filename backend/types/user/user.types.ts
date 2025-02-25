/**
 * Tipos relacionados con los usuarios
 */

import { ISODateString, UUID, UserRole } from '@types';

/** Perfil de usuario */
export interface UserProfile {
  userId: UUID;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  interests?: string[];
  socialLinks?: SocialLink[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** Enlace a redes sociales */
export interface SocialLink {
  platform: 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'other';
  url: string;
  username?: string;
}

/** Preferencias de usuario */
export interface UserPreferences {
  userId: UUID;
  language: string;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  theme: 'light' | 'dark' | 'system';
  updatedAt: ISODateString;
}

/** Preferencias de notificaciones */
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  achievements: boolean;
  friendRequests: boolean;
  messages: boolean;
  districtUnlocks: boolean;
}

/** Preferencias de privacidad */
export interface PrivacyPreferences {
  profileVisibility: 'public' | 'friends' | 'private';
  showLocation: boolean;
  showActivity: boolean;
  allowTagging: boolean;
}

/** Estadísticas de usuario */
export interface UserStats {
  userId: UUID;
  districtsUnlocked: number;
  pointsEarned: number;
  achievementsUnlocked: number;
  photosUploaded: number;
  lastActive: ISODateString;
  joinedAt: ISODateString;
}

/** Actividad de usuario */
export interface UserActivity {
  id: UUID;
  userId: UUID;
  type: 'district_unlock' | 'poi_visit' | 'achievement_unlock' | 'photo_upload' | 'rating';
  details: any;
  timestamp: ISODateString;
}

/** Solicitud de actualización de perfil */
export interface ProfileUpdateRequest {
  bio?: string;
  avatarUrl?: string;
  location?: string;
  interests?: string[];
  socialLinks?: SocialLink[];
} 