import { Router } from 'express';
import { createDistrict, getDistrictById, getAllDistricts, unlockDistrict, getUserUnlockedDistricts, findDistrictContainingLocation, updateDistrict } from '../controllers/district.controller';

const router: Router = Router();

router.post('/create', createDistrict);

router.get('/:districtId', getDistrictById);

router.get('/', getAllDistricts);

router.put('/update/:districtId', updateDistrict );

router.put('/unlock/:districtId/:userId', unlockDistrict);

router.get('/districts/user/unlock/:userId', getUserUnlockedDistricts);

router.get('/districts/location/:latitude/:longitude', findDistrictContainingLocation);


export default router;
