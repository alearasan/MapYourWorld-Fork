// In backend/map-service/src/routes/location.routes.ts
import { Router } from 'express';
import * as locationController from '../controllers/location.controller';
import { authMiddleware } from '@backend/auth-service/src/controllers/auth.middleware';

const router = Router();

// Ruta sin autenticación para pruebas
router.post('/test-location', locationController.saveUserLocation);

// Protected route - requires authentication
router.post('/user-location', authMiddleware(), locationController.saveUserLocation);

export default router;