/**
 * Re-exportación de tipos para el servicio social
 */

import { Request } from 'express';

// Importar desde la estructura centralizada de tipos usando alias
import { Auth, Social, Map } from '@types';

/** Solicitud autenticada con datos de usuario */
export interface AuthenticatedRequest extends Request {
  user?: Auth.UserData;
  token?: string;
}

/** Respuesta estándar del controlador social */
export interface SocialControllerResponse {
  success: boolean;
  message: string;
  data?: any;
  statusCode: number;
}

/** Evento de comentario creado */
export interface CommentCreatedEvent {
  eventType: 'COMMENT_CREATED';
  timestamp: string;
  data: {
    commentId: string;
    userId: string;
    targetType: 'photo' | 'poi';
    targetId: string;
    content: string;
  };
}

/** Evento de like añadido */
export interface LikeAddedEvent {
  eventType: 'LIKE_ADDED';
  timestamp: string;
  data: {
    reactionId: string;
    userId: string;
    targetType: 'photo' | 'comment';
    targetId: string;
  };
}

/** Evento de foto subida */
export interface PhotoUploadedEvent {
  eventType: 'PHOTO_UPLOADED';
  timestamp: string;
  data: {
    photoId: string;
    userId: string;
    caption: string;
    poiId: string;
    districtId: string;
    url: string;
  };
}

/** Evento de usuario seguido */
export interface UserFollowedEvent {
  eventType: 'USER_FOLLOWED';
  timestamp: string;
  data: {
    friendshipId: string;
    followerId: string;
    followingId: string;
  };
}

/** Configuración del servicio social */
export interface SocialServiceConfig {
  port: number;
  uploadDir: string;
  maxPhotoSize: number;
  maxCommentsPerPage: number;
}

// Re-exportar tipos específicos
export type {
  Social,
  Map
}; 