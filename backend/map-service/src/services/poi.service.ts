/**
 * Servicio de Puntos de Interés (POI)
 * Gestiona la creación, consulta, actualización y eliminación de puntos de interés
 */

import { AppDataSource } from '../../../database/appDataSource';
import { PointOfInterest } from '../models/poi.model';
import { Between, Repository, IsNull, Not } from 'typeorm';

// Initialize repository
const poiRepository: Repository<PointOfInterest> = AppDataSource.getRepository(PointOfInterest);

/**
 * Crea un nuevo punto de interés
 * @param poiData Datos del punto de interés a crear
 * @param userId ID del usuario que crea el punto de interés
 */
export const createPOI = async (
  poiData: Omit<PointOfInterest, 'id'>,
  userId: string
): Promise<PointOfInterest> => {
  // TODO: Implementar la creación de un punto de interés
  // 1. Validar los datos del punto de interés
  // 2. Verificar que las coordenadas sean válidas
  // 3. Comprobar si ya existe un POI similar en la ubicación
  // 4. Guardar el POI en la base de datos

  // 1. Validar los datos del punto de interés
  if (!poiData.name || !poiData.location || !poiData.category) {
    throw new Error('Nombre, ubicación y categoría son campos obligatorios');
  }
  
  // 2. Verificar que las coordenadas sean válidas
  const location = poiData.location;
  if (!location || 
      !location.type || 
      location.type !== 'Point' || 
      !location.coordinates || 
      location.coordinates.length !== 2) {
    throw new Error('Las coordenadas de ubicación son inválidas');
  }
  
  // 3. Comprobar si ya existe un POI similar en la ubicación
  const [longitude, latitude] = location.coordinates;
  const existingPOI = await poiRepository.findOne({
    where: {
      name: poiData.name,
      location: { 
        type: 'Point',
        coordinates: [longitude, latitude] 
      } as any
    }
  });
  
  if (existingPOI) {
    throw new Error('Ya existe un punto de interés similar en esta ubicación');
  }
  
  // 4. Guardar el POI en la base de datos
  const newPOI = poiRepository.create({
    ...poiData,
    createdAt: new Date(),
    user: { id: userId } as any
  });
  
  return await poiRepository.save(newPOI);
};







export const createPOISinToken = async (
  poiData: Omit<PointOfInterest, 'id'>,
): Promise<PointOfInterest> => {
  // TODO: Implementar la creación de un punto de interés
  // 1. Validar los datos del punto de interés
  // 2. Verificar que las coordenadas sean válidas
  // 3. Comprobar si ya existe un POI similar en la ubicación
  // 4. Guardar el POI en la base de datos

  // 1. Validar los datos del punto de interés
  if (!poiData.name || !poiData.location || !poiData.category) {
    throw new Error('Nombre, ubicación y categoría son campos obligatorios');
  }
  
  // 2. Verificar que las coordenadas sean válidas
  const location = poiData.location;
  if (!location || 
      !location.type || 
      location.type !== 'Point' || 
      !location.coordinates || 
      location.coordinates.length !== 2) {
    throw new Error('Las coordenadas de ubicación son inválidas');
  }
  
  // 3. Comprobar si ya existe un POI similar en la ubicación
  const [longitude, latitude] = location.coordinates;
  const existingPOI = await poiRepository.findOne({
    where: {
      name: poiData.name,
      location: {
        type: 'Point', 
        coordinates: [longitude, latitude] 
      } as any
    }
  });
  
  if (existingPOI) {
    throw new Error('Ya existe un punto de interés similar en esta ubicación');
  }
  
  // 4. Guardar el POI en la base de datos
  const newPOI = poiRepository.create({
    ...poiData,
    createdAt: new Date()
    });
  
  return await poiRepository.save(newPOI);
};










/**
 * Obtiene un punto de interés por su ID
 * @param poiId ID del punto de interés a obtener
 */
export const getPOIById = async (poiId: string): Promise<PointOfInterest | null> => {
  // TODO: Implementar la obtención de un punto de interés por ID
  // 1. Buscar el POI en la base de datos
  // 2. Retornar null si no se encuentra
  
  // 1. Buscar el POI en la base de datos
  const poi = await poiRepository.findOne({
    where: { id: poiId },
    relations: ['user', 'district']
  });
  
  // 2. Retornar null si no se encuentra
  if (!poi) {
    return null;
  }

  return poi;
};

