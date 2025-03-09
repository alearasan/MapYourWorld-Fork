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
 * @param userId ID del usuario administrador que crea el mapa
 */

export const createMap = async (
  MapData: Omit<Map, 'id'>,
): Promise<Map> => {

  try {

    if (!MapData.name || !MapData.description) {
      throw new Error("No pueden faltar algunos datos importantes como el nombre o descripción.")
    }

    const newMap = repo.createMap(MapData);

    // // 5. Publicar evento de mapa creado
    // await publishEvent('Map.created', {
    //   MapId: createdMap.id,
    //   name: createdMap.name,
    //   description: createdMap.description,
    //   boundaries: createdMap.boundaries,
    //   timestamp: new Date()
    // });


    console.log("mapa creado correctamente:", newMap);
    return newMap;

  } catch (error) {
    console.log(error)
  }



  throw new Error('Método no implementado');
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
 * @param userId ID del usuario administrador que realiza la actualización
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
