/**
 * Servicio de mapas
 * Gestiona la creación, consulta y desbloqueo de mapas del mapa
 */

//import { publishEvent } from '@shared/libs/rabbitmq';
import db from '../../../database/db';
import { Map } from '../models/map.model';
import { AppDataSource } from '../../../database/appDataSource';
import MapRepository from '../repositories/map.repository';

const repo = new MapRepository();




/**
 * Crea un nuevo mapa
 * @param MapData Datos del mapa a crear
 */

export const createMap = async (
  MapData: Omit<Map, 'id'>,
): Promise<Map> => {

  try {

    if (!MapData.name || !MapData.createdAt) {
      throw new Error("No pueden faltar algunos datos importantes como el nombre o fecha.")
    }

    const newMap = repo.createMap(MapData);

    // // 5. Publicar evento de mapa creado
    // await publishEvent('Map.created', {
    //   MapId: createdMap.id,
    //   name: createdMap.name,
    //   description: createdMap.description,
    //   timestamp: new Date()
    // });


    console.log("mapa creado correctamente:", newMap);
    return newMap;

  } catch (error) {
    throw new Error("Error al crear el mapa");
  }



};




export const createColaborativeMap = async (
  MapData: Omit<Map, 'id'>,
): Promise<Map> => {

  try {

    if (!MapData.name || !MapData.createdAt) {
      throw new Error("No pueden faltar algunos datos importantes como el nombre o fecha.")
    }

    const newMap = repo.createMapColaborativo(MapData);

    // // 5. Publicar evento de mapa creado
    // await publishEvent('Map.created', {
    //   MapId: createdMap.id,
    //   name: createdMap.name,
    //   description: createdMap.description,
    //   timestamp: new Date()
    // });


    console.log("mapa colaborativo creado correctamente:", newMap);
    return newMap;

  } catch (error) {
    throw new Error("Error al crear el mapa colaborativo");
  }



};



 

/**
 * Obtiene un mapa por su ID
 * @param MapId ID del mapa a obtener
 */
export const getMapById = async (MapId: string): Promise<Map | null> => {
  // TODO: Implementar la obtención de un mapa por ID
  // 1. Buscar el mapa en la base de datos
  const Map = await repo.getMapById(MapId);


  // 2. Retornar null si no se encuentra
  if (Map === null) {
    throw new Error(`mapa con ID ${MapId} no encontrado`);
  }
  else {
    return Map;
  }

};

/**
 * Actualiza un mapa existente
 * @param MapId ID del mapa a actualizar
 * @param updateData Datos a actualizar del mapa
 */
export const updateMap = async (
  MapId: string,
  updateData: Partial<Omit<Map, 'id'>>
  // userId: string
): Promise<Map | null> => {
  // TODO: Implementar la actualización de un mapa
  try {

    // 3. Validar los datos de actualización
    if (!updateData.name || !updateData.description) {
      throw new Error("No pueden faltar algunos datos importantes como el nombre o coordenadas.");
    }

    // 4. Si se modifican los límites, verificar que no hay solapamiento
  

    // 5. Actualizar el mapa en la base de datos
    const savedMap = await repo.updateMap(MapId, updateData);

    return savedMap;

  } catch (error) {
    console.error("Error al actualizar el mapa:", error);
    throw error;
  }

};

/**
 * Elimina un mapa existente
 * @param MapId ID del mapa a eliminar
 */
export const deleteMap = async (MapId: string): Promise<{ success: boolean; message?: string }> => {
  try {
    // 1. Verificar que el mapa existe
    const map = await repo.getMapById(MapId);
    if (!map) {
      return { success: false, message: `Mapa con ID ${MapId} no encontrado` };
    }

    // 2. Comprobar que el usuario tiene permisos para eliminar el mapa (opcional, según tu lógica de negocio)

    // 3. Eliminar el mapa de la base de datos
    await repo.deleteMap(MapId);

    // 4. Publicar evento de mapa eliminado (opcional, según tu lógica de negocio)

    // 5. Retornar éxito
    return { success: true, message: 'Mapa eliminado correctamente' };
  } catch (error) {
    console.error("Error al eliminar el mapa:", error);
    return { success: false, message: 'Error al eliminar el mapa' };
  }
};
