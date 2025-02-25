/**
 * Tipos relacionados con el mapa y distritos
 */

// Importar tipos comunes necesarios usando el alias @types
import { GeoCoordinates, ISODateString, UUID } from '@types';
import { Auth } from '@types';

/** Tipo de punto de interés en el mapa */
export enum POIType {
  LANDMARK = 'landmark',
  RESTAURANT = 'restaurant',
  PARK = 'park',
  MUSEUM = 'museum',
  HISTORICAL = 'historical',
  SHOPPING = 'shopping',
  OTHER = 'other'
}

/** Nivel de dificultad para desbloquear un distrito */
export enum DistrictDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

/** Información de un distrito */
export interface District {
  id: UUID;
  name: string;
  description: string;
  boundaries: GeoCoordinates[];
  center: GeoCoordinates;
  difficulty: DistrictDifficulty;
  pointsToUnlock: number;
  unlockedBy: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** Punto de interés */
export interface POI {
  id: UUID;
  name: string;
  description: string;
  location: GeoCoordinates;
  type: POIType;
  districtId: UUID;
  createdBy: UUID;
  photos: Photo[];
  ratings: number[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** Progreso del usuario */
export interface UserProgress {
  userId: UUID;
  unlockedDistricts: UUID[];
  currentPoints: number;
  visitedPOIs: UUID[];
  achievements: Achievement[];
  lastActivity: ISODateString;
}

/** Foto de un punto de interés */
export interface Photo {
  id: UUID;
  url: string;
  thumbnailUrl: string;
  caption?: string;
  poiId: UUID;
  districtId: UUID;
  userId: UUID;
  user?: Auth.UserData;
  likes: number;
  createdAt: ISODateString;
}

/** Logro desbloqueado */
export interface Achievement {
  id: UUID;
  name: string;
  description: string;
  iconUrl: string;
  unlockedAt: ISODateString;
}

/** Evento de desbloqueo de distrito */
export interface DistrictUnlockEvent {
  userId: UUID;
  districtId: UUID;
  timestamp: ISODateString;
}

/** Filtros para puntos de interés */
export interface POIFilters {
  types?: POIType[];
  districtId?: UUID;
  searchTerm?: string;
  radius?: number;
  center?: GeoCoordinates;
}

/** Filtros para distritos */
export interface DistrictFilters {
  difficulty?: DistrictDifficulty;
  unlockedByUser?: UUID;
  searchTerm?: string;
} 