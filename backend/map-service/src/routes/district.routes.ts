import { Router } from 'express';
import { createDistrict, getDistrictById, getAllDistricts } from '@backend/map-service/src/controllers/district.controller';

const router: Router = Router();

router.post('/', createDistrict);
router.get('/', getAllDistricts);
router.get('/:id', getDistrictById);
// router.delete('/districts/:id', deleteDistrict);

export default router;
