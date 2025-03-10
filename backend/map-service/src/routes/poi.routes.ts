import { Router } from 'express';
import * as POIController from '../controllers/poi.controller';

const router: Router = Router();

// Crear un nuevo POI
router.post('/', POIController.createPOI);

// Obtener un POI por su ID
router.get('/:id', POIController.getPOIById);

// Actualizar un POI existente
router.put('/:id', POIController.updatePOI);

// Eliminar/desactivar un POI
router.delete('/:id', POIController.deletePOI);

// Buscar POIs cercanos a una ubicación
router.get('/nearby', POIController.findNearbyPOIs);

export default router;