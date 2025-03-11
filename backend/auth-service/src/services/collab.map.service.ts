import CollabMapRepository from '../repositories/collab.map.repository'; 

const repo = new CollabMapRepository();


/**
 * Unirse a un mapa existente
 * @param MapId ID del mapa a actualizar
 * @param userId ID del usuario que realiza la actualización 
 */
export const joinMap = async (
  MapId: string,
  UserId: string
): Promise<void> => {
  // TODO: Implementar la union a un mapa
  try {
    await repo.joinMap(MapId, UserId);
  } catch (error) {
    console.error("Error al unirte al mapa:", error);
    throw error;
  }

};
