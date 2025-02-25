/**
 * Tipos relacionados con mapas para la aplicación móvil
 */

import { ISODateString } from '@frontend/mobile/src/types/user.types';
import { UserData } from '@frontend/mobile/src/types/auth.types';

/** Coordenadas geográficas */
export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

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
  id: string;
  name: string;
  description: string;
  boundaries: GeoCoordinates[];
  center: GeoCoordinates;
  difficulty: DistrictDifficulty;
  pointsToUnlock: number;
  unlockedBy: number;
  isUnlocked?: boolean;
  progress?: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** Punto de interés en el mapa */
export interface POI {
  id: string;
  name: string;
  description: string;
  location: GeoCoordinates;
  type: POIType;
  districtId: string;
  createdBy: string;
  photos: Photo[];
  ratings: number[];
  averageRating?: number;
  distance?: number; // Distancia desde la ubicación actual del usuario
  isVisited?: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** Progreso del usuario en distritos */
export interface UserProgress {
  userId: string;
  unlockedDistricts: string[];
  currentPoints: number;
  visitedPOIs: string[];
  achievements: Achievement[];
  lastActivity: ISODateString;
}

/** Foto subida por un usuario */
export interface Photo {
  id: string;
  url: string;
  thumbnailUrl: string;
  caption?: string;
  poiId: string;
  districtId: string;
  userId: string;
  user?: UserData;
  likes: number;
  hasLiked?: boolean;
  createdAt: ISODateString;
}

/** Logro desbloqueado por un usuario */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  unlockedAt: ISODateString;
}

/** Ruta creada por un usuario */
export interface UserRoute {
  id: string;
  name: string;
  description?: string;
  waypoints: GeoCoordinates[];
  distance: number; // en km
  estimatedTime: number; // en minutos
  createdBy: string;
  districtIds: string[];
  poiIds: string[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** Estado del mapa para el contexto/store */
export interface MapState {
  currentLocation: GeoCoordinates | null;
  selectedDistrict: District | null;
  selectedPOI: POI | null;
  unlockedDistricts: string[];
  visitedPOIs: string[];
  loading: boolean;
  error: string | null;
  isTrackingLocation: boolean;
  offlineMode: boolean;
} 