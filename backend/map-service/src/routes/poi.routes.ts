import { Router } from 'express';
import * as POIController from '../controllers/poi.controller';

const router: Router = Router();

// Crear un nuevo POI
router.post('/', POIController.createPOI);

// Crear POI sin token
router.post('/sin-token', POIController.createPOISinToken);

// Rutas específicas primero
router.get('/all', POIController.getAllPOIs);
router.get('/nearby', POIController.findNearbyPOIs);
router.get('/map/:mapId', POIController.getPOIsByMapId);

// Rutas con parámetros de ID al final
router.get('/:id', POIController.getPOIById);
router.put('/:id', POIController.updatePOI);
router.delete('/:id', POIController.deletePOI);

export default router;