/**
 * Servicio de Puntos de Interés (POI)
 * Gestiona la creación, consulta, actualización y eliminación de puntos de interés
 */

import { publishEvent } from '@shared/libs/rabbitmq';
import { AppDataSource } from '@backend/database/appDataSource';
import { PointOfInterest } from '@backend/map-service/src/models/poi.model';

/**
 * Tipo para representar un punto de interés
 */

/*
export interface PointOfInterest {
  id: string;
  name: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  type: string;
  category: string;
  tags: string[];
  images: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  visitCount: number;
  rating: number;
  isActive: boolean;
  districtId: string;
}
*/

/**
 * Crea un nuevo punto de interés
 * @param poiData Datos del punto de interés a crear
 * @param userId ID del usuario que crea el punto de interés
 */
export const createPOI = async (
  poiData: Omit<PointOfInterest, 'id' | 'createdAt' | 'updatedAt' | 'visitCount' | 'rating'>,
  userId: string
): Promise<PointOfInterest> => {
  // TODO: Implementar la creación de un punto de interés
  // 1. Validar los datos del punto de interés
  // 2. Verificar que las coordenadas sean válidas
  // 3. Comprobar si ya existe un POI similar en la ubicación
  // 4. Guardar el POI en la base de datos
  // 5. Publicar evento de POI creado
  try {
    // 1. Validar los datos del punto de interés
    if (!poiData.name || !poiData.location || !poiData.districtId) {
      throw new Error("Los campos nombre, ubicación y distrito son obligatorios");
    }
    
    // 2. Verificar que las coordenadas sean válidas
    if (
      poiData.location.latitude < -90 || 
      poiData.location.latitude > 90 || 
      poiData.location.longitude < -180 || 
      poiData.location.longitude > 180
    ) {
      throw new Error("Coordenadas geográficas inválidas");
    }
    
    // 3. Comprobar si ya existe un POI similar en la ubicación
    // Asumiendo que tenemos un repositorio o modelo para POI
    const poiRepository = AppDataSource.getRepository(PointOfInterest);
    const existingSimilarPOI = await poiRepository.findOne({
      where: {
        name: poiData.name,
        location: {
          latitude: poiData.location.latitude,
          longitude: poiData.location.longitude
        }
      }
    });
    
    if (existingSimilarPOI) {
      throw new Error("Ya existe un punto de interés similar en esta ubicación");
    }
    
    // 4. Guardar el POI en la base de datos
    const now = new Date().toISOString();
    const newPOI = poiRepository.create({
      ...poiData,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
      visitCount: 0,
      rating: 0,
      isActive: true
    });
    
    const savedPOI = await poiRepository.save(newPOI);
    
    // 5. Publicar evento de POI creado
    await publishEvent('poi.created', {
      poiId: savedPOI.id,
      name: savedPOI.name,
      location: savedPOI.location,
      district: savedPOI.districtId,
      createdBy: userId,
      timestamp: now
    });
    
    return savedPOI;
  } catch (error) {
    console.error("Error al crear punto de interés:", error);
    throw error;
  }  
};

/**
 * Obtiene un punto de interés por su ID
 * @param poiId ID del punto de interés a obtener
 */
export const getPOIById = async (poiId: string): Promise<PointOfInterest | null> => {
  // TODO: Implementar la obtención de un punto de interés por ID
  // 1. Buscar el POI en la base de datos
  // 2. Retornar null si no se encuentra
  // 3. Incrementar el contador de visitas si corresponde
  try {
    // 1. Buscar el POI en la base de datos
    const poiRepository = AppDataSource.getRepository(PointOfInterest);
    const poi = await poiRepository.findOne({
      where: { id: poiId, isActive: true }
    });
    
    // 2. Retornar null si no se encuentra
    if (!poi) {
      return null;
    }
    
    // 3. Incrementar el contador de visitas para propósitos analíticos
    // No incrementamos en una consulta normal, solo cuando se registra una visita explícita
    
    return poi;
  } catch (error) {
    console.error("Error al obtener punto de interés:", error);
    throw error;
  }  
};

/**
 * Actualiza un punto de interés existente
 * @param poiId ID del punto de interés a actualizar
 * @param updateData Datos a actualizar del punto de interés
 * @param userId ID del usuario que realiza la actualización
 */
