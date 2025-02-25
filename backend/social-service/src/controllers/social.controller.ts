/**
 * Controlador para funcionalidades sociales
 * Gestiona las peticiones relacionadas con comentarios, likes y seguimiento de usuarios
 */

import { Request, Response } from 'express';
import * as socialService from '../services/social.service';

/**
 * Añade un comentario a una foto o punto de interés
 */
export const addComment = async (req: Request, res: Response) => {
  try {
    const { userId, content, targetType, targetId } = req.body;
    
    if (!userId || !content || !targetType || !targetId) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos',
        data: null
      });
    }
    
    const comment = await socialService.postComment(userId, content, targetType, targetId);
    
    return res.status(201).json({
      success: true,
      message: 'Comentario añadido correctamente',
      data: comment
    });
  } catch (error) {
    console.error('Error al añadir comentario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud',
      data: null
    });
  }
};

/**
 * Añade un like a una foto o comentario
 */
export const addLike = async (req: Request, res: Response) => {
  try {
    const { userId, targetType, targetId } = req.body;
    
    if (!userId || !targetType || !targetId) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos',
        data: null
      });
    }
    
    const reaction = await socialService.addLike(userId, targetType, targetId);
    
    return res.status(200).json({
      success: true,
      message: 'Like añadido correctamente',
      data: reaction
    });
  } catch (error) {
    console.error('Error al añadir like:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud',
      data: null
    });
  }
};

/**
 * Elimina un like de una foto o comentario
 */
export const removeLike = async (req: Request, res: Response) => {
  try {
    const { userId, targetType, targetId } = req.body;
    
    if (!userId || !targetType || !targetId) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos',
        data: null
      });
    }
    
    const result = await socialService.removeLike(userId, targetType, targetId);
    
    return res.status(200).json({
      success: true,
      message: 'Like eliminado correctamente',
      data: { success: result }
    });
  } catch (error) {
    console.error('Error al eliminar like:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud',
      data: null
    });
  }
};

/**
 * Sigue a un usuario
 */
export const followUser = async (req: Request, res: Response) => {
  try {
    const { followerId, followingId } = req.body;
    
    if (!followerId || !followingId) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos',
        data: null
      });
    }
    
    const friendship = await socialService.followUser(followerId, followingId);
    
    return res.status(200).json({
      success: true,
      message: 'Usuario seguido correctamente',
      data: friendship
    });
  } catch (error) {
    console.error('Error al seguir usuario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud',
      data: null
    });
  }
};

/**
 * Deja de seguir a un usuario
 */
export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const { followerId, followingId } = req.body;
    
    if (!followerId || !followingId) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos',
        data: null
      });
    }
    
    const result = await socialService.unfollowUser(followerId, followingId);
    
    return res.status(200).json({
      success: true,
      message: 'Has dejado de seguir al usuario',
      data: { success: result }
    });
  } catch (error) {
    console.error('Error al dejar de seguir usuario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud',
      data: null
    });
  }
};

/**
 * Obtiene los seguidores de un usuario
 */
export const getFollowers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario requerido',
        data: null
      });
    }
    
    const followers = await socialService.getUserFollowers(userId);
    
    return res.status(200).json({
      success: true,
      message: 'Seguidores obtenidos correctamente',
      data: followers
    });
  } catch (error) {
    console.error('Error al obtener seguidores:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud',
      data: null
    });
  }
}; 