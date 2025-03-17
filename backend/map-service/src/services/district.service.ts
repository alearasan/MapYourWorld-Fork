/**
 * Servicio de Distritos
 * Gestiona la creación, consulta y desbloqueo de distritos del mapa
 */

//import { publishEvent } from '@shared/libs/rabbitmq';
import db from '../../../database/db';
import { District } from '../models/district.model';
import { AppDataSource } from '../../../database/appDataSource';
import DistrictRepository from '../repositories/district.repository';
import MapRepository from '../repositories/map.repository';
import * as fs from 'fs';
import { Geometry } from 'geojson';
import {AuthRepository} from '../../../auth-service/src/repositories/auth.repository';
import RegionRepository from '../repositories/region.repository';

const filePath = 'database/map.geojson';
const rawData = fs.readFileSync(filePath, 'utf-8');
const geojsonData = JSON.parse(rawData);

const repo = new DistrictRepository();
const mapRepo = new MapRepository();
const userRepo = new AuthRepository();    
const regionRepo = new RegionRepository();


/**
 * Crea un nuevo distrito
 * @param districtData Datos del distrito a crear
 * @param userId ID del usuario administrador que crea el distrito
 */



export const createDistrict = async (
  userId?: string,
  regionId?: string,
  
): Promise<void> => {
  var user: any = null;
  var region: any = null;
  try {
    if ( userId && regionId) {
          user = await userRepo.findById(userId);
          region = await regionRepo.getRegionById(regionId)
      if (!region || !user) {
        throw new Error("No se encontró la región o el usuario");
      }
  }
    const districtData = geojsonData.features.map((feature: any, index: number) => ({
        name: `Distrito ${index + 1}`, // Asigna un nombre genérico si no hay "properties"
        description: 'Descripción genérica del distrito.', // Se puede personalizar
        boundaries: {
            type: feature.geometry.type,
            coordinates: feature.geometry.coordinates
        } as Geometry,
        isUnlocked: false,
        user: user,
        region_assignee:region
    }));


    for (const district of districtData) {
      await repo.createDistrict(district);
    }


  } catch (error) {
    console.log(error)
  }
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
export const getAllDistricts = async (): Promise<District[]> => {
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
  userId: string,
  regionId:string
): Promise<{
  success: boolean;
  message?: string;
}> => {
  // TODO: Implementar el desbloqueo de un distrito
  // 1. Verificar si el usuario puede desbloquear el distrito
  const unlockedDistrict = await repo.unlockDistrict(districtId,userId,regionId);
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

/**
 * Obtiene los distritos asociados a un mapa específico
 * @param mapId ID del mapa
 */
export const getDistrictsByMapId = async (mapId: string): Promise<any[]> => {
  try {
    console.log(`Buscando distritos para el mapa ${mapId}`);
    const districts = await repo.getDistrictsByMapId(mapId);
    console.log(`Se encontraron ${districts.length} distritos para el mapa ${mapId}`);
    return districts;
  } catch (error) {
    console.error(`Error al obtener distritos para el mapa ${mapId}:`, error);
    throw new Error(`Error al obtener distritos para el mapa ${mapId}`);
  }
};

/**
 * Desbloquea un distrito en un mapa colaborativo para un usuario específico
 * @param districtId ID del distrito a desbloquear
 * @param userId ID del usuario que desbloquea el distrito
 * @param mapId ID del mapa colaborativo
 * @param regionId ID de la región donde pertenecen los distritos
 */
export const unlockCollaborativeDistrict = async (
  districtId: string,
  userId: string,
  mapId: string,
  regionId:string
): Promise<{ success: boolean; message: string; district?: any }> => {
  try {
    // 1. Verificar que el distrito existe y pertenece al mapa indicado
    const district = await repo.getDistrictById(districtId);
    if (!district) {
      return { success: false, message: `Distrito con ID ${districtId} no encontrado` };
    }
    
    // 2. Verificar que el distrito pertenece a la región indicada
    if (district.region_assignee?.id !== regionId) {
      return { success: false, message: `El distrito no pertenece al mapa indicado` };
    }
    
    // 3. Verificar si el distrito ya está desbloqueado
    if (district.isUnlocked) {
      return { success: false, message: `El distrito ya está desbloqueado por otro usuario` };
    }
    
    // 4. Verificar que el usuario existe
    const user = await userRepo.findById(userId);
    if (!user) {
      return { success: false, message: `Usuario con ID ${userId} no encontrado` };
    }
    
    // 5. Verificar que el usuario pertenece al mapa colaborativo
    const map = await mapRepo.getMapById(mapId);
    const userBelongsToMap = map.users_joined.some((u: any) => u.id === userId);
    if (!userBelongsToMap) {
      return { success: false, message: `El usuario no pertenece al mapa colaborativo` };
    }
    
    // 6. Desbloquear el distrito y asignar el usuario
    district.isUnlocked = true;
    district.user = user;
    await repo.updateDistrict(districtId, district);
    
    console.log(`Distrito ${districtId} desbloqueado por usuario ${userId} en mapa ${mapId}`);
    
    return { 
      success: true, 
      message: `Distrito desbloqueado correctamente por el usuario ${userId}`,
      district
    };
  } catch (error) {
    console.error(`Error al desbloquear distrito ${districtId} en mapa colaborativo:`, error);
    return { success: false, message: `Error al desbloquear distrito: ${error instanceof Error ? error.message : 'Error desconocido'}` };
  }
}; 