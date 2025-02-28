/**
 * Servicio de Distritos
 * Gestiona la creación, consulta y desbloqueo de distritos del mapa
 */

import { publishEvent } from '@shared/libs/rabbitmq';
import db from '@backend/database/db';
import { District } from '@backend/map-service/src/models/district.model';
import { AppDataSource } from '@backend/database/appDataSource';


/**
 * Crea un nuevo distrito
 * @param districtData Datos del distrito a crear
 * @param userId ID del usuario administrador que crea el distrito
 */
export const createDistrict = async (
  districtData: Omit<District, 'id'>,
  userId: string
): Promise<District> => {

  const districtRepository = AppDataSource.getRepository(District);

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

    // 4. Guardar el distrito en la base de datos

    const newDistrict = districtRepository.create({
      ...districtData,
    });

    const createdDistrict = await districtRepository.save(newDistrict);


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
  // 2. Retornar null si no se encuentra

  throw new Error('Método no implementado');
};

/**
 * Obtiene todos los distritos
 * @param includeInactive Indica si se deben incluir distritos inactivos
 */
export const getAllDistricts = async (includeInactive: boolean = false): Promise<District[]> => {
  // TODO: Implementar la obtención de todos los distritos
  // 1. Consultar todos los distritos en la base de datos
  // 2. Filtrar por estado activo/inactivo según el parámetro
  // 3. Ordenar por nivel o algún otro criterio relevante

  throw new Error('Método no implementado');
};

/**
 * Actualiza un distrito existente
 * @param districtId ID del distrito a actualizar
 * @param updateData Datos a actualizar del distrito
 * @param userId ID del usuario administrador que realiza la actualización
 */
export const updateDistrict = async (
  districtId: string,
  updateData: Partial<Omit<District, 'id' | 'createdAt' | 'updatedAt'>>,
  userId: string
): Promise<District | null> => {
  // TODO: Implementar la actualización de un distrito
  // 1. Verificar que el distrito existe
  // 2. Comprobar que el usuario tiene permisos de administrador
  // 3. Validar los datos de actualización
  // 4. Si se modifican los límites, verificar que no hay solapamiento
  // 5. Actualizar el distrito en la base de datos
  // 6. Publicar evento de distrito actualizado

  throw new Error('Método no implementado');
};

/**
 * Comprueba si un usuario puede desbloquear un distrito
 * @param districtId ID del distrito a desbloquear
 * @param userId ID del usuario que intenta desbloquear
 */
export const canUnlockDistrict = async (
  districtId: string,
  userId: string
): Promise<{
  canUnlock: boolean;
  requirementsMet: string[];
  requirementsMissing: string[];
}> => {
  // TODO: Implementar la verificación de requisitos para desbloquear distrito
  // 1. Obtener el distrito y sus requisitos
  // 2. Obtener el progreso del usuario
  // 3. Comprobar si el usuario cumple con los puntos necesarios
  // 4. Comprobar si ha desbloqueado los distritos previos requeridos
  // 5. Comprobar si ha completado las tareas necesarias
  // 6. Retornar resultado detallado con requisitos cumplidos y faltantes

  throw new Error('Método no implementado');
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
  // 2. Si no cumple los requisitos, retornar error
  // 3. Registrar el desbloqueo en la base de datos
  // 4. Otorgar recompensas al usuario
  // 5. Publicar evento de distrito desbloqueado

  throw new Error('Método no implementado');
};

/**
 * Obtiene los distritos desbloqueados por un usuario
 * @param userId ID del usuario
 */
export const getUserUnlockedDistricts = async (userId: string): Promise<District[]> => {
  // TODO: Implementar la obtención de distritos desbloqueados por un usuario
  // 1. Consultar los registros de desbloqueo del usuario
  // 2. Obtener los datos completos de los distritos desbloqueados
  // 3. Ordenar por fecha de desbloqueo o nivel

  throw new Error('Método no implementado');
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
  // TODO: Implementar la búsqueda de distrito que contiene una ubicación
  // 1. Construir consulta geoespacial para la base de datos
  // 2. Buscar distritos cuyo polígono contiene el punto especificado
  // 3. Retornar el distrito encontrado o null

  throw new Error('Método no implementado');
}; 