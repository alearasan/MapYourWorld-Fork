/**
 * Tipos relacionados con mapas, distritos y progreso del usuario
 */

// Coordenadas geográficas
export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

// Punto de interés en el mapa
export interface PointOfInterest {
  id: string;
  name: string;
  description: string;
  coordinates: GeoCoordinates;
  type: 'monument' | 'museum' | 'restaurant' | 'viewpoint' | 'other';
  imageUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Distrito en un mapa
export interface District {
  id: string;
  name: string;
  description: string;
  boundaries: GeoCoordinates[]; // Polígono que define los límites del distrito
  pointsOfInterest: PointOfInterest[];
  unlockRequirements?: string;
  requiredPoints?: number;
  order?: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Mapa completo
export interface Map {
  id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  centerCoordinates: GeoCoordinates;
  defaultZoom: number;
  districts: District[];
  createdById: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

// Objetivo que debe ser completado en un distrito
export interface ObjectiveProgress {
  id: string;
  title: string;
  description: string;
  type: 'visit' | 'photo' | 'quiz' | 'challenge';
  pointOfInterestId?: string;
  points: number;
  completed: boolean;
  completedAt?: string;
}

// Progreso en un distrito específico
export interface DistrictProgress {
  districtId: string;
  visitedAt?: string;
  lastVisitedAt?: string;
  visitCount: number;
  objectives: ObjectiveProgress[];
  totalPoints: number;
  earnedPoints: number;
}

// Progreso global del usuario en un mapa
export interface UserProgress {
  userId: string;
  mapId: string;
  unlockedDistricts: string[];
  completedDistricts: string[];
  districtProgress: DistrictProgress[];
  totalPoints: number;
  rank?: number;
  startedAt: string;
  lastActivityAt: string;
}

// Filtros para búsqueda de mapas
export interface MapFilters {
  city?: string;
  country?: string;
  searchTerm?: string;
  premiumOnly?: boolean;
  sortBy?: 'popularity' | 'newest' | 'rating';
  page?: number;
  limit?: number;
}

// Tipo para evento de selección en el mapa
export interface MapSelectionEvent {
  type: 'district' | 'poi' | 'coordinates';
  district?: District;
  pointOfInterest?: PointOfInterest;
  coordinates?: GeoCoordinates;
}

// Tipo para estadísticas de un mapa
export interface MapStatistics {
  totalUsers: number;
  totalCompletions: number;
  averageCompletionTime: number; // en minutos
  mostVisitedDistrict: {
    districtId: string;
    districtName: string;
    visitCount: number;
  };
  mostPopularPOI: {
    poiId: string;
    poiName: string;
    visitCount: number;
  };
}

// Comentario sobre un punto de interés
export interface POIComment {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  pointOfInterestId: string;
  content: string;
  imageUrl?: string;
  rating?: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

// Foto subida por un usuario en un punto de interés
export interface UserPhoto {
  id: string;
  userId: string;
  username: string;
  pointOfInterestId: string;
  districtId: string;
  imageUrl: string;
  caption?: string;
  likes: number;
  createdAt: string;
} 