/**
 * Actualiza un punto de interés existente
 * @param poiId ID del punto de interés a actualizar
 * @param updateData Datos a actualizar del punto de interés
 * @param userId ID del usuario que realiza la actualización
 */
export const updatePOI = async (
  poiId: string,
  updateData: Partial<Omit<PointOfInterest, 'id'>>,
  userId: string
): Promise<PointOfInterest | null> => {
  // TODO: Implementar la actualización de un punto de interés
  // 1. Verificar que el POI existe
  // 2. Comprobar que el POI pertenece al User
  // 3. Validar los datos de actualización
  // 4. Actualizar el POI en la base de datos
  
  // 1. Verificar que el POI existe
  const existingPOI = await poiRepository.findOne({
    where: { id: poiId },
    relations: ['user']
  });
  
  if (!existingPOI) {
    return null;
  }
  
  // 2. Comprobar que el POI pertenece al User
  if (existingPOI.user.id !== userId) {
    throw new Error('No tienes permisos para actualizar este punto de interés');
  }
  
  // 3. Validar los datos de actualización
  if (updateData.location) {
    const location = updateData.location;
    if (!location.type || 
        location.type !== 'Point' || 
        !location.coordinates || 
        location.coordinates.length !== 2) {
      throw new Error('Las coordenadas de ubicación son inválidas');
    }
  }
  
  // 4. Actualizar el POI en la base de datos
  Object.assign(existingPOI, updateData);
  return await poiRepository.save(existingPOI);
};

/**
 * Elimina un punto de interés
 * @param poiId ID del punto de interés a eliminar
 * @param userId ID del usuario que solicita la eliminación
 */
export const deletePOI = async (poiId: string, userId: string): Promise<boolean> => {
  // TODO: Implementar la eliminación de un punto de interés
  // 1. Verificar que el POI existe
  // 2. Comprobar que el POI pertenece al User
  // 3. Marcar el POI como inactivo o eliminarlo de la base de datos
  
  // 1. Verificar que el POI existe
  const poi = await poiRepository.findOne({
    where: { id: poiId },
    relations: ['user']
  });
  
  if (!poi) {
    return false;
  }
  
  // 2. Comprobar que el POI pertenece al User
  if (poi.user.id !== userId) {
    throw new Error('No tienes permisos para eliminar este punto de interés');
  }
  
  // 3. Eliminar el POI de la base de datos
  await poiRepository.remove(poi);
  return true;
};

/**
 * Busca puntos de interés cercanos a una ubicación
 * @param latitude Latitud del centro de búsqueda
 * @param longitude Longitud del centro de búsqueda
 * @param radiusInKm Radio de búsqueda en kilómetros
 * @param filters Filtros adicionales (categoría)
 */
export const findNearbyPOIs = async (
  latitude: number,
  longitude: number,
  radiusInKm: number,
  filters?: {
    category?: string;
  }
): Promise<PointOfInterest[]> => {
  // TODO: Implementar la búsqueda de POIs cercanos
  // 1. Construir consulta geoespacial para la base de datos
  // 2. Aplicar filtros adicionales si existen
  // 3. Ordenar resultados por distancia
  // 4. Limitar resultados a un número máximo
  
  // 1. Construir consulta geoespacial para la base de datos
  // ST_DWithin calcula qué puntos están dentro del radio especificado
  // ST_MakePoint crea un punto con las coordenadas dadas
  // ST_SetSRID establece el sistema de referencia espacial (4326 es el estándar para GPS)
  const query = poiRepository.createQueryBuilder('poi')
    .where(`ST_DWithin(
      poi.location::geography,
      ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
      :distance
    )`, {
      latitude,
      longitude,
      distance: radiusInKm * 1000 // Convertir a metros
    });
  
  // 2. Aplicar filtros adicionales si existen
  if (filters?.category) {
    query.andWhere('poi.category = :category', { category: filters.category });
  }
  
  // 3. Ordenar resultados por distancia
  query.orderBy(`ST_Distance(
    poi.location::geography,
    ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
  )`, 'ASC');
  
  // 4. Limitar resultados a un número máximo
  query.limit(10);
  
  return await query.getMany();
};
