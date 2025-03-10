import { Router } from 'express';
import {
  createRegion,
  getRegionById,
  getRegionByName,
  getAllRegions,
  updateRegion,
  deleteRegion
} from '../controllers/region.controller';

const router: Router = Router();

router.post('/region/create', createRegion);

router.get('/region/:regionId', getRegionById);

router.get('/region/name/:regionName', getRegionByName);

router.get('/regions', getAllRegions);

router.put('/regions/update/:regionId', updateRegion);

router.delete('/region/delete/:regionId', deleteRegion);


export default router;