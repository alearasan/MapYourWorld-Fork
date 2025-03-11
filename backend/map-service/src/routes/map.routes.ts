import { Router } from 'express';
import { createMap, getMapById, updateMap, deleteMap, createMapColaborative, getUsersOnMapById } from '../controllers/map.controller';

const router: Router = Router();

router.post('/create', createMap);

router.post('/createColaborative', createMapColaborative);

router.get('/:mapId', getMapById);

router.put('/update/:mapId', updateMap );

router.get('/users/:mapId', getUsersOnMapById );

router.delete('/delete/:mapId', deleteMap );


export default router;
