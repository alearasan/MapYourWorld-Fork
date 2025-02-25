/**
 * Rutas para las funcionalidades de fotos
 */

import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as photoController from '../controllers/photo.controller';

const router: Router = Router();

// Ruta para subir una nueva foto
router.post(
  '/',
  [
    body('userId').notEmpty().withMessage('ID de usuario requerido'),
    body('title').notEmpty().withMessage('Título requerido'),
    body('location').isObject().withMessage('Ubicación requerida'),
    body('location.lat').isNumeric().withMessage('Latitud debe ser numérica'),
    body('location.lng').isNumeric().withMessage('Longitud debe ser numérica'),
    body('base64Image').notEmpty().withMessage('Imagen requerida'),
    body('poiId').notEmpty().withMessage('ID de punto de interés requerido'),
    body('districtId').notEmpty().withMessage('ID de distrito requerido')
  ],
  photoController.uploadPhoto
);

// Ruta para obtener una foto por su ID
router.get(
  '/:photoId',
  [
    param('photoId').notEmpty().withMessage('ID de foto requerido')
  ],
  photoController.getPhotoById
);

// Ruta para eliminar una foto
router.delete(
  '/:photoId',
  [
    param('photoId').notEmpty().withMessage('ID de foto requerido'),
    body('userId').notEmpty().withMessage('ID de usuario requerido')
  ],
  photoController.deletePhoto
);

// Ruta para obtener fotos por ubicación
router.get(
  '/location/nearby',
  [
    query('lat').isNumeric().withMessage('Latitud debe ser numérica'),
    query('lng').isNumeric().withMessage('Longitud debe ser numérica'),
    query('radius').isNumeric().withMessage('Radio debe ser numérico')
  ],
  photoController.getPhotosByLocation
);

export default router; 