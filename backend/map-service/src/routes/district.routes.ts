import { Router } from 'express';
import { createDistrict, getDistrictById, getAllDistricts, unlockDistrict, getUserUnlockedDistricts, findDistrictContainingLocation } from '@backend/map-service/src/controllers/district.controller';

const router: Router = Router();

router.post('/district/create', createDistrict);

router.get('/district/:districtId', getDistrictById);

router.get('/districts', getAllDistricts);

router.get('/districts/update/:districtId', getDistrictById);

router.get('/districts/unlock/:districtId/:userId', unlockDistrict);

router.get('/districts/unlock/:userId', getUserUnlockedDistricts);

router.get('/districts/location/:latitude/:longitude', findDistrictContainingLocation);


export default router;
