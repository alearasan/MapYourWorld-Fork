import { Router } from 'express';
import { createDistrict, getDistrictById, getAllDistricts, unlockDistrict, getUserUnlockedDistricts, findDistrictContainingLocation, updateDistrict, getDistrictsByMapId, unlockCollaborativeDistrict, simulateUserPassingByDistrict, getUserDistrictsWithColors } from '../controllers/district.controller';
import { createDistricts } from '../services/district.service';

const router: Router = Router();

router.post('/create', createDistricts);

router.get('/:districtId', getDistrictById);

router.get('/', getAllDistricts);

router.put('/update/:districtId', updateDistrict );

router.put('/unlock/:districtId/:userId/:regionId', unlockDistrict);

router.put('/unlock/collaborative/:districtId/:userId/:mapId/:regionId', unlockCollaborativeDistrict);

router.get('/user/unlock/:userId', getUserUnlockedDistricts);

router.get('/location/:latitude/:longitude', findDistrictContainingLocation);

router.get('/map/:mapId', getDistrictsByMapId);

router.post('/simulate-passing/:userId/:districtId', simulateUserPassingByDistrict);

router.post('/collaborative/color-district/:userId/:districtId', simulateUserPassingByDistrict);

router.get('/user-districts/:userId', getUserDistrictsWithColors);


export default router;
