import { Request, Response } from 'express';
import * as PhotoService from '../services/photo.service';


/**
 * Obtener todas las fotos
 */
export const findAllPhotos = async (req: Request, res: Response): Promise<void> => {
  try {
    const photos= PhotoService.findAllPhotos();
    res.status(200).json({ success: true, message: 'Fotos obtenidas correctamente', data: photos});
  }catch(error){
    console.error('Error al obtener las fotos:', error);
    res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Error al obtener las fotos' });
  }
}
/**
 * Sube una nueva foto
 */
export const uploadPhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const {poiId} = req.params;
    const {photoData}=req.body;
    if (!photoData) {
        res.status(400).json({ success: false, message: 'No se encontró ninguna foto' });
        return;
    }if (!poiId) {
        res.status(400).json({ success: false, message: 'No se encontró el punto de interés' });
        return;
    }
    await PhotoService.uploadPhotoToPoi(photoData,poiId);
    res.status(200).json({ success: true, message: 'Foto subida correctamente' });
  } catch (error) {
    console.error('Error al subir una foto:', error);
    res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Error al subir la foto' });
  }
};

/**
 * Obtiene una foto por su ID
 */
export const getPhotoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { photoId } = req.params;
    const photo = await PhotoService.findPhotoById(photoId);
    if (!photo) {
      res.status(400).json({ success: true, message: 'No se encontró la foto', data: null});
      return;
    }
    
    res.status(200).json({success: true,message: 'Foto obtenida correctamente',data: photo});
  } catch (error) {
    console.error('Error al obtener foto:', error);
    res.status(500).json({success: false,message: 'Error al procesar la solicitud',data: null});
  }
};
/**
 * Actualizar una foto
 */
export const updatePhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { photoId } = req.params;
    const { photoData } = req.body;

    const photo=await PhotoService.updatePhoto(photoId,photoData);
    res.status(200).json({success: true,message: 'Foto actualizada correctamente',data: photo});
    
  } catch (error) {
    console.error('Error al obtener foto:', error);
    res.status(500).json({success: false,message: 'Error al procesar la solicitud',data: null});
  }
}
/**
 * Elimina una foto
 */
export const deletePhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { photoId } = req.params;
    
    if (!photoId) {
      res.status(400).json({success: false,message: 'IDs de foto requerido',data: null});
      return;
    }
    
    const photo = await PhotoService.deletePhoto(photoId);
    
    if (!photo) {
      res.status(400).json({success: false,message: 'Foto no encontrada',data: null});
      return;
    }
    
    res.status(200).json({success: true,message: 'Foto eliminada correctamente',data: photo});
  } catch (error) {
    console.error('Error al eliminar foto:', error);
    res.status(500).json({success: false,message: 'Error al procesar la solicitud',data: null
    });
  }
};

/**
 * Obtiene fotos por punto de interés
 */
export const getPhotosofPoi = async (req: Request, res: Response): Promise<void> => {
  try {
    const {poiId}=req.params;

    const photos=PhotoService.getPhotosByPoiId(poiId);
    res.status(200).json({success: true, message: 'Fotos obtenidas correctamente',data: photos});

  } catch (error) {
    console.error('Error al obtener fotos:', error);
    res.status(500).json({success: false,message: 'Error al obtener fotos',data: null});
  }
}; 

