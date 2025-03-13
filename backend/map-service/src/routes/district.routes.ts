import { Router } from 'express';
import { createDistrict, getDistrictById, getAllDistricts, unlockDistrict, getUserUnlockedDistricts, findDistrictContainingLocation, updateDistrict, getDistrictsByMapId, unlockCollaborativeDistrict } from '../controllers/district.controller';

const router: Router = Router();

router.post('/create', createDistrict);

router.get('/:districtId', getDistrictById);

router.get('/', getAllDistricts);

router.put('/update/:districtId', updateDistrict );

router.put('/unlock/:districtId/:userId', unlockDistrict);

router.put('/unlock/collaborative/:districtId/:userId/:mapId', unlockCollaborativeDistrict);

router.get('/user/unlock/:userId', getUserUnlockedDistricts);

router.get('/location/:latitude/:longitude', findDistrictContainingLocation);

router.get('/map/:mapId', getDistrictsByMapId);


export default router;
