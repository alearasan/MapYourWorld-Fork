/**
 * Controlador para funcionalidades de fotos
 * Gestiona las peticiones relacionadas con subida, recuperación y eliminación de fotos
 */

import { Request, Response } from 'express';
import * as photoService from '../services/photo.service';

/**
 * Sube una nueva foto
 */
export const uploadPhoto = async (req: Request, res: Response) => {
  try {
    const { userId, title, description, location, base64Image, poiId, districtId } = req.body;
    
    if (!userId || !title || !location || !base64Image || !poiId || !districtId) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos',
        data: null
      });
    }
    
    const photo = await photoService.uploadPhoto(
      userId, 
      title, 
      description, 
      location, 
      base64Image,
      poiId,
      districtId
    );
    
    return res.status(201).json({
      success: true,
      message: 'Foto subida correctamente',
      data: photo
    });
  } catch (error) {
    console.error('Error al subir foto:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud',
      data: null
    });
  }
};

/**
 * Obtiene una foto por su ID
 */
export const getPhotoById = async (req: Request, res: Response) => {
  try {
    const { photoId } = req.params;
    
    if (!photoId) {
      return res.status(400).json({
        success: false,
        message: 'ID de foto requerido',
        data: null
      });
    }
    
    const photo = await photoService.getPhotoById(photoId);
    
    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Foto no encontrada',
        data: null
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Foto obtenida correctamente',
      data: photo
    });
  } catch (error) {
    console.error('Error al obtener foto:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud',
      data: null
    });
  }
};

/**
 * Elimina una foto
 */
export const deletePhoto = async (req: Request, res: Response) => {
  try {
    const { photoId } = req.params;
    const { userId } = req.body;
    
    if (!photoId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'IDs de foto y usuario requeridos',
        data: null
      });
    }
    
    const result = await photoService.deletePhoto(photoId, userId);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Foto no encontrada o no tienes permisos para eliminarla',
        data: null
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Foto eliminada correctamente',
      data: { success: result }
    });
  } catch (error) {
    console.error('Error al eliminar foto:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud',
      data: null
    });
  }
};

/**
 * Obtiene fotos por ubicación
 */
export const getPhotosByLocation = async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius } = req.query;
    
    if (!lat || !lng || !radius) {
      return res.status(400).json({
        success: false,
        message: 'Ubicación y radio requeridos',
        data: null
      });
    }
    
    const photos = await photoService.getPhotosByLocation(
      parseFloat(lat as string), 
      parseFloat(lng as string), 
      parseFloat(radius as string)
    );
    
    return res.status(200).json({
      success: true,
      message: 'Fotos obtenidas correctamente',
      data: photos
    });
  } catch (error) {
    console.error('Error al obtener fotos por ubicación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud',
      data: null
    });
  }
}; 