export const updatePOI = async (
  poiId: string,
  updateData: Partial<Omit<PointOfInterest, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>,
  userId: string
): Promise<PointOfInterest | null> => {
  // TODO: Implementar la actualización de un punto de interés
  // 1. Verificar que el POI existe
  // 2. Comprobar que el usuario tiene permisos para actualizar el POI
  // 3. Validar los datos de actualización
  // 4. Actualizar el POI en la base de datos
  // 5. Publicar evento de POI actualizado
  try {
    // 1. Verificar que el POI existe
    const poiRepository = AppDataSource.getRepository(PointOfInterest);
    const poi = await poiRepository.findOne({
      where: { id: poiId, isActive: true }
    });
    
    if (!poi) {
      return null;
    }
    
    // 2. Comprobar que el usuario tiene permisos para actualizar el POI
    // Permitir actualización si es el creador o un administrador
    if (poi.createdBy !== userId) {
      // Aquí podríamos verificar si el usuario es administrador
      // Por ahora, simplemente lanzamos un error
      throw new Error("No tienes permisos para actualizar este punto de interés");
    }
    
    // 3. Validar los datos de actualización
    if (updateData.location) {
      if (
        updateData.location.latitude < -90 || 
        updateData.location.latitude > 90 || 
        updateData.location.longitude < -180 || 
        updateData.location.longitude > 180
      ) {
        throw new Error("Coordenadas geográficas inválidas");
      }
    }
    
    // 4. Actualizar el POI en la base de datos
    const updatedPOI = {
      ...poi,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await poiRepository.save(updatedPOI);
    
    // 5. Publicar evento de POI actualizado
    await publishEvent('poi.updated', {
      poiId: updatedPOI.id,
      updatedBy: userId,
      timestamp: updatedPOI.updatedAt,
      changes: Object.keys(updateData)
    });
    
    return updatedPOI;
  } catch (error) {
    console.error("Error al actualizar punto de interés:", error);
    throw error;
  }  
};

/**
 * Elimina un punto de interés
 * @param poiId ID del punto de interés a eliminar
 * @param userId ID del usuario que solicita la eliminación
 */
export const deletePOI = async (poiId: string, userId: string): Promise<boolean> => {
  // TODO: Implementar la eliminación de un punto de interés
  // 1. Verificar que el POI existe
  // 2. Comprobar que el usuario tiene permisos para eliminar el POI
  // 3. Marcar el POI como inactivo o eliminarlo de la base de datos
  // 4. Publicar evento de POI eliminado
  try {
    // 1. Verificar que el POI existe
    const poiRepository = AppDataSource.getRepository(PointOfInterest);
    const poi = await poiRepository.findOne({
      where: { id: poiId, isActive: true }
    });
    
    if (!poi) {
      return false;
    }
    
    // 2. Comprobar que el usuario tiene permisos para eliminar el POI
    if (poi.createdBy !== userId) {
      // Aquí podríamos verificar si el usuario es administrador
      throw new Error("No tienes permisos para eliminar este punto de interés");
    }
    
    // 3. Marcar el POI como inactivo (soft delete) en lugar de eliminarlo físicamente
    poi.isActive = false;
    poi.updatedAt = new Date().toISOString();
    
    await poiRepository.save(poi);
    
    // 4. Publicar evento de POI eliminado
    await publishEvent('poi.deleted', {
      poiId: poi.id,
      deletedBy: userId,
      timestamp: poi.updatedAt
    });
    
    return true;
  } catch (error) {
    console.error("Error al eliminar punto de interés:", error);
    throw error;
  }  
};

/**
 * Busca puntos de interés cercanos a una ubicación
 * @param latitude Latitud del centro de búsqueda
 * @param longitude Longitud del centro de búsqueda
 * @param radiusInKm Radio de búsqueda en kilómetros
 * @param filters Filtros adicionales (categoría, tipo, etc.)
 */
export const findNearbyPOIs = async (
  latitude: number,
  longitude: number,
  radiusInKm: number,
  filters?: {
    category?: string;
    type?: string;
    tags?: string[];
    minRating?: number;
  }
): Promise<PointOfInterest[]> => {
  // TODO: Implementar la búsqueda de POIs cercanos
  // 1. Construir consulta geoespacial para la base de datos
  // 2. Aplicar filtros adicionales si existen
  // 3. Ordenar resultados por distancia
  // 4. Limitar resultados a un número máximo
  try {
    // 1. Construir consulta geoespacial para la base de datos
    // Usamos la fórmula de Haversine para calcular la distancia
    const poiRepository = AppDataSource.getRepository(PointOfInterest);
    
    // Base de la consulta
    let query = `
      SELECT *, 
      (
        6371 * acos(
          cos(radians(${latitude})) * 
          cos(radians(location->>'latitude')) * 
          cos(radians(location->>'longitude') - radians(${longitude})) + 
          sin(radians(${latitude})) * 
          sin(radians(location->>'latitude'))
        )
      ) AS distance 
      FROM point_of_interest 
      WHERE is_active = true
      AND (
        6371 * acos(
          cos(radians(${latitude})) * 
          cos(radians(location->>'latitude')) * 
          cos(radians(location->>'longitude') - radians(${longitude})) + 
          sin(radians(${latitude})) * 
          sin(radians(location->>'latitude'))
        )
      ) <= ${radiusInKm}
    `;
    
    // 2. Aplicar filtros adicionales si existen
    const params: any[] = [];
    let paramIndex = 1;
    
    if (filters) {
      if (filters.category) {
        query += ` AND category = $${paramIndex}`;
        params.push(filters.category);
        paramIndex++;
      }
      
      if (filters.type) {
        query += ` AND type = $${paramIndex}`;
        params.push(filters.type);
        paramIndex++;
      }
      
      if (filters.tags && filters.tags.length > 0) {
        query += ` AND tags && $${paramIndex}::text[]`;
        params.push(filters.tags);
        paramIndex++;
      }
      
      if (filters.minRating) {
        query += ` AND rating >= $${paramIndex}`;
        params.push(filters.minRating);
        paramIndex++;
      }
    }
    
    // 3. Ordenar resultados por distancia
    query += ` ORDER BY distance ASC`;
    
    // 4. Limitar resultados a un número máximo para rendimiento
    query += ` LIMIT 50`;
    
    // Ejecutar la consulta
    const result = await AppDataSource.query(query, params);
    return result;
  } catch (error) {
    console.error("Error al buscar puntos de interés cercanos:", error);
    throw error;
  }  
};

/**
 * Registra una visita a un punto de interés
 * @param poiId ID del punto de interés visitado
 * @param userId ID del usuario que realiza la visita
 */
export const registerPOIVisit = async (poiId: string, userId: string): Promise<boolean> => {
  // TODO: Implementar el registro de visitas a POIs
  // 1. Verificar que el POI existe
  // 2. Registrar la visita en la base de datos
  // 3. Incrementar el contador de visitas del POI
  // 4. Actualizar las estadísticas del usuario si es necesario
  // 5. Publicar evento de visita a POI
  try {
    // 1. Verificar que el POI existe
    const poiRepository = AppDataSource.getRepository(PointOfInterest);
    const poi = await poiRepository.findOne({
      where: { id: poiId, isActive: true }
    });
    
    if (!poi) {
      return false;
    }
    
    // 2. Registrar la visita en la base de datos (asumiendo que hay una tabla de visitas)
    const visitRepository = AppDataSource.getRepository('poi_visit');
    await visitRepository.insert({
      poiId,
      userId,
      visitedAt: new Date().toISOString()
    });
    
    // 3. Incrementar el contador de visitas del POI
    poi.visitCount += 1;
    poi.updatedAt = new Date().toISOString();
    await poiRepository.save(poi);
    
    // 4. Actualizar las estadísticas del usuario (asumiendo un servicio de usuario)
    // Aquí podríamos comunicarnos con el servicio de usuario, o publicar un evento
    
    // 5. Publicar evento de visita a POI
    await publishEvent('poi.visited', {
      poiId,
      userId,
      timestamp: new Date().toISOString(),
      visitCount: poi.visitCount
    });
    
    return true;
  } catch (error) {
    console.error("Error al registrar visita a punto de interés:", error);
    throw error;
  }  
};

/**
 * Califica un punto de interés
 * @param poiId ID del punto de interés a calificar
 * @param userId ID del usuario que realiza la calificación
 * @param rating Calificación (1-5)
 */
export const ratePOI = async (
  poiId: string,
  userId: string,
  rating: number
): Promise<{ success: boolean; newRating: number }> => {
  // TODO: Implementar la calificación de POIs
  // 1. Verificar que el rating está en el rango correcto (1-5)
  // 2. Verificar que el POI existe
  // 3. Guardar o actualizar la calificación del usuario
  // 4. Recalcular el rating promedio del POI
  // 5. Publicar evento de POI calificado
  try {
    // 1. Verificar que el rating está en el rango correcto (1-5)
    if (rating < 1 || rating > 5) {
      throw new Error("La calificación debe estar entre 1 y 5");
    }
    
    // 2. Verificar que el POI existe
    const poiRepository = AppDataSource.getRepository(PointOfInterest);
    const poi = await poiRepository.findOne({
      where: { id: poiId, isActive: true }
    });
    
    if (!poi) {
      throw new Error("Punto de interés no encontrado");
    }
    
    // 3. Guardar o actualizar la calificación del usuario
    // Primero verificamos si el usuario ya había calificado este POI
    const ratingRepository = AppDataSource.getRepository('poi_rating');
    const existingRating = await ratingRepository.findOne({
      where: { poiId, userId }
    });
    
    if (existingRating) {
      // Actualizar calificación existente
      existingRating.rating = rating;
      existingRating.updatedAt = new Date().toISOString();
      await ratingRepository.save(existingRating);
    } else {
      // Crear nueva calificación
      await ratingRepository.insert({
        poiId,
        userId,
        rating,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    // 4. Recalcular el rating promedio del POI
    const ratings = await ratingRepository.find({
      where: { poiId }
    });
    
    const totalRating = ratings.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = totalRating / ratings.length;
    
    // Actualizar el rating del POI
    poi.rating = parseFloat(averageRating.toFixed(1)); // Redondear a 1 decimal
    poi.updatedAt = new Date().toISOString();
    await poiRepository.save(poi);
    
    // 5. Publicar evento de POI calificado
    await publishEvent('poi.rated', {
      poiId,
      userId,
      rating,
      averageRating: poi.rating,
      timestamp: new Date().toISOString()
    });
    
    return {
      success: true,
      newRating: poi.rating
    };
  } catch (error) {
    console.error("Error al calificar punto de interés:", error);
    throw error;
  }  
}; 