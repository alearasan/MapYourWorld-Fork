/**
 * Servicio de Amigos
 * Gestiona la creación, consulta, actualización y 
 * eliminación de solicitudes y relaciones de amistad entre usuarios.
 */

import { Friend, FriendStatus } from '../models/friend.model';
import FriendRepository from '../repositories/friend.repository';
import { User } from '../../../auth-service/src/models/user.model';
import { AppDataSource } from '../../../database/appDataSource';

const repo = new FriendRepository();

/**
 * Crea una nueva solicitud de amistad.
 * Valida que se proporcionen los datos obligatorios: receptor, solicitante y estado de la solicitud.
 *
 * @param friendData Datos de la solicitud de amistad (excluyendo el ID)
 * @returns La solicitud de amistad creada
 */
export const createFriend = async (
  friendData: Omit<Friend, 'id'>
): Promise<Friend> => {
  try {
    if (!friendData.recipient || !friendData.requester || !friendData.status) {
      throw new Error("Los datos de receptor, solicitante y estado de la petición son necesarios.");
    }

    const requesterId = typeof friendData.requester === 'string' ? friendData.requester : friendData.requester.id;
    const recipientId = typeof friendData.recipient === 'string' ? friendData.recipient : friendData.recipient.id;

    if (requesterId === recipientId) {
      throw new Error("El receptor y el solicitante deben ser distintos.");
    }

    const userRepository = AppDataSource.getRepository(User);

    const requester = await userRepository.findOne({ where: { id: requesterId } });
    if (!requester) {
      throw new Error(`Usuario solicitante con ID ${requesterId} no encontrado`);
    }

    const recipient = await userRepository.findOne({ where: { id: recipientId } });
    if (!recipient) {
      throw new Error(`Usuario receptor con ID ${recipientId} no encontrado`);
    }

    const newFriend = repo.createFriend(friendData);
    console.log("Solicitud de amistad creada:", newFriend);
    return newFriend;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Lista las solicitudes de amistad de un usuario según el estado indicado.
 *
 * @param status Estado de la solicitud de amistad (PENDING, ACCEPTED, BLOCKED)
 * @param userId ID del usuario
 * @returns Lista de solicitudes de amistad
 */
export const listFriends = async (
  status: FriendStatus,
  userId: string
): Promise<Friend[]> => {
  const friends = await repo.findAllByIdAndStatus(userId, status);
  if (friends.length === 0) {
    throw new Error(`No se encontraron solicitudes de amistad para el usuario con ID ${userId}`);
  }
  return friends;
};

/**
 * Obtiene una solicitud de amistad por su ID.
 *
 * @param friendId ID de la solicitud de amistad
 * @returns La solicitud de amistad encontrada o lanza un error si no existe
 */
export const findFriendById = async (friendId: string): Promise<Friend | null> => {
  const friend = await repo.getFriendById(friendId);
  if (friend === null) {
    throw new Error(`Solicitud de amistad con ID ${friendId} no encontrada`);
  } else {
    return friend;
  }
};

/**
 * Busca usuarios por nombre para facilitar la selección de amigos.
 *
 * @param nameData Texto de búsqueda del nombre del usuario
 * @returns Lista de usuarios que coinciden con el criterio de búsqueda
 */
export const listSearchUser = async (
  nameData: string
): Promise<User[]> => {
  const users = await repo.findAllUsersByName(nameData);
  return users;
};

/**
 * Actualiza el estado de una solicitud de amistad.
 *
 * @param friendId ID de la solicitud de amistad a actualizar
 * @returns Objeto con el resultado de la actualización
 */
export const updateFriendStatus = async (
  friendId: string,
): Promise<{
  success: boolean;
  message?: string;
}> => {
  const updatedFriend = await repo.updateFriendStatus(friendId);
  if (updatedFriend.status === FriendStatus.ACCEPTED) {
    return { success: true, message: 'Solicitud de amistad aceptada correctamente' };
  } else {
    throw new Error('Error al actualizar el estado de la solicitud de amistad');
  }
};

/**
 * Elimina una solicitud de amistad.
 *
 * @param friendId ID de la solicitud de amistad a eliminar
 */
export const deleteFriend = async (friendId: string): Promise<void> => {
  await repo.deleteFriend(friendId);
};
