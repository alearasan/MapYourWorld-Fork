import { Router } from 'express';
import { createMap, getMapById, updateMap, deleteMap } from '../controllers/map.controller';

const router: Router = Router();

router.post('/create', createMap);

router.get('/:mapId', getMapById);

router.put('/update/:mapId', updateMap );

router.delete('/delete/:mapId', deleteMap );


export default router;
