/**
 * Servicio de Distritos
 * Gestiona la creación, consulta y desbloqueo de distritos del mapa
 */

import { publishEvent } from '@shared/libs/rabbitmq';
import db from '@backend/database/db';
import { District } from '@backend/map-service/src/models/district.model';
import { AppDataSource } from '@backend/database/appDataSource';
import DistrictRepository from '../repositories/district.repository';

const repo = new DistrictRepository();




/**
 * Crea un nuevo distrito
 * @param districtData Datos del distrito a crear
 * @param userId ID del usuario administrador que crea el distrito
 */



export const createDistrict = async (
  districtData: Omit<District, 'id'>,
  userId: string
): Promise<District> => {

  try {
    // TODO: Implementar la creación de un distrito
    // 1. Validar los datos del distrito
    if (!districtData.name || !districtData.boundaries || !districtData.description) {
      throw new Error("No pueden faltar algunos datos importantes como el nombre o coordenadas.")
    }

    // 2. Verificar que el usuario tiene permisos de administrador

    // 3. Validar que los límites geográficos no se solapan con otros distritos
    const existingDistrict = await db.oneOrNone(`
        SELECT 1 
        FROM district 
        WHERE ST_Intersects(boundaries, ST_GeomFromText($1, 4326))
      `, [districtData.boundaries]);

    if (existingDistrict) {
      throw new Error("Las coordenadas introducidas se solapan con otro distrito ya existente.")
    }


    // 3. Crear y guardar el distrito correctamente
    const newDistrict = repo.createDistrict(districtData);

    // // 5. Publicar evento de distrito creado
    // await publishEvent('district.created', {
    //   districtId: createdDistrict.id,
    //   name: createdDistrict.name,
    //   description: createdDistrict.description,
    //   boundaries: createdDistrict.boundaries,
    //   timestamp: new Date()
    // });


    console.log("Distrito creado correctamente:", newDistrict);
    return newDistrict;
    // 5. Publicar evento de distrito creado
    await publishEvent('district.created', {
      districtId: createdDistrict.id,
      name: createdDistrict.name,
      description: createdDistrict.description,
      boundaries: createdDistrict.boundaries,
      timestamp: new Date()
    });

  } catch (error) {
    console.log(error)
  }



  throw new Error('Método no implementado');
};


 

/**
 * Obtiene un distrito por su ID
 * @param districtId ID del distrito a obtener
 */
export const getDistrictById = async (districtId: string): Promise<District | null> => {
  // TODO: Implementar la obtención de un distrito por ID
  // 1. Buscar el distrito en la base de datos
  const district = await repo.getDistrictById(districtId);


  // 2. Retornar null si no se encuentra
  if (district === null) {
    throw new Error(`Distrito con ID ${districtId} no encontrado`);
  }
  else {
    return district;
  }

};

/**
 * Obtiene todos los distritos
 * @param includeInactive Indica si se deben incluir distritos inactivos
 */
export const getAllDistricts = async (includeInactive: boolean = false): Promise<District[]> => {
  // TODO: Implementar la obtención de todos los distritos
  // 1. Consultar todos los distritos en la base de datos
  const districts = await repo.getDistricts();
  return districts;
};

/**
 * Actualiza un distrito existente
 * @param districtId ID del distrito a actualizar
 * @param updateData Datos a actualizar del distrito
 * @param userId ID del usuario administrador que realiza la actualización
 */
export const updateDistrict = async (
  districtId: string,
  updateData: Partial<Omit<District, 'id'>>
  // userId: string
): Promise<District | null> => {
  // TODO: Implementar la actualización de un distrito
  try {

    // 3. Validar los datos de actualización
    if (!updateData.name || !updateData.boundaries || !updateData.description || updateData.isUnlocked === undefined) {
      throw new Error("No pueden faltar algunos datos importantes como el nombre o coordenadas.");
    }

    // 4. Si se modifican los límites, verificar que no hay solapamiento
    if (updateData.boundaries) {
      const existingDistrict = await AppDataSource.query(`
      SELECT 1 
      FROM district 
      WHERE ST_Intersects(boundaries, ST_GeomFromGeoJSON($1))
    `, [JSON.stringify(updateData.boundaries)]);
      if (existingDistrict.length > 0) {
        throw new Error("Las coordenadas introducidas se solapan con otro distrito ya existente.");
      }
    }

    // 5. Actualizar el distrito en la base de datos
    const savedDistrict = await repo.updateDistrict(districtId, updateData);

    return savedDistrict;

  } catch (error) {
    console.error("Error al actualizar el distrito:", error);
    throw error;
  }

};

/**
 * Desbloquea un distrito para un usuario
 * @param districtId ID del distrito a desbloquear
 * @param userId ID del usuario
 */
export const unlockDistrict = async (
  districtId: string,
  userId: string
): Promise<{
  success: boolean;
  message?: string;
}> => {
  // TODO: Implementar el desbloqueo de un distrito
  // 1. Verificar si el usuario puede desbloquear el distrito
  const unlockedDistrict = await repo.unlockDistrict(districtId);
  // 3. Publicar evento de distrito desbloqueado
  if (unlockedDistrict.isUnlocked === true) {
    return { success: true, message: 'Distrito desbloqueado correctamente' };
  } else {
    throw new Error('Error al desbloquear el distrito');
  }

};
/**
 * Obtiene los distritos desbloqueados por un usuario
 * @param userId ID del usuario
 */
export const getUserUnlockedDistricts = async (userId: string): Promise<District[]> => {
  // TODO: Implementar la obtención de distritos desbloqueados por un usuario
  // 1. Consultar los registros de desbloqueo del usuario
  const districts = await repo.getDistrictsUnlocked();
  return districts;

};

/**
 * Encuentra el distrito que contiene una ubicación geográfica
 * @param latitude Latitud de la ubicación
 * @param longitude Longitud de la ubicación
 */
export const findDistrictContainingLocation = async (
  latitude: number,
  longitude: number
): Promise<District | null> => {
  const situation = await repo.findDistrictContainingLocation(latitude, longitude);
  return situation;
}; 