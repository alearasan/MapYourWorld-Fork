/**
 * Servicio de funcionalidades sociales
 * Gestiona comentarios, likes, fotos y seguimiento entre usuarios
 */

import { Social } from '@types';
import { publishEvent } from '@shared/libs/rabbitmq';
import type { FriendshipStatus } from '@backend/types/social/social.types';

// Importando el enum directamente de su ubicación para poder usarlo como valor
import { FriendshipStatus as FriendshipStatusEnum } from '@backend/types/social/social.types';

/**
 * Publica un comentario en una foto o punto de interés
 * @param userId ID del usuario que comenta
 * @param content Contenido del comentario
 * @param targetType Tipo de objetivo (photo o poi)
 * @param targetId ID del objetivo
 */
export const postComment = async (
  userId: string, 
  content: string, 
  targetType: 'photo' | 'poi', 
  targetId: string
): Promise<Social.Comment> => {
  // TODO: Implementar publicación de comentario
  // 1. Validar contenido
  // 2. Verificar que el objetivo existe
  // 3. Crear comentario
  // 4. Publicar evento de comentario creado
  
  // Simulación de un comentario
  const comment: Social.Comment = {
    id: `comment_${Date.now()}`,
    userId,
    poiId: targetType === 'poi' ? targetId : '',
    content,
    likes: 0,
    createdAt: new Date().toISOString()
  };
  
  // Publicar evento de comentario creado
  await publishEvent('comment.created', {
    commentId: comment.id,
    userId,
    targetType,
    targetId,
    content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
    createdAt: comment.createdAt
  });
  
  return comment;
};

/**
 * Da like a una foto o comentario
 * @param userId ID del usuario que da like
 * @param targetType Tipo de objetivo (photo o comment)
 * @param targetId ID del objetivo
 */
export const addLike = async (
  userId: string, 
  targetType: 'photo' | 'comment', 
  targetId: string
): Promise<Social.Reaction> => {
  // TODO: Implementar adición de like
  // 1. Verificar que el objetivo existe
  // 2. Comprobar si ya existe un like previo
  // 3. Crear like
  // 4. Publicar evento de like creado
  
  // Simulación de una reacción para evitar el error
  const reaction: Social.Reaction = {
    id: `like_${Date.now()}`,
    userId,
    targetType,
    targetId,
    type: 'like',
    createdAt: new Date().toISOString()
  };
  
  // Publicar evento de like añadido
  await publishEvent('like.added', {
    reactionId: reaction.id,
    userId,
    targetType,
    targetId,
    createdAt: reaction.createdAt
  });
  
  return reaction;
};

/**
 * Quita like a una foto o comentario
 * @param userId ID del usuario
 * @param targetType Tipo de objetivo
 * @param targetId ID del objetivo
 */
export const removeLike = async (
  userId: string, 
  targetType: 'photo' | 'comment', 
  targetId: string
): Promise<boolean> => {
  // TODO: Implementar eliminación de like
  // 1. Buscar el like existente
  // 2. Eliminarlo si existe
  
  // Publicar evento de like eliminado
  await publishEvent('like.removed', {
    userId,
    targetType,
    targetId,
    removedAt: new Date().toISOString()
  });
  
  return true;
};

/**
 * Sigue a otro usuario
 * @param followerId ID del usuario que sigue
 * @param followingId ID del usuario a seguir
 */
export const followUser = async (followerId: string, followingId: string): Promise<Social.Friendship> => {
  // TODO: Implementar seguimiento de usuario
  // 1. Verificar que ambos usuarios existen
  // 2. Comprobar si ya existe el seguimiento
  // 3. Crear relación de seguimiento
  // 4. Publicar evento de nuevo seguidor
  
  // Simulación de un seguimiento
  const friendship: Social.Friendship = {
    id: `follow_${Date.now()}`,
    requesterId: followerId,
    addresseeId: followingId,
    status: FriendshipStatusEnum.ACCEPTED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Publicar evento de seguimiento creado
  await publishEvent('user.followed', {
    friendshipId: friendship.id,
    followerId,
    followingId,
    createdAt: friendship.createdAt
  });
  
  return friendship;
};

/**
 * Deja de seguir a un usuario
 * @param followerId ID del usuario que deja de seguir
 * @param followingId ID del usuario que ya no se sigue
 */
export const unfollowUser = async (followerId: string, followingId: string): Promise<boolean> => {
  // TODO: Implementar dejar de seguir
  // 1. Buscar la relación de seguimiento
  // 2. Eliminarla si existe
  
  // Publicar evento de seguimiento eliminado
  await publishEvent('user.unfollowed', {
    followerId,
    followingId,
    unfollowedAt: new Date().toISOString()
  });
  
  return true;
};

/**
 * Obtiene los seguidores de un usuario
 * @param userId ID del usuario
 */
export const getUserFollowers = async (userId: string): Promise<any[]> => {
  // TODO: Implementar obtención de seguidores
  // 1. Buscar todas las relaciones donde el usuario es seguido
  // 2. Obtener detalles básicos de cada seguidor
  
  // Simulación de seguidores para evitar el error
  return [
    {
      userId: `user_${Date.now()}_1`,
      username: 'usuario1',
      profileImage: 'https://example.com/profile1.jpg'
    },
    {
      userId: `user_${Date.now()}_2`,
      username: 'usuario2',
      profileImage: 'https://example.com/profile2.jpg'
    }
  ];
}; 