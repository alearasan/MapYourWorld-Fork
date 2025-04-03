/**
 * Servicio de Gamificación
 * Gestiona la lógica de puntos, logros, niveles y recompensas para los usuarios
 */

import { publishEvent } from '@shared/libs/rabbitmq';

/**
 * Tipo para representar un logro/badge
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'explorer' | 'photographer' | 'social' | 'collector' | 'expert';
  imageUrl: string;
  requirements: {
    type: 'visit_count' | 'photo_count' | 'district_count' | 'follower_count' | 'comment_count' | 'like_count';
    count: number;
    specificIds?: string[]; // IDs específicos de distritos, POIs, etc.
  }[];
  points: number;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Tipo para representar un nivel de usuario
 */
export interface UserLevel {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  benefits: string[];
}

/**
 * Tipo para el progreso de usuario
 */
export interface UserProgress {
  userId: string;
  points: number;
  level: number;
  achievements: {
    achievementId: string;
    unlockedAt: string;
  }[];
  visitedPois: {
    poiId: string;
    visitedAt: string;
    count: number;
  }[];
  unlockedDistricts: {
    districtId: string;
    unlockedAt: string;
  }[];
  photos: number;
  comments: number;
  likes: number;
  followers: number;
  following: number;
  streak: {
    current: number;
    max: number;
    lastActivityDate: string;
  };
  updatedAt: string;
}