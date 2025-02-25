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

/**
 * Añade puntos a un usuario
 * @param userId ID del usuario
 * @param points Cantidad de puntos a añadir
 * @param reason Razón por la que se añaden los puntos
 * @param relatedId ID relacionado con la actividad (opcional)
 */
export const addPoints = async (
  userId: string,
  points: number,
  reason: string,
  relatedId?: string
): Promise<{ newTotal: number; levelUp: boolean; newLevel?: number }> => {
  // TODO: Implementar la adición de puntos
  // 1. Validar que los puntos son positivos
  // 2. Obtener el progreso actual del usuario
  // 3. Añadir los puntos al total
  // 4. Comprobar si el usuario sube de nivel
  // 5. Guardar el nuevo total y nivel en la base de datos
  // 6. Registrar la transacción de puntos
  // 7. Publicar evento de puntos añadidos y subida de nivel si corresponde
  
  throw new Error('Método no implementado');
};

/**
 * Comprueba y desbloquea logros para un usuario
 * @param userId ID del usuario
 */
export const checkAndUnlockAchievements = async (
  userId: string
): Promise<{ 
  unlockedAchievements: Achievement[]; 
  pointsEarned: number 
}> => {
  // TODO: Implementar comprobación y desbloqueo de logros
  // 1. Obtener el progreso del usuario
  // 2. Obtener todos los logros disponibles que no ha desbloqueado
  // 3. Comprobar cada logro para ver si cumple los requisitos
  // 4. Desbloquear los logros que cumpla y asignar puntos
  // 5. Guardar los cambios en la base de datos
  // 6. Publicar eventos para cada logro desbloqueado
  
  throw new Error('Método no implementado');
};

/**
 * Registra una actividad de usuario y actualiza su progreso
 * @param userId ID del usuario
 * @param activityType Tipo de actividad
 * @param relatedId ID relacionado con la actividad
 */
export const recordActivity = async (
  userId: string,
  activityType: 'visit_poi' | 'photo_upload' | 'comment' | 'like' | 'follow' | 'district_unlock',
  relatedId: string
): Promise<{
  pointsEarned: number;
  unlockedAchievements: Achievement[];
  updatedProgress: UserProgress;
}> => {
  // TODO: Implementar registro de actividad
  // 1. Validar la actividad y el ID relacionado
  // 2. Actualizar el contador correspondiente en el progreso del usuario
  // 3. Actualizar el streak si corresponde
  // 4. Asignar puntos por la actividad
  // 5. Comprobar y desbloquear logros
  // 6. Guardar el progreso actualizado
  // 7. Publicar evento de actividad registrada
  
  throw new Error('Método no implementado');
};

/**
 * Obtiene el progreso de un usuario
 * @param userId ID del usuario
 */
export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  // TODO: Implementar obtención de progreso
  // 1. Buscar el progreso del usuario en la base de datos
  // 2. Si no existe, retornar null
  // 3. Si existe, retornar el progreso completo
  
  throw new Error('Método no implementado');
};

/**
 * Obtiene todos los logros disponibles en el sistema
 * @param includeHidden Indica si se deben incluir logros ocultos
 */
export const getAllAchievements = async (includeHidden: boolean = false): Promise<Achievement[]> => {
  // TODO: Implementar obtención de todos los logros
  // 1. Consultar todos los logros en la base de datos
  // 2. Filtrar los ocultos si corresponde
  // 3. Ordenar por categoría o ID
  
  throw new Error('Método no implementado');
};

/**
 * Obtiene los logros desbloqueados por un usuario
 * @param userId ID del usuario
 */
export const getUserAchievements = async (userId: string): Promise<{
  unlocked: Achievement[];
  locked: Achievement[];
}> => {
  // TODO: Implementar obtención de logros de usuario
  // 1. Obtener el progreso del usuario
  // 2. Obtener todos los logros
  // 3. Separar en desbloqueados y bloqueados
  // 4. Opcionalmente, incluir progreso hacia logros bloqueados
  
  throw new Error('Método no implementado');
};

/**
 * Obtiene la información de niveles de usuario
 */
export const getUserLevels = async (): Promise<UserLevel[]> => {
  // TODO: Implementar obtención de niveles
  // 1. Consultar la configuración de niveles en la base de datos
  // 2. Ordenar por nivel
  
  throw new Error('Método no implementado');
};

/**
 * Actualiza el streak diario de un usuario
 * @param userId ID del usuario
 */
export const updateUserStreak = async (userId: string): Promise<{
  current: number;
  max: number;
  increased: boolean;
}> => {
  // TODO: Implementar actualización de streak
  // 1. Obtener el progreso del usuario
  // 2. Comprobar la fecha del último streak
  // 3. Si es el mismo día, no hacer nada
  // 4. Si es el día siguiente, incrementar el streak
  // 5. Si han pasado más días, reiniciar el streak a 1
  // 6. Actualizar el valor máximo si corresponde
  // 7. Guardar los cambios
  // 8. Asignar bonificación de puntos por streak si corresponde
  
  throw new Error('Método no implementado');
}; 